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

// Singleton Supabase Client
let supabaseInstance: SupabaseClient | null = null;
function getSupabase(url: string, anonKey: string): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey);
  }
  return supabaseInstance;
}

// RAW FETCH
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

  try {
    const supabase = getSupabase(supabaseUrl, anonKey);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = 'Bearer ' + session.access_token;
    }
  } catch {}

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : '{}',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setStatusType('info');

    try {
      if (!config.supabaseUrl || !config.supabaseAnonKey) throw new Error('Supabase keys missing.');
      if (!selectedProgram) throw new Error('Please select a program.');

      setStatus('Creating secure payment order...');
      setStatusType('info');

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

      await loadRazorpayScript();

      const checkout = new (window as any).Razorpay({
        key,
        amount,
        currency,
        order_id,
        name: 'Grow All Coaching',
        description: selectedProgram.title,
        image: '/gac-logo.png', // Ensure this is in your public folder
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setStatus('Verifying payment...');
            setStatusType('info');

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

            setStatus(' Payment successful! You are enrolled.');
            setStatusType('success');
            setForm((prev) => ({ ...prev, name: '', email: '', phone: '', college: '' }));
          } catch (err) {
            setStatus('Payment verification failed: ' + getErrorMessage(err));
            setStatusType('error');
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#0E9A9A' },
      });

      checkout.open();
    } catch (err) {
      setStatus('Something went wrong: ' + getErrorMessage(err));
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-10 text-center sm:px-10">
          <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            Enrollment Open
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Apply for an Internship
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Choose a program that fits your career goals, fill out your details, and complete your secure payment.
          </p>
        </div>

        <div className="grid lg:grid-cols-5">
          {/* Left Column: Programs List */}
          <div className="lg:col-span-2 border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-400">
              Select Program
            </h3>

            {programsLoading ? (
              <div className="flex h-40 items-center justify-center text-slate-400">
                <svg className="h-6 w-6 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </div>
            ) : programs.length === 0 ? (
              <div className="text-sm text-slate-400">No programs available.</div>
            ) : (
              <div className="space-y-3">
                {programs.map((p) => {
                  const seats = p.max_seats ? p.max_seats - p.enrolled_count : null;
                  const full = seats !== null && seats <= 0;
                  const isSelected = form.programSlug === p.slug;
                  
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => handleChange('programSlug', p.slug)}
                      disabled={full}
                      className={`group relative w-full rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-brand bg-brand/5 shadow-sm'
                          : full
                          ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50'
                          : 'border-slate-100 bg-white hover:border-brand/40 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className={`font-bold transition-colors ${isSelected ? 'text-brand' : 'text-ink'}`}>
                            {p.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{p.description}</p>
                        </div>
                        {isSelected && (
                          <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="text-lg font-extrabold text-ink">
                            {formatPrice(p.price)}
                            <span className="ml-1 text-[10px] font-medium text-slate-400">/ {p.duration}</span>
                          </p>
                          {seats !== null && (
                            <span className={`mt-1 inline-block text-[10px] font-semibold ${
                              full ? 'text-red-500' : seats <= 5 ? 'text-amber-500' : 'text-green-600'
                            }`}>
                              {full ? ' Housefull' : `${seats} seats left`}
                            </span>
                          )}
                        </div>
                        {p.start_date && (
                          <p className="text-[10px] text-slate-400">
                            Starts {new Date(p.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Form Area */}
          <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-400">
              Your Details
            </h3>

            {programs.length === 0 && !programsLoading ? (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400">
                Please add active programs to enable enrollment.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-slate-600">Full Name</label>
                    <input 
                      id="name" 
                      required 
                      value={form.name} 
                      onChange={(e) => handleChange('name', e.target.value)} 
                      placeholder="e.g. Rahul Sharma" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-600">Email Address</label>
                    <input 
                      id="email" 
                      type="email" 
                      required 
                      value={form.email} 
                      onChange={(e) => handleChange('email', e.target.value)} 
                      placeholder="you@email.com" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-slate-600">Phone Number</label>
                    <input 
                      id="phone" 
                      type="tel" 
                      required 
                      value={form.phone} 
                      onChange={(e) => handleChange('phone', e.target.value)} 
                      placeholder="+91 9876543210" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" 
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="college" className="mb-1.5 block text-xs font-semibold text-slate-600">College / University</label>
                    <input 
                      id="college" 
                      value={form.college} 
                      onChange={(e) => handleChange('college', e.target.value)} 
                      placeholder="Your college name (optional)" 
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" 
                    />
                  </div>
                </div>

                {/* Price Summary Box */}
                {selectedProgram && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Selected Program</p>
                        <p className="mt-0.5 text-sm font-bold text-ink">{selectedProgram.title}</p>
                        <p className="text-xs text-slate-400">
                          {selectedProgram.duration} • Starts {new Date(selectedProgram.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Total Amount</p>
                        <p className="text-xl font-extrabold text-brand">{formatPrice(selectedProgram.price)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading || isFull || !form.programSlug} 
                  className={`flex w-full items-center justify-center rounded-xl px-6 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 ${
                    loading || isFull || !form.programSlug
                      ? 'cursor-not-allowed bg-slate-300 shadow-none'
                      : 'bg-gradient-to-r from-brand to-brand-dark shadow-brand/30 hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Opening Payment...
                    </span>
                  ) : isFull ? (
                    'No Seats Available'
                  ) : (
                    `Pay ${selectedProgram ? formatPrice(selectedProgram.price) : ''} & Enroll Now`
                  )}
                </button>

                {/* Status Messages */}
                {status && (
                  <div className={`rounded-xl border p-4 text-xs font-medium ${
                    statusType === 'success' 
                      ? 'border-green-200 bg-green-50 text-green-700' 
                      : statusType === 'error' 
                      ? 'border-red-200 bg-red-50 text-red-700' 
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}>
                    {status}
                  </div>
                )}
                
                <p className="text-center text-[10px] text-slate-400">
                   100% Secure Payments powered by Razorpay
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}