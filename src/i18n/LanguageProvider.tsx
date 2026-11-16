"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, type Lang, type Dict } from "./translations";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Dict;
}

const Context = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(
    () => setLang(lang === "en" ? "ua" : "en"),
    [lang, setLang]
  );

  return (
    <Context.Provider value={{ lang, setLang, toggle, t: translations[lang] }}>
      {children}
    </Context.Provider>
  );
}

export function useLang() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
