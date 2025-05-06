import { useState } from "react";
import "./index.css";
import StellarWalletConnection from "./components/StellarWalletConnection/StellarWalletConnection";
import EstablishTrustlineComponent from "./components/EstablishTrustlineComponent/EstablishTrustlineComponent";
import HelloWorldGetUserNameComponent from "./components/HelloWorldGetUserNameComponent/HelloWorldGetUserNameComponent";
import HelloWorldWriteUserNameComponent from "./components/HelloWorldWriteUserNameComponent/HelloWorldWriteUserNameComponent";


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
      {walletInfo.publicKey && walletInfo.kit && (
        <HelloWorldGetUserNameComponent
          publicKey={walletInfo.publicKey}
          kit={walletInfo.kit}
        />
      )}
      {walletInfo.publicKey && walletInfo.kit && (
        <HelloWorldWriteUserNameComponent
          publicKey={walletInfo.publicKey}
          kit={walletInfo.kit}
        />
      )}

    </div>
  );
}

export default App;
