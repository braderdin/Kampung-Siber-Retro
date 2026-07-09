
import { CrtThemeProvider } from '../components/CrtThemeController';

export default function RootLayout({ children }) {
  return (
    <CrtThemeProvider>
      <html>
        <head />
        <body>{children}</body>
      </html>
    </CrtThemeProvider>
  );
}
