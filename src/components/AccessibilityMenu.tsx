import React, { useState } from 'react';

export const AccessibilityMenu: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);

  return (
    <div style={{ padding: '1rem', background: '#111', color: '#fff' }}>
      <h3>Accessibility</h3>
      <label>
        <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} /> High Contrast
      </label>
      <br />
      <label>
        <input type="checkbox" checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)} /> Reduced Motion
      </label>
      <br />
      <label>
        <input type="checkbox" checked={largeText} onChange={() => setLargeText(!largeText)} /> Large Text
      </label>
    </div>
  );
};

export default AccessibilityMenu;
