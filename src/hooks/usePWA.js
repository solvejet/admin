// src/hooks/usePWA.js
import { useEffect, useState, useCallback } from "react";
import { registerSW } from "virtual:pwa-register";

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        setIsUpdateAvailable(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      updateSW?.();
    };
  }, []);

  const updateServiceWorker = useCallback(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      // Only reload if there's actually an update
      if (isUpdateAvailable) {
        window.location.reload();
      }
    }
  }, [isUpdateAvailable]);

  return {
    isOnline,
    isUpdateAvailable,
    offlineReady,
    updateServiceWorker,
  };
};
