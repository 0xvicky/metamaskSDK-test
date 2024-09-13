import React, {useState, useEffect} from "react";
import {useSDK} from "@metamask/sdk-react";

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const {sdk, connected, chainId} = useSDK();
  const targetChainId = "0x5618"; // Target Chain (Airdao Testnet)

  // Switch network if connected and not on the desired chain
  useEffect(() => {
    const {ethereum} = window;

    if (connected && chainId !== targetChainId) {
      switchNetwork(ethereum);
    }
  }, [chainId, connected]);

  // Track account changes in MetaMask
  useEffect(() => {
    const {ethereum} = window;
    if (ethereum && ethereum.isMetaMask) {
      const handleAccountsChanged = accounts => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      };

      ethereum
        .request({method: "eth_accounts"})
        .then(handleAccountsChanged)
        .catch(console.error);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => ethereum.removeListener("accountsChanged", handleAccountsChanged);
    } else {
      console.log("MetaMask is not installed.");
    }
  }, []);

  // Function to switch network
  const switchNetwork = async ethereum => {
    try {
      const currentChainId = await ethereum.request({method: "eth_chainId"});
      if (currentChainId !== targetChainId) {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{chainId: targetChainId}]
        });
        console.log(`Switched to chain ${targetChainId}`);
      }
    } catch (error) {
      handleSwitchError(error, ethereum);
    }
  };

  // Handle chain switching error
  const handleSwitchError = async (error, ethereum) => {
    if (error.code === 4902) {
      // Chain not found, add and switch
      try {
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
              rpcUrls: ["https://network.ambrosus-test.io/"],
              blockExplorerUrls: ["https://testnet.airdao.io/explorer/"]
            }
          ]
        });
        console.log("Network added and switched");
      } catch (addError) {
        console.error("Error adding the chain:", addError);
      }
    } else {
      console.error("Error switching chain:", error);
    }
  };

  // Connect MetaMask wallet
  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("Failed to connect:", err);
    }
  };

  return (
    <div className='App'>
      <button
        style={{padding: 10, margin: 10}}
        onClick={connect}>
        {connected ? "Connected" : "Connect"}
      </button>

      {connected && (
        <div>
          {chainId && <p>Connected chain: {chainId}</p>}
          {account && <p>Connected account: {account}</p>}
        </div>
      )}
    </div>
  );
};

export default Navbar;
