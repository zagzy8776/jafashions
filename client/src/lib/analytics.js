import { api } from './api.js';

const getSessionId = () => {
  const key = 'jf_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

const getDevice = () => {
  const width = window.innerWidth;
  if (width < 768) return 'Mobile';
  if (width < 1024) return 'Tablet';
  return 'Desktop';
};

const getBrowser = () => {
  const agent = navigator.userAgent;
  if (agent.includes('Edg')) return 'Edge';
  if (agent.includes('Chrome')) return 'Chrome';
  if (agent.includes('Safari')) return 'Safari';
  if (agent.includes('Firefox')) return 'Firefox';
  return 'Other';
};

const getSource = () => {
  const campaign = getCampaign();
  if (campaign.source) return campaign.source;
  const referrer = document.referrer;
  if (!referrer) return 'Direct';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('tiktok')) return 'TikTok';
    if (host.includes('google')) return 'Google';
    if (host.includes('facebook')) return 'Facebook';
    if (host.includes('whatsapp')) return 'WhatsApp';
    return host.replace('www.', '');
  } catch {
    return 'Referral';
  }
};

export const getCampaign = () => {
  const key = 'jf_campaign';
  const params = new URLSearchParams(window.location.search);
  const current = {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '',
    content: params.get('utm_content') || '',
  };
  if (current.source || current.medium || current.campaign || current.content) {
    sessionStorage.setItem(key, JSON.stringify(current));
    return current;
  }
  try {
    return JSON.parse(sessionStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};

export const trackPageView = (extra = {}) => {
  const productMatch = window.location.pathname.match(/^\/product\/([^/]+)/);
  api.post('/analytics/track', {
    sessionId: getSessionId(),
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || null,
    source: getSource(),
    device: getDevice(),
    browser: getBrowser(),
    productSlug: productMatch?.[1] || null,
    ...extra,
  }).catch(() => null);
};
