import {
    TransactionBuilder,
    Account,
    Networks,
    nativeToScVal,
    xdr,
    Contract,
  } from '@stellar/stellar-sdk';
import axios from 'axios';

const BuyRealtyToken = async (RPC_URL, CONTRACT_PUBLIC_KEY, ASSET_CONTRACT_ADDRESS, buyAmount, publicKey, kit) => {

    if (!publicKey) {
        alert("🚫 Wallet not connected.");
        return;
    }

    // 1. Define Credentials
    const accountResponse = await axios.get(`${RPC_URL}/accounts/${publicKey}`);
    const sequence = accountResponse.data.sequence;
    const NETWORK_PASSPHRASE = Networks.TESTNET;
    const contract = new Contract(CONTRACT_PUBLIC_KEY);
    const account = new Account(publicKey, sequence);

    // 2. Convert Function Parameter to nativeToScVal

    const raw_asset_address = nativeToScVal(ASSET_CONTRACT_ADDRESS, { type: 'address' });
    const raw_buyer_address = nativeToScVal(publicKey, { type: 'address' });
    const raw_asset_amount = nativeToScVal((Number(buyAmount)* 10000000).toString(), { type: 'i128' });
    
    // 3. Built the Transaction

    let tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('buy_realty_token', raw_asset_address, raw_buyer_address, raw_asset_amount))
      .setTimeout(30)
      .build();

    // 4. Simulate the Response

    const simResponse = await axios.post(
        RPC_URL,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'simulateTransaction',
          params: { transaction: tx.toXDR() },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
    );

    // 5. Get the transactionData

    const transactionData = simResponse.data.result.transactionData;

    // 6. Decode a base64-encoded string (transactionData) into a SorobanTransactionData object

    const sorobanData = xdr.SorobanTransactionData.fromXDR(transactionData, 'base64');

    // 7. Grap the Updated Fee

    const updatedFee = (parseInt(simResponse.data.result.minResourceFee) + 100).toString();
    const txnAccount = new Account(publicKey, sequence);

    // 8. Build the Transaction Data with the Simulated Transaction Response

    tx = new TransactionBuilder(txnAccount, {
      fee: updatedFee,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(
        'buy_realty_token',
        raw_asset_address,
        raw_buyer_address,
        raw_asset_amount
      ))
      .setTimeout(30)
      .setSorobanData(sorobanData)
      .build();    
      
    // 9. Add authEntries into the transaction (for require.auth(buyer))
    
    const authEntries = simResponse.data.result.results[0].auth.map((entryXdr) =>
      xdr.SorobanAuthorizationEntry.fromXDR(entryXdr, "base64")
    );

    // Add into operation call (the raw XDR operation)
    tx._tx._attributes.operations[0]._attributes.body._value._attributes.auth = authEntries;

    // 10. Ask StellarWalletsKit to sign the transaction
    
    const { signedTxXdr } = await kit.signTransaction(tx.toXDR(), {
      address: publicKey,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // 11. Submit the Transaction Request

    const submitResponse = await axios.post(
        RPC_URL,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'sendTransaction',
          params: { transaction: signedTxXdr.toString() },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
    );

    console.log("11 Submit Response", submitResponse)
    
}

export default BuyRealtyToken;