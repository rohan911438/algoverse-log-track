import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WalletProvider } from "./contexts/WalletContext";

createRoot(document.getElementById("root")!).render(
  <WalletProvider>
    <App />
  </WalletProvider>
);
