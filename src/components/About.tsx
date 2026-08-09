import { Award, Users, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';

const stats = [
  { icon: Award, value: '50+', label: 'Courses built', color: '#0E9A9A' },
  { icon: Users, value: '1,000+', label: 'Students helped', color: '#FFD24D' },
  { icon: TrendingUp, value: '25%', label: 'Avg salary boost', color: '#2EC4B6' },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Soft blob */}
      <div className="blob-3 -top-20 -right-10 opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand mb-3">
              <Sparkles size={16} className="text-lime" /> About Us
            </span>
            <h2 className="font-display text-4xl lg:text-[3.2rem] font-extrabold text-ink tracking-tight leading-[1.1] mb-7">
              Coaching built on <span className="relative inline-block">real outcomes
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-lime" viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 5 Q75 0, 150 5 T300 5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            <div className="space-y-5 text-ink-secondary leading-relaxed text-[17px] mb-10">
              <p>
                Grow All Coaching started with a simple belief: <strong className="text-ink">career growth should be practical, fast, and accessible</strong>. We design every course around what hiring managers actually ask for — not just academic theory.
              </p>
              <p>
                Our team combines engineers, data scientists, and career coaches with experience across startups and enterprise tech. We don't sell certificates we don't believe in — we focus on projects you can show in an interview.
              </p>
            </div>

            <ul className="grid sm:grid-cols-2 gap-3 mb-11">
              {['Project-first curriculum', 'Industry mentors', 'Real job placement support', 'Flexible learning paths'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <span className="h-6 w-6 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/10">
                    <CheckCircle2 size={14} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Stats showy */}
            <div className="flex gap-6 lg:gap-10">
              {stats.map((s) => (
                <div key={s.label} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-9 w-9 rounded-xl flex items-center justify-center shadow-md shadow-black/5 border border-black/[0.04]" style={{ background: s.color + '18', color: s.color }}>
                      <s.icon size={16} />
                    </span>
                    <span className="font-display text-3xl font-extrabold text-ink leading-none">{s.value}</span>
                  </div>
                  <div className="text-sm font-medium text-ink-secondary">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image with decorative showy shape */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-brand/15 via-lime/20 to-coral/15 -z-10 rotate-2 blur-[1px]" />
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-brand/5 via-lime/10 to-coral/10 -z-10 rotate-1" />
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl shadow-brand/10 ring-1 ring-black/5 bg-white">
              <img
                src="/about-illustration.png"
                alt="Coaching team mentoring students"
                className="w-full h-auto object-cover"
              />
              {/* subtle shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
            </div>
            {/* Small floating card showy */}
            <div className="absolute -bottom-6 -left-4 lg:-left-10 bg-white rounded-2xl px-5 py-4 shadow-2xl shadow-brand/10 border border-brand/10 max-w-[220px] z-20">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest text-brand uppercase">Est. 2018</span>
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent leading-none mb-1">6+</div>
              <div className="text-[13px] font-medium text-ink-secondary leading-snug">Years helping students land real tech roles</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
