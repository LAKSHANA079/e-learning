import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

// Register Service Worker for PWA Offline Functionality (Experiment 2d)
if ("serviceWorker" in navigator && typeof window !== "undefined") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        console.log("EduLearn PWA Service Worker active with scope:", reg.scope);
      })
      .catch((err) => {
        console.warn("PWA Service Worker registration skipped or failed:", err);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
