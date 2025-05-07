import React from 'react';
import {
  TransactionBuilder,
  Account,
  Networks,
  Asset,
  Operation,
} from '@stellar/stellar-sdk';
import axios from 'axios';

// modules/EstablishTrustline.js
const EstablishTrustline = async (RPC_URL, ASSET_CODE, ASSET_ISSUER, publicKey, kit) => {

    try {

        // 1. Load account details
        const accountResponse = await axios.get(`${RPC_URL}/accounts/${publicKey}`);
        const sequence = accountResponse.data.sequence;
        const account = new Account(publicKey, sequence);
        
        // 2. Create asset
        const asset = new Asset(ASSET_CODE, ASSET_ISSUER);

        // 3. Define Network Phrase
        const NETWORK_PASSPHRASE = Networks.TESTNET;

        // 4. Build the Transaction
        const tx = new TransactionBuilder(account, {
          fee: '100',
          networkPassphrase: NETWORK_PASSPHRASE,
        })
          .addOperation(Operation.changeTrust({ asset }))
          .setTimeout(30)
          .build();

        // 5. Ask StellarWalletsKit (Freighter) to sign the transaction
        const { signedTxXdr } = await kit.signTransaction(tx.toXDR(), {
          address: publicKey,
          networkPassphrase: NETWORK_PASSPHRASE,
        });

        // 6. Submit the signed transaction
        const formData = new URLSearchParams();
        formData.append('tx', signedTxXdr);
        
        const response = await axios.post(`${RPC_URL}/transactions`, formData.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Return the Trustline Established Alert
        console.log('✅ Trustline established:', response.data);
        alert('✅ Trustline established successfully!');

    }

    catch(error) {
        
      // Return the Trustline Failed Alert
      console.error('❌ Failed to establish trustline:', error.response?.data || error.message);
      alert('❌ Failed to establish trustline.');
    }

};
  
  export default EstablishTrustline;

