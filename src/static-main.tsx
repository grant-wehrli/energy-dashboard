import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppShell } from "@/components/layout/AppShell";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
);
