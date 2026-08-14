import { FormEvent, useEffect, useState } from 'react';
import { Send, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  interest: 'General Inquiry',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleChange = (
    field: keyof ContactFormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus({
        type: 'error',
        text: 'Please enter your name, email, and message before sending.',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus({
        type: 'error',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone || null,
        interest: form.interest || 'General Inquiry',
        message: trimmedMessage,
        user_id: userId ?? null,
      });

      if (error) {
        throw error;
      }

      setStatus({
        type: 'success',
        text: userId
          ? `Thanks! Your message was sent and linked to your account (${userEmail ?? 'logged in user'}).`
          : 'Thanks! Your message was received. You are not logged in, so no user_id was attached.',
      });
      setForm(initialForm);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to send message. Please try again.';
      setStatus({
        type: 'error',
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 lg:py-36 overflow-hidden">
      <div className="blob-2 top-10 -left-20 opacity-60" />
      <div className="blob-3 bottom-10 -right-20 opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand mb-3">
              <Sparkles size={16} className="text-lime" /> Contact
            </span>
            <h2 className="font-display text-4xl lg:text-[3.2rem] font-extrabold text-ink tracking-tight leading-[1.1] mb-7">
              Let's work <span className="relative inline-block">together
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-lime" viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 5 Q75 0, 150 5 T300 5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-ink-secondary leading-relaxed mb-10">
              Whether you're exploring a course, applying for an internship, or just want to ask a quick question — we'd love to hear from you.
            </p>

            <div className="space-y-5">
              {[
                { icon: Mail, text: 'growallcoaching@gmail.com', link: 'mailto:growallcoaching@gmail.com' },
                { icon: Phone, text: '+91 89892 91145', link: 'tel:+918989291145' },
                { icon: MapPin, text: 'Bhopal & Online — India', link: '#' },
              ].map((item) => (
                <a key={item.text} href={item.link} className="flex items-center gap-4 group">
                  <span className="h-12 w-12 rounded-2xl bg-brand/8 text-brand flex items-center justify-center shadow-md shadow-brand/10 group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-brand-dark group-hover:text-white group-hover:shadow-brand/20 border border-brand/10 transition-all duration-300">
                    <item.icon size={20} />
                  </span>
                  <span className="text-ink-secondary font-medium group-hover:text-ink transition-colors">{item.text}</span>
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2.5rem] bg-card border border-black/[0.05] shadow-[0_20px_60px_rgba(14,154,154,0.10)] p-8 lg:p-12 relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand via-lime to-coral" />

            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-brand/10 bg-brand/5 px-4 py-3 text-sm text-ink-secondary">
              <span>{userId ? `Logged in as ${userEmail ?? 'user'}` : 'Guest message: no user_id will be saved'}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-ink mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-xl bg-warm border border-black/[0.08] px-5 py-3.5 text-ink font-medium placeholder:text-ink-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-ink mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full rounded-xl bg-warm border border-black/[0.08] px-5 py-3.5 text-ink font-medium placeholder:text-ink-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="phone" className="block text-sm font-bold text-ink mb-2">Phone (optional)</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl bg-warm border border-black/[0.08] px-5 py-3.5 text-ink font-medium placeholder:text-ink-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="subject" className="block text-sm font-bold text-ink mb-2">Interested in</label>
              <select
                id="subject"
                value={form.interest}
                onChange={(e) => handleChange('interest', e.target.value)}
                className="w-full rounded-xl bg-warm border border-black/[0.08] px-5 py-3.5 text-ink font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none cursor-pointer"
              >
                <option>Web Development Course</option>
                <option>AI / ML Course</option>
                <option>Excel Automation Course</option>
                <option>Internship Program</option>
                <option>General Inquiry</option>
              </select>
            </div>

            <div className="mb-7">
              <label htmlFor="message" className="block text-sm font-bold text-ink mb-2">Message</label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Tell us a bit about your goals..."
                required
                className="w-full rounded-xl bg-warm border border-black/[0.08] px-5 py-3.5 text-ink font-medium placeholder:text-ink-secondary/60 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand to-brand-dark text-white font-display font-bold text-base px-8 py-4 shadow-xl shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group/btn disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r from-white/15 to-transparent transition" />
              {loading ? 'Sending...' : 'Send Message'} <Send size={18} className="relative z-10" />
            </button>

            {status && (
              <p
                className={`mt-5 text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                aria-live="polite"
              >
                {status.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
