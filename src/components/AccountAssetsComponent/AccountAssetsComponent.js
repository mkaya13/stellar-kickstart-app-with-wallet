import React, { useState, useEffect } from 'react';
import "./accountassetscomponent.css";
import FetchAssets from '../../modules/FetchAssets';
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;

export default function AccountAssetsComponent({ publicKey }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAssets = async () => {
          if (!publicKey) return;
          setLoading(true);
          const result = await FetchAssets(RPC_URL, publicKey);
          setAssets(result);
          setLoading(false);
        };
        loadAssets();
    }, [publicKey]);

    return (
        <div className="account-assets-feature">
            <h1>Account Assets Component</h1>
            <div className="wallet-assets">
                {!publicKey ? (
                  <p>Connect your wallet to Stellar Testnet.</p>
                ) : loading ? (
                  <p>Loading balances...</p>
                ) : assets.length === 0 ? (
                  <p>No assets found.</p>
                ) : (
                  <ul>
                    {assets.map((a, i) => (
                      <li key={i}>
                        {a.asset_type === 'native'
                          ? `XLM: ${parseFloat(a.balance).toFixed(2)}`
                          : `${a.asset_code}: ${parseFloat(a.balance).toFixed(2)} (issuer: ${a.asset_issuer.slice(0, 6)}...)`}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
        </div>
    )
}