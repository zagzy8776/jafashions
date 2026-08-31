export const setPageMeta = ({ title, description, image, url } = {}) => {
  const siteTitle = 'JA fashions | Clothes, Shoes & Handbags';
  const finalTitle = title ? `${title} | JA fashions` : siteTitle;
  const finalDescription = description || 'Clothes, shoes and handbags from JA fashions. Shop online in Nigeria and order on WhatsApp.';

  document.title = finalTitle;

  const setTag = (selector, attr, value) => {
    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      if (selector.includes('property=')) tag.setAttribute('property', selector.match(/property="([^"]+)/)?.[1] || '');
      if (selector.includes('name=')) tag.setAttribute('name', selector.match(/name="([^"]+)/)?.[1] || '');
      document.head.appendChild(tag);
    }
    tag.setAttribute(attr, value);
  };

  setTag('meta[name="description"]', 'content', finalDescription);
  setTag('meta[property="og:title"]', 'content', finalTitle);
  setTag('meta[property="og:description"]', 'content', finalDescription);
  setTag('meta[property="og:type"]', 'content', 'website');
  setTag('meta[property="og:url"]', 'content', url || window.location.href);
  setTag('meta[property="og:image"]', 'content', image || `${window.location.origin}/logo.svg`);
  setTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
};
