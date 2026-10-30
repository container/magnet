"use client";

import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "../../src/App";
import { LanguageProvider } from "../../src/i18n";

export default function PrototypeSite() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <main className="app-loading">Nalaganje prototipa...</main>;

  return (
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  );
}
