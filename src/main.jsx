import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {MetaMaskProvider} from "@metamask/sdk-react";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: "Example React UI Dapp",
          url: window.location.href
        },
        infuraAPIKey: "210f27d3fbea4f8689fadcc8a6c5d048"
        // Other options.
      }}>
      <App />
    </MetaMaskProvider>
  </StrictMode>
);
