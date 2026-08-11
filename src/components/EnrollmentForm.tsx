import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getIntegrationConfig } from '../lib/integrations';

type EnrollmentFormState = {
  name: string;
  email: string;
  phone: string;
  program: string;
};

const internshipPrograms = [
  { id: 'web-development', label: 'Web Development Internship' },
  { id: 'ai-ml', label: 'AI / ML Internship' },
  { id: 'automation-bi', label: 'Automation & BI Internship' },
] as const;

const programIdMap = Object.fromEntries(
  internshipPrograms.map((program) => [program.label, program.id]),
) as Record<string, string>;

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

      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
      const programId = programIdMap[form.program] ?? 'web-development';

      setStatus('Creating secure payment order...');

      const { data: orderData, error: orderError } = await supabase.functions.invoke('clever-responder', {
        body: {
          program_id: programId,
        },
      });

      if (orderError) {
        throw new Error(orderError.message || 'Unable to create payment order.');
      }

      const { key, amount, currency, order_id } = orderData ?? {};

      if (!key || !amount || !currency || !order_id) {
        throw new Error('Payment order was not generated correctly.');
      }

      await loadRazorpayScript();

      const checkout = new window.Razorpay({
        key,
        amount,
        currency,
        order_id,
        name: 'Grow All Coaching',
        description: form.program,
        image: '/gac-logo.png',
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke('smooth-action', {
            body: {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
          });

          if (verifyError) {
            throw new Error(verifyError.message || 'Payment verification failed.');
          }

          if (!verifyData?.verified) {
            throw new Error('Payment could not be verified on the server.');
          }

          const { error } = await supabase.from('internship_enrollments').insert({
            name: form.name,
            email: form.email,
            phone: form.phone,
            program: form.program,
            program_id: programId,
            amount,
            currency,
            status: 'paid',
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
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

      requestAnimationFrame(() => {
        checkout.open();
      });
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
                {internshipPrograms.map((program) => (
                  <option key={program.id} value={program.label}>
                    {program.label}
                  </option>
                ))}
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
