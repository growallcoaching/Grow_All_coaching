import { ArrowRight, Sparkles, Star, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-36 pb-24 lg:pt-48 lg:pb-32">
      {/* Blobs */}
      <div className="blob-1 -top-20 -left-24" />
      <div className="blob-2 top-40 -right-24" />
      {/* subtle sparkle dots */}
      <div className="absolute top-32 left-[18%] h-2 w-2 rounded-full bg-lime/60 blur-[0.5px]" />
      <div className="absolute top-48 right-[12%] h-1.5 w-1.5 rounded-full bg-brand/40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* Left text */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-brand/15 px-4 py-1.5 text-[13px] font-bold text-brand mb-7 shadow-[0_2px_12px_rgba(14,154,154,0.08)]">
              <span className="h-6 w-6 rounded-full bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center shadow-sm">
                <Sparkles size={12} />
              </span>
              New 2026 Cohort — Limited Seats
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            </div>

            <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] font-extrabold text-ink tracking-tight mb-7">
              Build the career <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">you actually want.</span>
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-lime" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 6 Q100 0, 200 6 T400 6" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-ink-secondary leading-relaxed mb-10 max-w-lg">
              Premium career courses and paid internships in Web Development, AI/ML, and Automation — designed for real job outcomes, not just certificates.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#courses"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand to-brand-dark text-white font-display font-bold text-base px-8 py-4 shadow-xl shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/15 to-transparent transition" />
                Explore Courses <ArrowRight size={18} className="relative z-10" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2.5 rounded-full bg-white text-ink font-display font-bold text-base px-8 py-4 border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300"
              >
                Learn More
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2 text-sm font-medium text-ink-secondary">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-md shadow-brand/15">
                  <Users size={16} />
                </span>
                <span><strong className="text-ink">500+</strong> students trained</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill="currentColor" stroke="none" />
                ))}
                <span className="ml-1 text-sm font-semibold text-ink">4.9/5</span>
                <span className="text-sm text-ink-secondary">rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-ink-secondary">
                <span className="h-2 w-2 rounded-full bg-lime animate-pulse shadow shadow-lime/50" />
                <span>Hiring partners: <strong className="text-ink">12</strong> companies</span>
              </div>
            </div>
          </div>

          {/* Right illustration - showy */}
          <div className="relative lg:pl-6">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand/15 ring-1 ring-black/5 bg-white p-2">
              <div className="rounded-[2rem] overflow-hidden relative">
                <img
                  src="/hero-illustration.png"
                  alt="Young student learning with laptop"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                {/* glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 via-transparent to-lime/10 pointer-events-none" />
                {/* Overlaid mini stat cards inside image area */}
                <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                  <div className="flex-1 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-xl shadow-black/10 border border-white/50">
                    <div className="text-2xl font-extrabold bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent leading-none">92%</div>
                    <div className="text-xs font-bold text-ink-secondary mt-1 tracking-wide">Placement rate</div>
                  </div>
                  <div className="flex-1 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-xl shadow-black/10 border border-lime/30">
                    <div className="text-2xl font-extrabold text-ink leading-none flex items-center gap-1">3.2x <span className="text-lime text-lg">✦</span></div>
                    <div className="text-xs font-bold text-ink-secondary mt-1 tracking-wide">Avg salary lift</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative blobs behind showy */}
            <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-brand/12 blur-3xl -z-0" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-lime/25 blur-3xl -z-0" />
            <div className="absolute top-1/2 -right-6 w-32 h-32 rounded-full bg-coral/10 blur-2xl -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
