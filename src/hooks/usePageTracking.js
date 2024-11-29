// src/hooks/usePageTracking.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as webVitals from "web-vitals";

const reportWebVitals = ({ name, value, id }) => {
  // You can send this to your analytics service
  console.log(`${name}: ${value} (ID: ${id})`);
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Measure Core Web Vitals
    webVitals.onCLS(reportWebVitals);
    webVitals.onFID(reportWebVitals);
    webVitals.onFCP(reportWebVitals);
    webVitals.onLCP(reportWebVitals);
    webVitals.onTTFB(reportWebVitals);

    // You can add your page view tracking here
    console.log(`Page viewed: ${location.pathname}`);
  }, [location]);
};

export default usePageTracking;
