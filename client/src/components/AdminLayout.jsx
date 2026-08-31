import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Bell, ExternalLink, Images, LayoutDashboard, LogOut, Megaphone, MessageCircle, MessageSquareQuote, Package, ReceiptText, Settings, Users } from 'lucide-react';
import { logoUrl } from '../lib/api.js';

const links = [
  ['Dashboard', '/admin', LayoutDashboard],
  ['Products', '/admin/products', Package],
  ['Orders', '/admin/orders', ReceiptText],
  ['Gallery', '/admin/gallery', Images],
  ['Analytics', '/admin/analytics', BarChart3],
  ['Sales', '/admin/sales', BarChart3],
  ['Customers', '/admin/customers', Users],
  ['Promos', '/admin/promos', Megaphone],
  ['Stock Alerts', '/admin/stock-alerts', Bell],
  ['WhatsApp Templates', '/admin/whatsapp', MessageCircle],
  ['Testimonials', '/admin/testimonials', MessageSquareQuote],
  ['Categories & Coupons', '/admin/settings', Settings],
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('jf_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f6efe3]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 overflow-hidden bg-stone-950 p-6 text-white lg:block">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white"><img src={logoUrl} alt="JA fashions logo" className="h-full w-full object-contain" /></div>
          <h1 className="mt-4 font-display text-3xl">JA fashions</h1>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Luxury Admin</p>
        </div>
        <nav className="mt-10 grid gap-2">
          {links.map(([label, path, Icon]) => (
            <NavLink key={path} to={path} end={path === '/admin'} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${isActive ? 'bg-amber-500 text-stone-950' : 'text-stone-300 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 grid gap-2">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-300 hover:bg-white/10"><ExternalLink size={18} /> View Store</a>
          <button onClick={logout} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-red-200 hover:bg-red-500/10"><LogOut size={18} /> Logout</button>
        </div>
      </aside>
      <main className="lg:pl-72">
        <div className="sticky top-0 z-30 flex gap-2 overflow-auto border-b border-amber-900/10 bg-white/90 p-3 backdrop-blur lg:hidden">
          {links.map(([label, path]) => <NavLink key={path} to={path} end={path === '/admin'} className={({ isActive }) => `whitespace-nowrap rounded-full px-4 py-2 text-sm ${isActive ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-700'}`}>{label}</NavLink>)}
          <button onClick={logout} className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-700">Logout</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
