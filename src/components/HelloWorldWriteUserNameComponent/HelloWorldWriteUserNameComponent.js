import { useState } from 'react';
import "./helloworldwriteusernamecomponent.css";
import WriteUserName from '../../modules/WriteUserName';

export default function WriteUserNameComponent({ publicKey, kit}) {
  const [newUserName, setNewUserName] = useState('');
  const [submittedUserName, setSubmittedUserName] = useState('');

  const CONTRACT_PUBLIC_KEY = process.env.REACT_APP_HELLO_WORLD_CONTRACT_PUBLIC_KEY;
  const RPC_URL = process.env.REACT_APP_TESTNET_RPC_URL;

  const changeUserNameHandler = async () => {

    if (!publicKey) {
      alert("🚫 Wallet not connected.");
      return;
    }

    await WriteUserName(RPC_URL, CONTRACT_PUBLIC_KEY, newUserName, publicKey, kit) 

    // ✅ Update submittedUserName and clear input
    setSubmittedUserName(newUserName);
    setNewUserName('');

  };

  return (
    <div className="write-user-feature">
      <h1>Write User Name Component</h1>
      <input
        type="text"
        placeholder="Enter New User Name"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
      />
      <button onClick={changeUserNameHandler}>Change User Name</button>

      {/* Optional feedback */}
      {submittedUserName && (
        <p style={{ color: 'green' }}>
          ✅ Username submitted: <strong>{submittedUserName}</strong>
        </p>
      )}
    </div>
  );
}