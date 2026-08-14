import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function getFriendlySignupError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes('user already registered') || lower.includes('already registered') || lower.includes('already exists')) {
    return 'This email is already registered. Please log in instead.';
  }

  if (lower.includes('password') && (lower.includes('least') || lower.includes('weak') || lower.includes('short'))) {
    return 'Password must be at least 6 characters long.';
  }

  if (lower.includes('invalid email') || lower.includes('email is invalid')) {
    return 'Please enter a valid email address.';
  }

  if (lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }

  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network problem. Please check your connection and try again.';
  }

  if (lower.includes('profile')) {
    return 'Account created, but profile setup failed. Please contact support.';
  }

  return message || 'Unable to create account. Please try again.';
}

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedPassword) {
      setIsError(true);
      setMessage('Please fill in all fields before continuing.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setIsError(true);
      setMessage('Please enter a valid email address.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setIsError(true);
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: {
            full_name: trimmedName,
            phone: trimmedPhone,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            id: authData.user.id,
            full_name: trimmedName,
            phone: trimmedPhone,
            email: trimmedEmail,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (profileError) {
          throw profileError;
        }
      }

      setIsError(false);
      setMessage('Signup successful! Please check your email to confirm your account.');
      navigate('/login');
    } catch (error: unknown) {
      const err = error as Error;
      const serverMessage = err?.message || 'Signup failed. Please try again.';
      setIsError(true);
      setMessage(getFriendlySignupError(serverMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-84px)] max-w-6xl items-center justify-center px-6 py-16 lg:px-10">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_rgba(14,154,154,0.12)] lg:grid-cols-2">
        <div className="p-8 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Signup</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Create your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-name" className="mb-2 block text-sm font-bold text-ink">Full name</label>
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl border border-black/10 bg-warm px-4 py-3 text-ink placeholder:text-ink-secondary/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div>
                <label htmlFor="signup-phone" className="mb-2 block text-sm font-bold text-ink">Phone</label>
                <input
                  id="signup-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full rounded-xl border border-black/10 bg-warm px-4 py-3 text-ink placeholder:text-ink-secondary/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-bold text-ink">Email address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-black/10 bg-warm px-4 py-3 text-ink placeholder:text-ink-secondary/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-bold text-ink">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={6}
                required
                className="w-full rounded-xl border border-black/10 bg-warm px-4 py-3 text-ink placeholder:text-ink-secondary/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:-translate-y-0.5 hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create account'}
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
            Already a member?{' '}
            <Link to="/login" className="font-bold text-brand hover:text-brand-dark">Login</Link>
          </p>
        </div>

        <div className="hidden bg-gradient-to-br from-[#0a1f1f] via-brand-dark to-brand p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-lime">
              Join us
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight">
              Start building your future with expert mentorship.
            </h1>
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <p>Get access to premium courses, internships, and career guidance.</p>
            <p>Already registered? <Link to="/login" className="font-semibold text-lime hover:text-white">Log in here</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
}
