
import { CrtThemeProvider } from '../components/CrtThemeController';

function MyApp({ Component, pageProps }) {
  return (
    <CrtThemeProvider>
      <Component {...pageProps} />
    </CrtThemeProvider>
  );
}

export default MyApp;
