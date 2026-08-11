import { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getIntegrationConfig } from '../lib/integrations';

type Program = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  max_seats: number | null;
  enrolled_count: number;
  start_date: string;
  image_url: string | null;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  college: string;
  programSlug: string;
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as { message?: string; status?: number; context?: unknown };
    const parts = [
      e.message,
      e.status ? `status: ${e.status}` : '',
      e.context ? `context: ${JSON.stringify(e.context)}` : '',
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(' | ');
  }
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try { return JSON.stringify(error); } catch { return 'Unknown error'; }
}

function loadRazorpayScript(): Promise<true> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'));
    if ((window as any).Razorpay) return resolve(true);
    const existing = document.querySelector('script[data-razorpay]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => reject(new Error('Script failed')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.setAttribute('data-razorpay', 'true');
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Script failed'));
    document.body.appendChild(script);
  });
}

function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

// ────────────────────────────────────────
// ✅ Singleton Supabase Client (for table queries only)
// ────────────────────────────────────────
let supabaseInstance: SupabaseClient | null = null;
function getSupabase(url: string, anonKey: string): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey);
  }
  return supabaseInstance;
}

// ────────────────────────────────────────
// ✅ RAW FETCH — bypasses supabase.functions.invoke()
// No extra headers, no CORS issues
// ────────────────────────────────────────
async function callEdgeFunction(
  supabaseUrl: string,
  anonKey: string,
  functionName: string,
  body?: Record<string, unknown>,
): Promise<any> {
  const url = supabaseUrl + '/functions/v1/' + functionName;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': anonKey,
  };

  // Get user token if logged in
  try {
    const supabase = getSupabase(supabaseUrl, anonKey);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = 'Bearer ' + session.access_token;
    }
  } catch {
    // Not logged in — that's fine
  }

  console.log('📤 [' + functionName + '] Calling:', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body ? JSON.stringify(body) : '{}',
  });

  console.log('📥 [' + functionName + '] Status:', res.status);

  if (!res.ok) {
    let errorMsg = functionName + ' failed: HTTP ' + res.status;
    try {
      const errBody = await res.json();
      if (errBody.error) errorMsg = errBody.error;
      if (errBody.details) errorMsg += ' | ' + errBody.details;
    } catch {}
    throw new Error(errorMsg);
  }

  return await res.json();
}

