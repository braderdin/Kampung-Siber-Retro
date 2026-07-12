import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ThemeMode = 'modern' | 'crt';
type ActiveTab = 'html' | 'css' | 'js';

interface EditorState {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  activeTab: ActiveTab;
  themeMode: ThemeMode;
  isSaving: boolean;
}

interface EditorActions {
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setThemeMode: (mode: ThemeMode) => void;
  resetToDefaults: () => void;
  setIsSaving: (saving: boolean) => void;
}

const RETRO_GREETING_CARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kampung Siber Retro</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #00ff00;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 30px;
      backdrop-filter: blur(10px);
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }
    h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
      text-shadow: 0 0 10px #00ff00;
    }
    p {
      font-size: 1.2em;
      line-height: 1.6;
    }
    .scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 2px,
        transparent 2px,
        transparent 4px
      );
      pointer-events: none;
      animation: scan 4s linear infinite;
    }
    @keyframes scan {
      0% { transform: translateY(0); }
      100% { transform: translateY(-100%); }
    }
  </style>
</head>
<body>
  <div class="scanline"></div>
  <div class="card">
    <h1>🖥️ Welcome to Kampung Siber Retro</h1>
    <p>
      Your enterprise-grade retro workspace platform<br/>
      is now initialized and ready for development.<br/>
      <strong>Code. Compile. Conquer.</strong>
    </p>
  </div>
</body>
</html>`;

const DEFAULT_CSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: #0a0a0a;
  color: #00ff00;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.display {
  background: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
}

.title {
  font-size: 1.5em;
  margin-bottom: 10px;
  text-shadow: 0 0 5px #00ff00;
}

.content {
  font-size: 1em;
}
`;

const DEFAULT_JS = `document.addEventListener('DOMContentLoaded', function() {
  console.log('%c🖥️ Kampung Siber Retro Workspace', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  console.log('%cReady for enterprise-grade retro development.', 'color: #00ff00;');
  
  function simulateCRTFlicker() {
    const body = document.body;
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        body.style.filter = 'brightness(' + (0.8 + Math.random() * 0.4) + ')';
        setTimeout(() => {
          body.style.filter = 'brightness(1)';
        }, 50);
      }
    }, 100);
    
    return () => clearInterval(flickerInterval);
  }
  
  const stopFlicker = simulateCRTFlicker();
  
  window.addEventListener('beforeunload', stopFlicker);
});
`;

export const useEditorStore = create<EditorState & EditorActions>()(
  devtools((set, get) => ({
    htmlCode: RETRO_GREETING_CARD_HTML,
    cssCode: DEFAULT_CSS,
    jsCode: DEFAULT_JS,
    activeTab: 'html',
    themeMode: 'modern',
    isSaving: false,
    setHtmlCode: (code: string) => set({ htmlCode: code }),
    setCssCode: (code: string) => set({ cssCode: code }),
    setJsCode: (code: string) => set({ jsCode: code }),
    setActiveTab: (tab: ActiveTab) => set({ activeTab: tab }),
    setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
    setIsSaving: (saving: boolean) => set({ isSaving: saving }),
    resetToDefaults: () => set({
      htmlCode: RETRO_GREETING_CARD_HTML,
      cssCode: DEFAULT_CSS,
      jsCode: DEFAULT_JS,
      activeTab: 'html',
      themeMode: 'modern',
      isSaving: false,
    }),
  }))
);

export type { EditorState, EditorActions, ThemeMode, ActiveTab };
