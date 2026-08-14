import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function getFriendlyAuthError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Invalid email or password. Please try again.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email before logging in.';
  }

  if (lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }

  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network problem. Please check your connection and try again.';
  }

  return message || 'Login failed. Please try again.';
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setIsError(true);
      setMessage('Email and password are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setIsError(true);
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        throw error;
      }

      setMessage('Login successful! Redirecting...');
      setIsError(false);
      navigate('/');
    } catch (error: unknown) {
      const err = error as Error;
      const serverMessage = err?.message || 'Login failed. Please try again.';
      setIsError(true);
      setMessage(getFriendlyAuthError(serverMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-84px)] max-w-6xl items-center justify-center px-6 py-16 lg:px-10">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_rgba(14,154,154,0.12)] lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-brand via-brand-dark to-[#0a1f1f] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-lime">
              Welcome back
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight">
              Log in to continue your learning journey.
            </h1>
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <p>Access courses, internship updates, and mentor support.</p>
            <p>New here? <Link to="/signup" className="font-semibold text-lime hover:text-white">Create an account</Link></p>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Login</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Sign in</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-ink">Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-black/10 bg-warm px-4 py-3 text-ink placeholder:text-ink-secondary/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-bold text-ink">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-black/10 bg-warm px-4 py-3 text-ink placeholder:text-ink-secondary/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-ink-secondary">
                <input type="checkbox" className="h-4 w-4 rounded border-black/20 text-brand focus:ring-brand" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-brand hover:text-brand-dark">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:-translate-y-0.5 hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {message && (
              <p
                aria-live="polite"
                className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}
              >
                {message}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-ink-secondary">
            Don’t have an account?{' '}
            <Link to="/signup" className="font-bold text-brand hover:text-brand-dark">Sign up</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
