import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const links = [
  { label: 'Courses', href: '#courses' },
  { label: 'About', href: '#about' },
  { label: 'Internships', href: '#internships' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_#E6F6F6] border-b border-black/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <nav className="flex h-[84px] items-center justify-between">
          <a href="#" className="flex items-center gap-3.5 group" aria-label="Grow All Coaching home">
            <span className="relative flex h-12 w-12 items-center justify-center">
              {/* showy outer glow */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand via-brand to-lime opacity-20 blur-[10px] group-hover:opacity-30 transition" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand to-lime p-[2px] shadow-lg shadow-brand/20">
                <span className="flex h-full w-full rounded-full bg-white p-[2px]">
                  <img
                    src="/gac-logo.png"
                    alt="GAC Grow More logo"
                    className="h-full w-full rounded-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </span>
              </span>
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-lime border-2 border-white flex items-center justify-center shadow-md">
                <Sparkles size={8} className="text-ink" />
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[21px] font-extrabold text-ink tracking-tight leading-none">
                Grow All <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">Coaching</span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.18em] text-brand/70 uppercase mt-0.5">GAC • Grow More</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1 bg-white/75 backdrop-blur rounded-full px-2 py-1.5 shadow-[0_2px_12px_rgba(14,154,154,0.08)] border border-white/60">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative px-4 py-2 text-[13px] font-medium text-ink-secondary hover:text-ink rounded-full hover:bg-brand/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href="#contact"
              className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-dark text-white text-sm font-bold px-6 py-3 shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group/btn"
            >
              <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition bg-gradient-to-r from-white/10 to-transparent" />
              Get Started
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-11 w-11 rounded-full bg-white shadow-md border border-black/5 flex items-center justify-center text-ink"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-[84px] z-40 bg-warm/95 backdrop-blur-2xl transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2 px-6 pt-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-display font-semibold text-ink py-3 rounded-2xl hover:bg-brand/5 px-4 transition"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-4 rounded-full bg-brand text-white text-center font-bold py-4 shadow-lg shadow-brand/20"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
