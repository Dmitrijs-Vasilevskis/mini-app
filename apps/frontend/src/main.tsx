import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TelegramProvider } from "./providers/telegram/TelegramProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TelegramProvider>
      <App />
    </TelegramProvider>
  </StrictMode>
);
