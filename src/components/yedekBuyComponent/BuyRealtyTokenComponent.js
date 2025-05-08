import { useState } from 'react';
import {
    TransactionBuilder,
    Account,
    Networks,
    nativeToScVal,
    xdr,
    Contract,
    Address
  } from '@stellar/stellar-sdk';
import axios from 'axios';
import "./buyrealtytokencomponent.css";

const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;
const CONTRACT_PUBLIC_KEY = process.env.REACT_APP_CONTRACT_PUBLIC_KEY;
const ASSET_CONTRACT_ADDRESS = process.env.REACT_APP_ASSET_CONTRACT_ADDRESS;

export default function BuyRealtyTokenComponent({ publicKey, kit }) {

    const BuyRealtyTokenHandler = async () => {
        
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
      console.log("1")

      // 2. Convert Function Parameter to nativeToScVal

      const raw_asset_address = nativeToScVal(ASSET_CONTRACT_ADDRESS, { type: 'address' });
      const raw_buyer_address = nativeToScVal(publicKey, { type: 'address' });
      const raw_asset_amount = nativeToScVal("20000000", { type: 'i128' });
      console.log("PUBLICKEY:", publicKey)
      
      // const symbolAssetAddressArg = xdr.ScVal.fromXDR(xdr.ScVal.toXDR(raw_asset_address));
      // const symbolBuyerAddressArg = xdr.ScVal.fromXDR(xdr.ScVal.toXDR(raw_buyer_address));
      // const symbolAssetAmountArg = xdr.ScVal.fromXDR(xdr.ScVal.toXDR(raw_asset_amount));

      console.log(raw_asset_address);
      console.log(raw_buyer_address);
      console.log(raw_asset_amount);
      console.log("2")

      // 3. Built the Transaction

      let tx = new TransactionBuilder(account, {
          fee: '100',
          networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('buy_realty_token', raw_asset_address, raw_buyer_address, raw_asset_amount))
        .setTimeout(30)
        .build();

      console.log("3")

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

      console.log("4 simResponse", simResponse)

      // 5. Get the transactionData

      const transactionData = simResponse.data.result.transactionData;

      console.log("5", transactionData)

      // 6. Decode a base64-encoded string (transactionData) into a SorobanTransactionData object

      const sorobanData = xdr.SorobanTransactionData.fromXDR(transactionData, 'base64');

      console.log("6")

      // 7. Grap the Updated Fee

      const updatedFee = (parseInt(simResponse.data.result.minResourceFee) + 100).toString();
      const txnAccount = new Account(publicKey, sequence);
      console.log("7")

      // 8. Build the Transaction Data with the Simulated Transaction Response

      tx = new TransactionBuilder(txnAccount, {
        fee: updatedFee,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(contract.call('buy_realty_token', raw_asset_address, raw_buyer_address, raw_asset_amount))
      .setTimeout(30)
      .setSorobanData(sorobanData)
      .build();

      console.log("TX", tx);

      // 9. Ask StellarWalletsKit to sign the transaction

      const { signedTxXdr } = await kit.signTransaction(tx.toXDR(), {
        address: publicKey,
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      console.log("9 signedTxXdr", signedTxXdr)

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

      console.log("Kit address:", kit);
      console.log("10")
      console.log("SubmitResponse", submitResponse);

  }

  return (
    <div className="buy-realty-token-feature">
      <h1>Buy Realty Token Component</h1>
        <button onClick={BuyRealtyTokenHandler}>Click to buy</button>
    </div>
  );
}

