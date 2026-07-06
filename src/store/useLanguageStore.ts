// Start: Imports
import { create } from 'zustand';
// End: Imports

// Start: Type Definitions
type Language = 'en' | 'ms';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}
// End: Type Definitions

// Start: Language Store Creation
export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}));
// End: Language Store Creation
