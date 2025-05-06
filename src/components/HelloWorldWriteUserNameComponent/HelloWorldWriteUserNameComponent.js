import React, { useState } from 'react';
import {
  TransactionBuilder,
  Account,
  Networks,
  nativeToScVal,
  xdr,
  Contract
} from '@stellar/stellar-sdk';
import axios from 'axios';


const CONTRACT_ID = process.env.REACT_APP_CONTRACT_PUBLIC_KEY;
const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;
const NETWORK_PASSPHRASE = Networks.TESTNET;

export default function HelloWorldGetUserNameComponent ({ publicKey, kit }) {

    const [newUserName, setNewUserName] = useState('');
    const [submittedUserName, setSubmittedUserName] = useState('');

    const changeUserName = async () => {
        if (!publicKey) {
          alert("🚫 Wallet not connected.");
          return;
        }

    // Define Contract
    const contract = new Contract(CONTRACT_ID);

    // Load account details to get sequence number
    const accountResponse = await axios.get(`${RPC_URL}/accounts/${publicKey}`);
    const sequence = accountResponse.data.sequence;
    const account = new Account(publicKey, sequence);

    const raw = nativeToScVal(newUserName, { type: 'symbol' });
    const symbolArg = xdr.ScVal.fromXDR(xdr.ScVal.toXDR(raw));

    let tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('set_user_name', symbolArg))
        .setTimeout(30)
        .build();

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

    console.log("simResponse:", simResponse)

    const transactionData = simResponse.data.result.transactionData;
    const sorobanData = xdr.SorobanTransactionData.fromXDR(transactionData, 'base64');
    const updatedFee = (parseInt(simResponse.data.result.minResourceFee) + 100).toString();
    const txnAccount = new Account(publicKey, sequence);

    tx = new TransactionBuilder(txnAccount, {
        fee: updatedFee,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('set_user_name', symbolArg))
        .setTimeout(30)
        .setSorobanData(sorobanData)
        .build();



    // 4. Ask StellarWalletsKit (Freighter) to sign the transaction
    const { signedTxXdr } = await kit.signTransaction(tx.toXDR(), {
      address: publicKey,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // 5. Submit the signed transaction
    const formData = new URLSearchParams();
    formData.append('tx', signedTxXdr);

    const response = await axios.post(`${RPC_URL}/transactions`, formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log('Write Transaction Response', response);

    // ✅ Update submittedUserName and clear input
    setSubmittedUserName(newUserName);
    setNewUserName('');
    }   

    return (
        <div>
            <h1>Hello World Write User Name Component</h1>
            <input
              type="text"
              placeholder="Enter New User Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <button onClick={changeUserName}>Change User Name</button>

            {/* Optional feedback */}
            {submittedUserName && (
              <p style={{ color: 'green' }}>
                ✅ Username submitted: <strong>{submittedUserName}</strong>
              </p>
            )}
        </div>
    )
}

