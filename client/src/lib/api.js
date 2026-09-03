import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://jafashions.onrender.com/api' : 'http://localhost:5000/api');

const normalizeApiUrl = (url) => {
  const cleanUrl = String(url).replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

export const API_URL = normalizeApiUrl(rawApiUrl);

export const api = axios.create({ baseURL: API_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jf_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('jf_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

export const formatNaira = (value) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'bbke1t9y';
export const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Jafashion';

export function isVideoFile(file) {
  return Boolean(file?.type?.startsWith('video/'));
}

export function isVideoUrl(url = '') {
  const value = String(url).toLowerCase();
  return value.includes('/video/upload/') || /\.(mp4|webm|mov|m4v|ogg)(\?|$)/.test(value);
}

export async function uploadUnsignedImage(file, folder = 'jafashions') {
  return uploadUnsignedMedia(file, folder);
}

export async function uploadUnsignedMedia(file, folder = 'jafashions') {
  const resource = isVideoFile(file) ? 'video' : 'image';
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', cloudinaryUploadPreset);
  if (folder) body.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/${resource}/upload`, {
    method: 'POST',
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Unsigned Cloudinary upload failed. Confirm the preset is Unsigned and allows images and videos.');
  }
  return data;
}

export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348110006486';

export function whatsappHref(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  floating: 'Hello JA fashions, I am messaging from the website. I would like to ask about an item.',
  menu: 'Hello JA fashions, I opened the website menu and I would like to speak with you.',
  footer: 'Hello JA fashions, I am contacting you from the website footer.',
  heroBook: 'Hello JA fashions, I need help with a size or a custom order.',
  heroWhatsApp: 'Hello JA fashions, I would like to make an enquiry from the homepage.',
  servicesHero: 'Hello JA fashions, I want help with a size, custom order or personal shop.',
  service: (name) => `Hello JA fashions, I want help with ${name}. Please share what you need from me.`,
  product: (name, extra = '') => `Hello JA fashions, I want to order ${name}${extra}. Please confirm availability and how to pay.`,
  gallery: (title) => `Hello JA fashions, I love this look${title ? ` (${title})` : ''} from your lookbook. Is it available?`,
  contact: 'Hello JA fashions, I am messaging from the contact page.',
  delivery: 'Hello JA fashions, I want to ask about pickup or delivery.',
};

export const logoUrl = '/logo.svg';

export const bankDetails = {
  bankName: 'Confirm on WhatsApp',
  accountNumber: 'Request account details',
  accountName: 'JA fashions',
};

export const deliveryOptions = [
  { value: 'PICKUP', label: 'Pickup', fee: 0, note: 'Pick up after confirmation. Details will be shared on WhatsApp.' },
  { value: 'CITY_DELIVERY', label: 'City delivery', fee: 3000, note: 'Delivery within Nigeria. Rider delivery will be coordinated after order confirmation.' },
  { value: 'WAYBILL_PARK', label: 'Waybill / park dispatch', fee: 1000, note: 'Covers sending your order to the park. Transport may contact you for remaining delivery cost based on destination.' },
  { value: 'OTHER_STATES_DISPATCH', label: 'Other states dispatch', fee: 0, note: 'Dispatch to other cities is coordinated after confirmation based on destination and courier options.' },
];

export const businessInfo = {
  name: 'JA fashions',
  brand: 'JA fashions',
  email: 'ahmedshitu737@gmail.com',
  phoneDisplay: '0811 000 6486',
  callLine: '08110006486',
  instagram: '@jafashions',
  tiktok: '@jafashions',
  facebook: 'JA fashions',
  instagramUrl: 'https://www.instagram.com/jafashions',
  tiktokUrl: 'https://www.tiktok.com/@jafashions',
  facebookUrl: 'https://www.facebook.com',
  location: 'Nigeria',
  addressShort: 'Nigeria · Online store',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nigeria',
};
