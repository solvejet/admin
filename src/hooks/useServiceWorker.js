// src/hooks/useServiceWorker.js
import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export const useServiceWorker = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onOfflineReady() {
        setOfflineReady(true);
      },
      onNeedRefresh() {
        setNeedRefresh(true);
      },
    });

    return () => {
      updateSW?.();
    };
  }, []);

  return { needRefresh, offlineReady };
};
