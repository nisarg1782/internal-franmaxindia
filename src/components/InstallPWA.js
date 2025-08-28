// src/components/InstallPWA.js
import React, { useEffect, useState } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App installed');
        setShowInstall(false);
      }
    }
  };

  return (
    showInstall && (
      <button onClick={handleInstall} style={{ position: 'fixed', bottom: 20, right: 20 }}>
        Install App
      </button>
    )
  );
};

export default InstallPWA;
