import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const links = [
  { label: 'Courses', to: '/#courses' },
  { label: 'About', to: '/#about' },
  { label: 'Internships', to: '/#internships' },
  { label: 'Testimonials', to: '/#testimonials' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

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
          <Link to="/" className="flex items-center gap-3.5 group" aria-label="Grow All Coaching home">
            <span className="relative flex h-12 w-12 items-center justify-center">
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
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/75 backdrop-blur rounded-full px-2 py-1.5 shadow-[0_2px_12px_rgba(14,154,154,0.08)] border border-white/60">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="relative px-4 py-2 text-[13px] font-medium text-ink-secondary hover:text-ink rounded-full hover:bg-brand/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="relative inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 text-brand text-sm font-bold px-5 py-2.5 shadow-sm hover:bg-brand/10 transition-all duration-300"
                >
                  My Account
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="relative inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-bold px-5 py-2.5 shadow-lg shadow-[#25D366]/30 hover:bg-[#1EBE5A] transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Authentication/Login"
                  className="relative inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#E8F9EE] text-[#128C7E] text-sm font-bold px-5 py-2.5 shadow-sm hover:bg-[#DFF7E7] transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="relative inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-bold px-5 py-2.5 shadow-lg shadow-[#25D366]/30 hover:bg-[#1EBE5A] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition bg-gradient-to-r from-white/10 to-transparent" />
                  Signup
                </Link>
              </>
            )}
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
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-display font-semibold text-ink py-3 rounded-2xl hover:bg-brand/5 px-4 transition"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4 grid gap-3">
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-brand/30 bg-brand/5 text-brand text-center font-bold py-4 shadow-sm"
                >
                  My Account
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="rounded-full bg-[#25D366] text-white text-center font-bold py-4 shadow-lg shadow-[#25D366]/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Authentication/Login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-[#25D366]/30 bg-[#E8F9EE] text-[#128C7E] text-center font-bold py-4 shadow-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-[#25D366] text-white text-center font-bold py-4 shadow-lg shadow-[#25D366]/30"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
