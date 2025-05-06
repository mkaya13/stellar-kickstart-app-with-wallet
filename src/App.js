import { useState } from "react";
import "./index.css";
import StellarWalletConnection from "./components/StellarWalletConnection/StellarWalletConnection";
import EstablishTrustlineComponent from "./components/EstablishTrustlineComponent/EstablishTrustlineComponent";


function App() {

  const [walletInfo, setWalletInfo] = useState({
    publicKey: null,
    kit: null,
  });


  return (
    <div className="App">
      <StellarWalletConnection onConnect={setWalletInfo} />
      {walletInfo.publicKey && walletInfo.kit && (
        <EstablishTrustlineComponent
          publicKey={walletInfo.publicKey}
          kit={walletInfo.kit}
        />
      )}
    </div>
  );
}

export default App;
