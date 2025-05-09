import {
    TransactionBuilder,
    Account,
    Networks,
    nativeToScVal,
    xdr,
    Contract
  } from '@stellar/stellar-sdk';
import axios from 'axios';

const WriteUserName = async (RPC_URL, CONTRACT_PUBLIC_KEY, newUserName, publicKey, kit) => {

    // 1. Define Credentials
    const accountResponse = await axios.get(`${RPC_URL}/accounts/${publicKey}`);
    const sequence = accountResponse.data.sequence;
    const NETWORK_PASSPHRASE = Networks.TESTNET;
    const contract = new Contract(CONTRACT_PUBLIC_KEY);
    const account = new Account(publicKey, sequence);

    // 2. Convert Function Parameter to nativeToScVal
    const raw = nativeToScVal(newUserName, { type: 'symbol' });
    const symbolArg = xdr.ScVal.fromXDR(xdr.ScVal.toXDR(raw));

    // 3. Built the Transaction
    let tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('set_user_name', symbolArg))
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

    const authEntriesXdr = simResponse.data.result
    console.log("authEntriesXdr", authEntriesXdr)

    console.log("-----------------------------------------------------")

    // 5. Get the transactionData
    const transactionData = simResponse.data.result.transactionData;
    console.log("transactionData", transactionData)

    // 6. Decode a base64-encoded string (transactionData) into a SorobanTransactionData object
    const sorobanData = xdr.SorobanTransactionData.fromXDR(transactionData, 'base64');

    // Check the switch
    console.log("🧪 sorobanData switch value:", sorobanData.ext().switch()); // 🔥 MUST be 1

    // 7. Grap the Updated Fee
    const updatedFee = (parseInt(simResponse.data.result.minResourceFee) + 100).toString();
    const txnAccount = new Account(publicKey, sequence);

    // 8. Build the Transaction Data with the Simulated Transaction Response
    tx = new TransactionBuilder(txnAccount, {
        fee: updatedFee,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('set_user_name', symbolArg))
        .setTimeout(30)
        .setSorobanData(sorobanData)
        .build();

    // 9. Ask StellarWalletsKit (Freighter) to sign the transaction
    const { signedTxXdr } = await kit.signTransaction(tx.toXDR(), {
            address: publicKey,
            networkPassphrase: NETWORK_PASSPHRASE,
    });

    // 10. Submit the Transaction Request
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

    console.log("SubmitResponse", submitResponse);

};
  
  export default WriteUserName;
  