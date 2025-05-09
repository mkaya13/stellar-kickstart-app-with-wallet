import React, {useState} from 'react';
import "./helloworldgetusernamecomponent.css";
import FetchUserName from '../../modules/FetchUserName';
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;
const CONTRACT_PUBLIC_KEY = process.env.REACT_APP_HELLO_WORLD_CONTRACT_PUBLIC_KEY;

export default function HelloWorldGetUserNameComponent ({ publicKey }) {

    const [userName, setUserName] = useState("");

    const ReadUserNameHandler = async () => {

      if (!publicKey) {
        alert("🚫 Wallet not connected.");
        return;
      }

      const fetched_user_name = await FetchUserName(RPC_URL, CONTRACT_PUBLIC_KEY, publicKey);
      setUserName(fetched_user_name);
  
    }
    
    return (
        <div className="read-user-feature">
            <h1>Hello World Get User Name Component</h1>
            <h2>The user name is: {userName}</h2>
            <button onClick={ReadUserNameHandler}>Return the User Name</button>
        </div>
    )
}