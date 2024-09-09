import React, {useState} from "react";
import {useSDK} from "@metamask/sdk-react";

const Navbar = () => {
  const [account, setAccount] = useState();
  const {sdk, connected, connecting, provider, chainId} = useSDK();
  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
      console.log(chainId);
      console.log(provider);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };
  return (
    <div className='App'>
      <button
        style={{padding: 10, margin: 10}}
        onClick={connect}>
        Connect
      </button>
      {connected && (
        <div>
          <>
            {chainId && `Connected chain: ${chainId}`}
            <p></p>
            {account && `Connected account: ${account}`}
          </>
        </div>
      )}
    </div>
  );
};

export default Navbar;
