import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getIntegrationConfig, toPaiseFromPrice } from '../lib/integrations';

type EnrollmentFormState = {
  name: string;
  email: string;
  phone: string;
  program: string;
};

const programPriceMap: Record<string, number> = {
  'Web Development Internship': 99900,
  'AI / ML Internship': 199900,
  'Automation & BI Internship': 299900,
};

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'));
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Razorpay script failed to load')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.setAttribute('data-razorpay', 'true');
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Razorpay script failed to load'));
    document.body.appendChild(script);
  });
}

export default function EnrollmentForm() {
  const [config, setConfig] = useState(getIntegrationConfig());
  const [form, setForm] = useState<EnrollmentFormState>({
    name: '',
    email: '',
    phone: '',
    program: 'Web Development Internship',
  });
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setConfig(getIntegrationConfig());
  }, []);

  const handleChange = (field: keyof EnrollmentFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      if (!config.razorpayKeyId || !config.supabaseUrl || !config.supabaseAnonKey) {
        setStatus('Please save your Razorpay + Supabase keys from the setup page first.');
        return;
      }

      const amount = programPriceMap[form.program] ?? 99900;
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

      await loadRazorpayScript();

      const checkout = new window.Razorpay({
        key: config.razorpayKeyId,
        amount,
        currency: 'INR',
        name: 'Grow All Coaching',
        description: form.program,
        image: '/gac-logo.png',
        handler: async function (response: { razorpay_payment_id: string }) {
          const { error } = await supabase.from('internship_enrollments').insert({
            name: form.name,
            email: form.email,
            phone: form.phone,
            program: form.program,
            amount,
            status: 'paid',
            payment_id: response.razorpay_payment_id,
            created_at: new Date().toISOString(),
          });

          if (error) {
            throw error;
          }

          setStatus('Payment successful and enrollment saved to Supabase.');
          setForm({ name: '', email: '', phone: '', program: form.program });
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#0E9A9A',
        },
      });

      checkout.open();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Something went wrong while opening payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_55px_rgba(15,35,35,0.08)]">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Enrollment</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">Apply for an internship</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-ink">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-[#F8FEFE] px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-[#F8FEFE] px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">Phone</span>
              <input
                required
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-[#F8FEFE] px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-ink">Program</span>
              <select
                value={form.program}
                onChange={(e) => handleChange('program', e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-[#F8FEFE] px-4 py-3 text-sm outline-none focus:border-brand"
              >
                <option>Web Development Internship</option>
                <option>AI / ML Internship</option>
                <option>Automation & BI Internship</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/20 disabled:opacity-60"
          >
            {loading ? 'Opening payment...' : 'Proceed to payment'}
          </button>

          {status ? (
            <div className="rounded-2xl border border-brand/10 bg-brand/5 px-4 py-3 text-sm text-ink-secondary">
              {status}
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
