"use client";

import { useLanguageStore } from "@/store/useLanguageStore";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'en' | 'ms')}
      className="retro-select"
    >
      <option value="en">EN</option>
      <option value="ms">BM</option>
    </select>
  );
}
