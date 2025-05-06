import React, {useState} from 'react';
import {
  TransactionBuilder,
  Account,
  Networks,
  Asset,
  Operation,
  Contract,
  scValToNative,
  xdr
} from '@stellar/stellar-sdk';
import axios from 'axios';

import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;
const contract = new Contract(process.env.REACT_APP_HELLO_WORLD_CONTRACT_PUBLIC_KEY);
const NETWORK_PASSPHRASE = Networks.TESTNET;

export default function HelloWorldGetUserNameComponent ({ publicKey }) {

    const [userName, setUserName] = useState("");

    const readUserName = async () => {
        if (!publicKey) {
          alert("🚫 Wallet not connected.");
          return;
        }
    
        const account = new Account(publicKey, "0");

        // Build tx
        const tx = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: NETWORK_PASSPHRASE,
        })
        .addOperation(contract.call("get_user_name"))
        .setTimeout(30)
        .build();
    
        // 🚨 This gives base64 XDR, which is correct!
        const simXDR = tx.toXDR();
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

        const resultScVal = response.data.result.results[0].xdr;
        const raw = Buffer.from(resultScVal, "base64");
        const scVal = xdr.ScVal.fromXDR(raw); // decode raw XDR to object
        const result = scValToNative(scVal);     // convert to JS string
    
        console.log("Result:", result)
        console.log("The response:", response.data.result.results[0].xdr)
    
        setUserName(result)

    }
    
    return (
        <div>
            <h1>Hello World Get User Name Component</h1>
            <h2>The user name is: {userName}</h2>
            <button onClick={readUserName}>Return the User Name</button>
        </div>
    )
}