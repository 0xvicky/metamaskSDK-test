import React, {useState, useEffect} from "react";
import {useSDK} from "@metamask/sdk-react";

const Navbar = () => {
  const [account, setAccount] = useState();
  const {sdk, connected, connecting, provider, chainId} = useSDK();

  useEffect(() => {
    if (connected && chainId !== "0x5618") {
      switchNetwork();
    }
  }, [chainId]);

  const switchNetwork = async () => {
    if (typeof window.ethereum !== "undefined") {
      const {ethereum} = window;

      const targetChainId = "0x5618"; // Example: Ethereum Mainnet (Hex: 0x1)
      try {
        // Specify the desired chainId (in hexadecimal)
        const chainId = await ethereum.request({method: "eth_chainId"});

        // Check if already connected to the desired chain
        if (chainId !== targetChainId) {
          console.log(`Current chain: ${chainId}, switching to ${targetChainId}`);

          // Attempt to switch the chain
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: targetChainId}]
          });

          // setCurrentChain(targetChainId);
          console.log(`Successfully switched to chain ${targetChainId}`);
        } else {
          console.log("Already connected to the correct chain");
        }
      } catch (error) {
        console.log("got into error");
        if (error.code === 4902) {
          // Chain not found, prompt user to add the network
          try {
            console.log("in try");
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: targetChainId,
                  chainName: "Airdao Testnet",
                  nativeCurrency: {
                    name: "AMB",
                    symbol: "AMB",
                    decimals: 18
                  },
                  rpcUrls: ["https://network.ambrosus-test.io/"], // Replace with your RPC URL
                  blockExplorerUrls: ["https://testnet.airdao.io/explorer/"]
                }
              ]
            });
            console.log("Network added and switched");
            // setCurrentChain(targetChainId);
          } catch (addError) {
            console.error("Error adding the chain:", addError);
          }
        } else {
          console.error("Error switching chain:", error);
        }
      }
    } else {
      console.log("MetaMask not detected!");
    }
  };

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
  const test = () => {
    console.log(connected);
  };
  return (
    <div className='App'>
      <button
        style={{padding: 10, margin: 10}}
        onClick={connect}>
        Connect
      </button>
      <button onClick={test}>Test</button>
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
