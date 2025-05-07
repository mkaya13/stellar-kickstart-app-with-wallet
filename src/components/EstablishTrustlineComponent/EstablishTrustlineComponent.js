import React from 'react';
import "./establishtrustlinecomponent.css";
import EstablishTrustline from '../../modules/EstablishTrustline';

const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;
const ASSET_CODE = process.env.REACT_APP_ASSET_CODE;
const ASSET_ISSUER = process.env.REACT_APP_ASSET_ISSUER;

export default function EstablishTrustlineComponent({ publicKey, kit }) {
  
  const EstablishTrustlineHandler = async () => {
    await EstablishTrustline(RPC_URL, ASSET_CODE, ASSET_ISSUER, publicKey, kit);

  }
  return (
    <div className="establish-trustline-feature">
      <h1>Establish Trustline Component</h1>
      <button onClick={EstablishTrustlineHandler} disabled={!publicKey}>
        Establish Trustline
      </button>
    </div>
  );
}
