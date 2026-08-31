import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function PromoStrip() {
  const [banners, setBanners] = useState([]);
  useEffect(() => { api.get('/promos/active').then((res) => setBanners(res.data.banners || [])).catch(() => setBanners([])); }, []);
  if (!banners.length) return null;
  const banner = banners[0];
  return (
    <div className="bg-stone-950 px-4 py-3 text-center text-sm text-white">
      <strong className="text-amber-300">{banner.title}:</strong> {banner.message}{' '}
      {banner.linkUrl && <Link to={banner.linkUrl} className="font-bold text-amber-200 underline">{banner.linkLabel || 'Learn more'}</Link>}
    </div>
  );
}
