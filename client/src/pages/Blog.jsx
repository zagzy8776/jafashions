import { Link } from 'react-router-dom';
import { blogPosts } from '../lib/blogPosts.js';

export default function Blog() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="luxury-gradient rounded-[2.5rem] p-8 text-white md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Journal</p>
        <h1 className="mt-3 font-display text-5xl font-semibold">JA fashions Journal</h1>
        <p className="mt-4 max-w-2xl text-stone-300">Guides for ordering clothes, shoes and handbags.</p>
      </section>
      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => <article key={post.slug} className="rounded-[2rem] bg-white p-6 shadow-sm"><p className="text-xs uppercase tracking-[0.2em] text-amber-700">Guide</p><h2 className="mt-3 font-display text-2xl font-semibold">{post.title}</h2><p className="mt-3 text-sm leading-6 text-stone-600">{post.excerpt}</p><Link to={`/blog/${post.slug}`} className="mt-5 inline-block font-semibold text-amber-800">Read article</Link></article>)}
      </section>
    </main>
  );
}
