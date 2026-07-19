"use client";

import { useEffect } from "react";

export function SetHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.classList.add("dark");
  }, [locale]);

  return null;
}
