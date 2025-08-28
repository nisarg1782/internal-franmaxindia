import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';


// Prevent browser from restoring scroll on reload
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Optional: create a wrapper to scroll to top on initial load
const Root = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* resets CSS and applies MUI theme */}
    <Root />
  </ThemeProvider>
);
