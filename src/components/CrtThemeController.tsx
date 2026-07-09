
import { useEffect, useState, createContext, useContext } from 'react';

// Create a context for the theme state
const CrtThemeContext = createContext();

// Create a provider for the theme state
export const CrtThemeProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedValue = window.localStorage.getItem('retro-crt-enabled');
    if (storedValue !== null) {
      setEnabled(storedValue === 'true');
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const root = document.documentElement;
    root.classList.toggle('crt-enabled', enabled);
    window.localStorage.setItem('retro-crt-enabled', enabled ? 'true' : 'false');

    if (enabled) {
      root.style.setProperty('--neon-glow-protection', 'true');
      root.style.setProperty('--shadow-clipping-fix', '0 0 15px rgba(255, 0, 127, 0.3)');
    } else {
      root.style.removeProperty('--neon-glow-protection');
      root.style.removeProperty('--shadow-clipping-fix');
    }
  }, [enabled, isClient]);

  return (
    <CrtThemeContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </CrtThemeContext.Provider>
  );
};

// Use the context in the component
export default function CrtThemeController() {
  const { enabled, setEnabled } = useContext(CrtThemeContext);

  const handleToggle = () => {
    setEnabled((current) => !current);
  };

  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={handleToggle}
      className={ounded border px-3 py-2 text-xs font-semibold transition-all duration-300 ${enabled
        ? 'border-pink-400 bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 shadow-[0_0_15px_rgba(255,0,127,0.3)]'
        : 'border-cyan-400 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'`}
    >
      {enabled ? 'Penapis CRT Aktif' : 'Aktifkan Penapis CRT'}
    </button>
  );
}
