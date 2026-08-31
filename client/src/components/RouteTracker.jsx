import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics.js';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(() => trackPageView(), 250);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}
