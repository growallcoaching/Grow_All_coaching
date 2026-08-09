export type IntegrationConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  razorpayKeyId: string;
};

export const emptyIntegrationConfig: IntegrationConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID ?? '',
};

const STORAGE_KEY = 'gac_integration_config';

export function getIntegrationConfig(): IntegrationConfig {
  if (typeof window === 'undefined') {
    return emptyIntegrationConfig;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        ...emptyIntegrationConfig,
      };
    }

    return {
      ...emptyIntegrationConfig,
      ...JSON.parse(saved),
    };
  } catch {
    return emptyIntegrationConfig;
  }
}

export function saveIntegrationConfig(config: IntegrationConfig) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearIntegrationConfig() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function toPaiseFromPrice(priceText: string) {
  const numeric = Number(String(priceText).replace(/[^\d.]/g, '')) || 0;
  return Math.round(numeric * 100);
}
