import { useState } from "react";
import BuyRealtyToken from "../../modules/BuyRealtyToken";
import "./buyrealtytokencomponent.css";

const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;
const CONTRACT_PUBLIC_KEY = process.env.REACT_APP_CONTRACT_PUBLIC_KEY;
const ASSET_CONTRACT_ADDRESS = process.env.REACT_APP_ASSET_CONTRACT_ADDRESS;

export default function BuyRealtyTokenComponent({ publicKey, kit }) {
  const [buyAmount, setBuyAmount] = useState('');
  const [submittedBuyAmount, setSubmittedBuyAmount] = useState('');

    const BuyRealtyTokenHandler = async () => {

      if (!publicKey) {
          alert("🚫 Wallet not connected.");
          return;
      }

      await BuyRealtyToken(RPC_URL, CONTRACT_PUBLIC_KEY, ASSET_CONTRACT_ADDRESS, buyAmount, publicKey, kit)

      // ✅ Update submittedUserName and clear input
      setSubmittedBuyAmount(buyAmount);
      setBuyAmount('');
      
  }

  return (
    <div className="buy-realty-token-feature">
      <h1>Buy Realty Token Component</h1>
      <input
        type="number"
        placeholder="Enter Buy Amount"
        value={buyAmount}
        onChange={(e) => setBuyAmount(e.target.value)}
      />
      <button onClick={BuyRealtyTokenHandler}>Buy</button>

      {setSubmittedBuyAmount && (
        <p style={{ color: 'green' }}>
          ✅ {submittedBuyAmount} Tokens Buy Amount Submitted <strong>{setSubmittedBuyAmount}</strong>
        </p>
      )}
    </div>
  );
}