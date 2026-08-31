import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../lib/blogPosts.js';
import ReviewCTA from '../components/ReviewCTA.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return <main className="mx-auto max-w-4xl px-4 py-20 text-center"><h1 className="font-display text-4xl">Article not found</h1><Link to="/blog" className="mt-5 inline-block text-amber-800">Back to blog</Link></main>;
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-700">JA fashions Journal</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">{post.title}</h1>
      <p className="mt-5 text-lg leading-8 text-stone-600">{post.excerpt}</p>
      <article className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        {post.content.map((paragraph) => <p key={paragraph} className="mb-5 leading-8 text-stone-700">{paragraph}</p>)}
        <div className="mt-8 rounded-2xl bg-amber-50 p-5"><strong>Need help choosing?</strong><p className="mt-2 text-sm text-stone-600">Use the style finder or chat on WhatsApp.</p><Link to="/style-finder" className="mt-4 inline-block rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Try style finder</Link></div>
      </article>
      <div className="mt-8"><ReviewCTA compact /></div>
    </main>
  );
}
