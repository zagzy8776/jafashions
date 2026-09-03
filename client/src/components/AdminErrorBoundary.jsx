import { Component } from 'react';

export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Admin panel error:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="grid min-h-[70vh] place-items-center px-6 py-16">
        <section className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">Admin recovery</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">This admin screen hit an error</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">Your data has not been changed by this screen error. Try the screen again, or return to the dashboard.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={this.reset} className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white">Try again</button>
            <a href="/admin" className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-800">Dashboard</a>
          </div>
        </section>
      </main>
    );
  }
}
