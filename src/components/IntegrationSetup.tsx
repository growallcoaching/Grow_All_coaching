import { useState } from 'react';
import { saveIntegrationConfig, type IntegrationConfig } from '../lib/integrations';

const initialConfig: IntegrationConfig = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  razorpayKeyId: '',
};

export default function IntegrationSetup() {
  const [config, setConfig] = useState<IntegrationConfig>(() => {
    if (typeof window === 'undefined') return initialConfig;

    const saved = window.localStorage.getItem('gac_integration_config');
    return saved ? { ...initialConfig, ...JSON.parse(saved) } : initialConfig;
  });
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof IntegrationConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveIntegrationConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_55px_rgba(15,35,35,0.08)]">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Setup</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">Razorpay + Supabase keys</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Supabase URL</span>
            <input
              value={config.supabaseUrl}
              onChange={(e) => updateField('supabaseUrl', e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full rounded-2xl border border-black/10 bg-[#F8FEFE] px-4 py-3 text-sm outline-none ring-0 transition focus:border-brand"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Supabase anon key</span>
            <input
              value={config.supabaseAnonKey}
              onChange={(e) => updateField('supabaseAnonKey', e.target.value)}
              placeholder="eyJ..."
              className="w-full rounded-2xl border border-black/10 bg-[#F8FEFE] px-4 py-3 text-sm outline-none ring-0 transition focus:border-brand"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-ink">Razorpay Key ID</span>
            <input
              value={config.razorpayKeyId}
              onChange={(e) => updateField('razorpayKeyId', e.target.value)}
              placeholder="rzp_test_xxxxxxxxxx"
              className="w-full rounded-2xl border border-black/10 bg-[#F8FEFE] px-4 py-3 text-sm outline-none ring-0 transition focus:border-brand"
            />
          </label>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm text-ink-secondary">
            {saved ? 'Saved to browser local storage.' : 'Keys stay in your browser only for this demo setup.'}
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-gradient-to-r from-brand to-brand-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20"
          >
            Save keys
          </button>
        </div>
      </div>
    </section>
  );
}
