import React from "react";
import { ThemeProvider } from "next-themes";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import InstallPrompt from "@/components/InstallPrompt"; // ✅ only keep this one

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class">
        <App />
        <InstallPrompt />
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
