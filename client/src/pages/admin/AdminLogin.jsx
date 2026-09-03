import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { logoUrl } from '../../lib/api.js';
import { login } from '../../lib/clientAuth.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('ahmedshitu737@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Client-side authentication (temporary solution)
      login(password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="luxury-gradient grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2.5rem] border border-amber-200/30 bg-[#fffaf1] p-8 shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm"><img src={logoUrl} alt="JA fashions logo" className="h-full w-full object-contain" /></div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-amber-700">Secure Admin</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">JA fashions Dashboard</h1>
        {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 grid gap-4">
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"><Mail size={18} className="text-amber-700" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Email" /></label>
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"><Lock size={18} className="text-amber-700" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Password" /></label>
          <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-4 font-semibold text-white disabled:opacity-60"><ShieldCheck size={18} /> {loading ? 'Signing in...' : 'Login Securely'}</button>
        </div>
      </form>
    </main>
  );
}
