import {
  TransactionBuilder,
  Account,
  Networks,
  Contract,
  scValToNative,
  xdr
} from '@stellar/stellar-sdk';
import axios from 'axios';

const FetchUserName = async (RPC_URL, CONTRACT_PUBLIC_KEY, publicKey) => {

    // 1. Set the Credentials
    const NETWORK_PASSPHRASE = Networks.TESTNET;
    const contract = new Contract(CONTRACT_PUBLIC_KEY);

    // 2. Retrieve Account
    const account = new Account(publicKey, "0");

    // 3. Build Transaction
    const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call("get_user_name"))
    .setTimeout(30)
    .build();

    // 4. This gives base64 XDR, which is correct!
    const simXDR = tx.toXDR();

    // 5. Fetch the Response
    const response = await axios.post(
      RPC_URL,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "simulateTransaction",
        params: {
          transaction: simXDR,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 6. Return SC Val
    const resultScVal = response.data.result.results[0].xdr;

    // 7. Convert it to Raw
    const raw = Buffer.from(resultScVal, "base64");

    // 8. Decode the raw XDR
    const scVal = xdr.ScVal.fromXDR(raw); // decode raw XDR to object
    
    // 9. Convert it to JS String
    const result = scValToNative(scVal);     // convert to JS string
    return result;
}

export default FetchUserName;
