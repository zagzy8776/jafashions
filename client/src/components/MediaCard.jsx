import { useEffect, useRef } from 'react';
import { isVideoUrl } from '../lib/api.js';

function AutoPlayVideo({ src, className = '', controls = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    node.muted = true;
    node.defaultMuted = true;
    node.playsInline = true;
    const tryPlay = () => { const playAttempt = node.play(); if (playAttempt?.catch) playAttempt.catch(() => {}); };
    tryPlay();
    node.addEventListener('canplay', tryPlay);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) tryPlay(); else node.pause(); });
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => { node.removeEventListener('canplay', tryPlay); observer.disconnect(); };
  }, [src]);
  return <video ref={ref} src={src} className={className} autoPlay muted loop playsInline controls={controls} preload="auto" />;
}

export default function MediaCard({ item, className = '', onClick }) {
  const video = isVideoUrl(item?.imageUrl);
  const title = item?.title || 'JA fashions';
  return (
    <button type="button" onClick={onClick} className={`group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-amber-900/10 ${className}`}>
      <div className="aspect-[3/4] overflow-hidden bg-stone-100">
        {video ? <AutoPlayVideo src={item.imageUrl} className="h-full w-full object-cover" /> : <img src={item.imageUrl} alt={title} className="h-full w-full object-cover" loading="lazy" />}
      </div>
      {(item.title || item.caption) && (
        <div className="p-3">
          {item.title && <p className="line-clamp-1 font-display text-sm font-semibold">{item.title}</p>}
          {item.caption && <p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.caption}</p>}
        </div>
      )}
    </button>
  );
}

export { AutoPlayVideo };
