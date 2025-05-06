import React from 'react';
import {
  TransactionBuilder,
  Account,
  Networks,
  Asset,
  Operation,
} from '@stellar/stellar-sdk';
import axios from 'axios';

const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;
const ASSET_CODE = process.env.REACT_APP_ASSET_CODE;
const ASSET_ISSUER = process.env.REACT_APP_ASSET_ISSUER;

export default function EstablishTrustlineComponent({ publicKey, kit }) {
  const establishTrustline = async () => {
    if (!publicKey) {
      alert("🚫 Wallet not connected.");
      return;
    }

    try {
      
      // Get the NETWORK_PASSPHRASE
      const NETWORK_PASSPHRASE = Networks.TESTNET;

      // 1. Load account details to get sequence number
      const accountResponse = await axios.get(`${RPC_URL}/accounts/${publicKey}`);
      const sequence = accountResponse.data.sequence;
      const account = new Account(publicKey, sequence);

      // 2. Create asset
      const asset = new Asset(ASSET_CODE, ASSET_ISSUER);

      // 3. Build transaction
      const tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(Operation.changeTrust({ asset }))
        .setTimeout(30)
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

      console.log('✅ Trustline established:', response.data);
      alert('✅ Trustline established successfully!');
    } catch (error) {
      console.error('❌ Failed to establish trustline:', error.response?.data || error.message);
      alert('❌ Failed to establish trustline.');
    }
  };

  return (
    <div>
      <button onClick={establishTrustline} disabled={!publicKey}>
        Establish Trustline
      </button>
    </div>
  );
}
