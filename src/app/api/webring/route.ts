import { NextResponse } from 'next/server';

// Webring configuration with three functional links
const WEBSITE_CONFIG = {
  previousSite: {
    name: 'Previous Site',
    url: '/site/cyber-pioneer',
    label: '[Previous Site]',
  },
  hubSite: {
    name: 'Kampung Siber Hub',
    url: '/dashboard',
    label: '[Kampung Siber Hub]',
  },
  nextSite: {
    name: 'Next Site',
    url: '/site/retro-hacker',
    label: '[Next Site]',
  },
};

// Generate the retro HTML webring banner
function generateWebringHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retro Webring</title>
  <style>
    :root {
      --retro-cyan: #00ffff;
      --retro-pink: #ff00ff;
      --retro-yellow: #ffff00;
      --retro-red: #ff0000;
      --retro-green: #00ff00;
      --retro-purple: #8a2be2;
      --retro-bg-dark: #0a0a1a;
      --retro-bg-medium: #1a1a2a;
      --retro-text: #e0e0e0;
      --retro-border: #00ffff;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: linear-gradient(135deg, var(--retro-bg-dark) 0%, var(--retro-bg-medium) 100%);
      font-family: 'Courier New', Courier, monospace;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
    }
    
    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--retro-cyan), var(--retro-pink), var(--retro-yellow), var(--retro-green), var(--retro-purple));
      animation: scanline 2s linear infinite;
    }
    
    @keyframes scanline {
      0% { background-position: 0% 0; }
      100% { background-position: 100% 0; }
    }
    
    .webring-container {
      background: rgba(26, 26, 42, 0.8);
      border: 3px solid var(--retro-border);
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      max-width: 400px;
      width: 90%;
    }
    
    .webring-container::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      height: 10px;
      background: linear-gradient(90deg, var(--retro-red), var(--retro-yellow), var(--retro-green), var(--retro-cyan), var(--retro-pink));
      border-radius: 8px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .webring-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--retro-text);
      margin-bottom: 20px;
      text-shadow: 0 0 10px var(--retro-cyan);
      letter-spacing: 3px;
    }
    
    .webring-title span {
      color: var(--retro-cyan);
    }
    
    .webring-links {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .webring-link {
      display: inline-block;
      width: 100%;
      padding: 12px 20px;
      background: linear-gradient(135deg, var(--retro-bg-medium), var(--retro-bg-dark));
      border: 2px solid var(--retro-border);
      border-radius: 4px;
      text-decoration: none;
      color: var(--retro-text);
      font-size: 1rem;
      font-weight: bold;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .webring-link:hover {
      background: linear-gradient(135deg, var(--retro-border), var(--retro-bg-medium));
      transform: translateY(-2px);
      box-shadow: 0 0 15px var(--retro-cyan);
      color: var(--retro-cyan);
    }
    
    .webring-link:active {
      transform: translateY(0);
    }
    
    .webring-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
      transition: 0.5s;
    }
    
    .webring-link:hover::before {
      left: 100%;
    }
    
    .webring-link.previous {
      border-color: var(--retro-cyan);
    }
    
    .webring-link.previous:hover {
      box-shadow: 0 0 15px var(--retro-cyan);
    }
    
    .webring-link.hub {
      border-color: var(--retro-pink);
    }
    
    .webring-link.hub:hover {
      box-shadow: 0 0 15px var(--retro-pink);
    }
    
    .webring-link.next {
      border-color: var(--retro-green);
    }
    
    .webring-link.next:hover {
      box-shadow: 0 0 15px var(--retro-green);
    }
    
    .webring-footer {
      margin-top: 25px;
      padding-top: 15px;
      border-top: 1px dashed var(--retro-border);
      font-size: 0.8rem;
      color: var(--retro-cyan);
      opacity: 0.7;
    }
    
    .glitch-effect {
      animation: glitch 3s infinite;
    }
    
    @keyframes glitch {
      0% { transform: none; }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: none; }
    }
  </style>
</head>
<body>
  <div class="webring-container glitch-effect">
    <div class="webring-title">
      <span><</span>
      Kampung Siber Webring
      <span>/></span>
    </div>
    <div class="webring-links">
      <a href="${WEBSITE_CONFIG.previousSite.url}" class="webring-link previous" onclick="handleClick('${WEBSITE_CONFIG.previousSite.label}')">${WEBSITE_CONFIG.previousSite.label}</a>
      <a href="${WEBSITE_CONFIG.hubSite.url}" class="webring-link hub" onclick="handleClick('${WEBSITE_CONFIG.hubSite.label}')">${WEBSITE_CONFIG.hubSite.label}</a>
      <a href="${WEBSITE_CONFIG.nextSite.url}" class="webring-link next" onclick="handleClick('${WEBSITE_CONFIG.nextSite.label}')">${WEBSITE_CONFIG.nextSite.label}</a>
    </div>
    <div class="webring-footer">
      🖥️ 90s Retro Surf Network
    </div>
  </div>
  
  <script>
    function handleClick(label) {
      console.log('Webring link clicked: ' + label);
    }
  </script>
</body>
</html>`;
}

// Generate the iframe layout response
function generateIframeLayout(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webring Frame</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: var(--retro-bg-dark, #0a0a1a);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Courier New', monospace;
    }
    
    .frame-container {
      border: 4px solid var(--retro-border, #00ffff);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
      background: linear-gradient(135deg, #0a0a1a, #1a1a2a);
    }
    
    .frame-title {
      text-align: center;
      color: var(--retro-cyan, #00ffff);
      font-size: 1.2rem;
      margin-bottom: 15px;
      letter-spacing: 2px;
    }
    
    .frame-content {
      background: #000;
      border: 2px solid #00ffff;
      border-radius: 4px;
      padding: 10px;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00ff00;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="frame-container">
    <div class="frame-title">< WEB RING FRAME /></div>
    <div class="frame-content">
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 3rem; margin-bottom: 10px;">🌐</div>
        <p style="margin: 5px 0;">[Previous Site] <></p>
        <p style="margin: 5px 0; color: #ff00ff;">[Kampung Siber Hub] <></p>
        <p style="margin: 5px 0;">[Next Site] <></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// GET handler for the webring API
export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'html';
  
  const htmlContent = format === 'iframe' ? generateIframeLayout() : generateWebringHTML();
  
  return new NextResponse(htmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Retro-Webring': 'Kampung Siber',
    },
  });
}

// POST handler for potential future use
export async function POST(request: Request) {
  return new NextResponse(JSON.stringify({ 
    message: 'Webring API is active',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
