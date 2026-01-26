import { createRoot } from "react-dom/client";
import Providers from "./app/providers";
import "./assets/styles/import.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Providers />,
  // </StrictMode>
);