// ────────────────────────────────────────
// Component
// ────────────────────────────────────────
export default function EnrollmentForm() {
  const config = getIntegrationConfig();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    college: '',
    programSlug: '',
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
  const [loading, setLoading] = useState(false);

  // ─── Fetch programs (direct table query — no edge function needed) ───
  useEffect(() => {
    (async () => {
      try {
        if (!config.supabaseUrl || !config.supabaseAnonKey) {
          setStatus('Please save Supabase keys from setup page.');
          setStatusType('error');
          setProgramsLoading(false);
          return;
        }

        const supabase = getSupabase(config.supabaseUrl, config.supabaseAnonKey);

        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const programsList = (data ?? []) as Program[];

        if (programsList.length > 0) {
          setPrograms(programsList);
          setForm((prev) => ({ ...prev, programSlug: programsList[0].slug }));
        }
      } catch (err) {
        console.error('Failed to fetch programs:', err);
        setStatus('Could not load programs: ' + getErrorMessage(err));
        setStatusType('error');
      } finally {
        setProgramsLoading(false);
      }
    })();
  }, [config.supabaseUrl, config.supabaseAnonKey]);

  const selectedProgram = programs.find((p) => p.slug === form.programSlug);
  const seatsLeft = selectedProgram?.max_seats
    ? selectedProgram.max_seats - selectedProgram.enrolled_count
    : null;
  const isFull = seatsLeft !== null && seatsLeft <= 0;

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Submit ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setStatusType('info');

    try {
      if (!config.supabaseUrl || !config.supabaseAnonKey) {
        throw new Error('Supabase keys missing.');
      }

      if (!selectedProgram) {
        throw new Error('Please select a program.');
      }

      setStatus('Creating secure payment order...');
      setStatusType('info');

      // ─── Step 1: Create Order (raw fetch) ───
      const orderData = await callEdgeFunction(
        config.supabaseUrl,
        config.supabaseAnonKey,
        'create-order',
        {
          program_id: selectedProgram.id,
          full_name: form.name,
          email: form.email,
          phone: form.phone,
          college: form.college,
        },
      );

      if (orderData?.error) throw new Error(orderData.error);

      const { key, amount, currency, order_id } = orderData ?? {};
      if (!key || !amount || !currency || !order_id) {
        throw new Error('Payment order was not generated correctly.');
      }

      // ─── Step 2: Load Razorpay ───
      await loadRazorpayScript();

      // ─── Step 3: Open Checkout ───
      const checkout = new (window as any).Razorpay({
        key,
        amount,
        currency,
        order_id,
        name: 'Grow All Coaching',
        description: selectedProgram.title,
        image: '/gac-logo.png',
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setStatus('Verifying payment...');
            setStatusType('info');

            // ─── Step 4: Verify Payment (raw fetch) ───
            const verifyData = await callEdgeFunction(
              config.supabaseUrl,
              config.supabaseAnonKey,
              'verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );

            if (!verifyData?.verified) {
              throw new Error('Payment could not be verified.');
            }

            setStatus('🎉 Payment successful! You are enrolled.');
            setStatusType('success');
            setForm((prev) => ({
              ...prev,
              name: '',
              email: '',
              phone: '',
              college: '',
            }));
          } catch (err) {
            console.error('Verify error:', err);
            setStatus('Payment verification failed: ' + getErrorMessage(err));
            setStatusType('error');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#0E9A9A' },
      });

      checkout.open();
    } catch (err) {
      const msg = getErrorMessage(err);
      console.error('Enrollment error:', err);
      setStatus('Something went wrong: ' + msg);
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_55px_rgba(15,35,35,0.08)]">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Enrollment
        </p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">
          Apply for an internship
        </h2>

        <div className="mt-8 mb-8">
          <p className="mb-4 text-sm font-semibold text-ink">Select a program</p>

          {programsLoading ? (
            <div className="flex items-center gap-2 text-sm text-ink-secondary">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading programs...
            </div>
          ) : programs.length === 0 ? (
            <p className="text-sm text-ink-secondary">No programs available yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {programs.map((p) => {
                const seats = p.max_seats ? p.max_seats - p.enrolled_count : null;
                const full = seats !== null && seats <= 0;
                const isSelected = form.programSlug === p.slug;
                return (
                  <button key={p.slug} type="button" onClick={() => handleChange('programSlug', p.slug)} disabled={full}
                    className={`relative rounded-2xl border-2 p-5 text-left transition-all ${isSelected ? 'border-brand bg-brand/5 shadow-md' : full ? 'border-black/5 bg-gray-50 opacity-50 cursor-not-allowed' : 'border-black/5 bg-white hover:border-brand/40 hover:shadow-sm'}`}>
                    {isSelected && <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-xs">✓</span>}
                    <h3 className="font-bold text-ink">{p.title}</h3>
                    <p className="mt-1 text-xs text-ink-secondary line-clamp-2">{p.description}</p>
                    <p className="mt-3 text-xl font-extrabold text-brand">{formatPrice(p.price)}<span className="ml-1 text-xs font-normal text-ink-secondary">/ {p.duration}</span></p>
                    {p.features?.length > 0 && (<ul className="mt-3 space-y-0.5">{p.features.slice(0, 3).map((f, i) => <li key={i} className="text-xs text-ink-secondary">✅ {f}</li>)}{p.features.length > 3 && <li className="text-xs text-ink-secondary">+{p.features.length - 3} more</li>}</ul>)}
                    {seats !== null && <p className={`mt-3 text-xs font-semibold ${full ? 'text-red-500' : seats <= 5 ? 'text-amber-500' : 'text-green-600'}`}>{full ? '❌ No seats left' : seats + ' seats left'}</p>}
                    {p.start_date && <p className="mt-1 text-xs text-ink-secondary">Starts: {new Date(p.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {programs.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2"><span className="mb-2 block text-sm font-semibold text-ink">Full Name</span><input required value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Your full name" className="w-full rounded-2xl border border-black/10 bg&lsqb;#F8FEFE&rsqb; px-4 py-3 text-sm outline-none focus:border-brand" /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-ink">Email</span><input type="email" required value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@email.com" className="w-full rounded-2xl border border-black/10 bg&lsqb;#F8FEFE&rsqb; px-4 py-3 text-sm outline-none focus:border-brand" /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-ink">Phone</span><input type="tel" required value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 9876543210" className="w-full rounded-2xl border border-black/10 bg&lsqb;#F8FEFE&rsqb; px-4 py-3 text-sm outline-none focus:border-brand" /></label>
              <label className="block md:col-span-2"><span className="mb-2 block text-sm font-semibold text-ink">College / University</span><input value={form.college} onChange={(e) => handleChange('college', e.target.value)} placeholder="Your college name (optional)" className="w-full rounded-2xl border border-black/10 bg&lsqb;#F8FEFE&rsqb; px-4 py-3 text-sm outline-none focus:border-brand" /></label>
            </div>

            {selectedProgram && (
              <div className="rounded-2xl border border-brand/10 bg-brand/5 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-bold text-ink">{selectedProgram.title}</p><p className="text-xs text-ink-secondary">{selectedProgram.duration} • Starts {new Date(selectedProgram.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p></div>
                  <p className="text-lg font-extrabold text-brand">{formatPrice(selectedProgram.price)}</p>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading || isFull || !form.programSlug} className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/20 disabled:opacity-60">
              {loading ? 'Opening payment...' : isFull ? 'No seats available' : 'Pay ' + (selectedProgram ? formatPrice(selectedProgram.price) : '') + ' & Enroll'}
            </button>

            {status && <div className={`rounded-2xl border px-4 py-3 text-sm ${statusType === 'success' ? 'border-green-200 bg-green-50 text-green-800' : statusType === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-brand/10 bg-brand/5 text-ink-secondary'}`}>{status}</div>}
          </form>
        )}
      </div>
    </section>
  );
}