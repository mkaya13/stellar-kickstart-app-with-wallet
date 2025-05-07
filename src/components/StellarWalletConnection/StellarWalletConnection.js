import React, { useState, useEffect } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  FreighterModule,
} from '@creit.tech/stellar-wallets-kit';
import './stellarwalletconnection.css';
import stellarLogo from "../../assets/stellar-xlm-logo.svg";
import FetchAssets from '../../modules/FetchAssets';

const StellarWalletConnection = ({ onConnect }) => {
  const [connectedWalletPublicKey, setConnectedWalletPublicKey] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const kit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: FREIGHTER_ID,
    modules: [new FreighterModule()],
  });

  const connectWallet = async () => {
    await kit.openModal({
      onWalletSelected: async (option) => {
        kit.setWallet(option.id);
        const { address } = await kit.getAddress();
        setConnectedWalletPublicKey(address);
        onConnect({ publicKey: address, kit });
      }
    });
  };

  useEffect(() => {
    const fetchConnectedWallet = async () => {
      try {
        const { address } = await kit.getAddress();
        if (address) {
          setConnectedWalletPublicKey(address);
          onConnect({ publicKey: address, kit });
        }
      } catch (error) {
        // Wallet not connected yet
      }
    };

    fetchConnectedWallet();
  }, []);

  const abbreviate = (addr) => `${addr.slice(0, 3)}...${addr.slice(-4)}`;

  useEffect(() => {
    const loadAssets = async () => {
      if (!connectedWalletPublicKey) return;
      setLoading(true);
      const result = await FetchAssets(connectedWalletPublicKey);
      setAssets(result);
      setLoading(false);
    };
    loadAssets();
  }, [connectedWalletPublicKey]);

  return (
    <div className="wallet-feature">
      <h1>Stellar Wallet Connection Component</h1>

      {connectedWalletPublicKey ? (
        <div className="wallet-connected-btn">
          <span className="wallet-address">{abbreviate(connectedWalletPublicKey)}</span>
          <img src={stellarLogo} alt="Stellar Icon" className="stellar-icon" />
        </div>
      ) : (
        <button className="custom-wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <span className="connection-status">
        {connectedWalletPublicKey ? `Address: ${connectedWalletPublicKey}` : "Not connected"}
      </span>
    </div>
  );
};

export default StellarWalletConnection;
