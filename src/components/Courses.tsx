import { Code2, Brain, Zap, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';

const courses = [
  {
    title: 'Full-Stack Web Development',
    desc: 'React, Node.js, and modern APIs. Build real products from week one.',
    price: '$299',
    tag: 'Bestseller',
    tagColor: 'bg-brand text-white shadow-brand/20',
    accent: '#0E9A9A',
    tint: 'bg-brand/10',
    icon: Code2,
    features: ['12-week program', 'Portfolio review', '1:1 mentoring'],
  },
  {
    title: 'AI & Machine Learning',
    desc: 'Python, LLMs, and data pipelines. Learn to build intelligent apps.',
    price: 'Free',
    tag: 'New 2026 ✨',
    tagColor: 'bg-lime text-ink shadow-lime/20',
    accent: '#FFD24D',
    tint: 'bg-lime/20',
    icon: Brain,
    features: ['10-week bootcamp', 'Open-source projects', 'Industry datasets'],
  },
  {
    title: 'Excel Automation & BI',
    desc: 'Power Query, dashboards, and workflow automation for business growth.',
    price: '$149',
    tag: 'Popular',
    tagColor: 'bg-coral text-white',
    accent: '#2EC4B6',
    tint: 'bg-coral/12',
    icon: Zap,
    features: ['8-week course', 'Real business cases', 'Certificate'],
  },
];

export default function Courses() {
  return (
    <section id="courses" className="relative py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-16 lg:mb-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand mb-3">
              <Sparkles size={16} className="text-lime" /> Premium Courses
            </span>
            <h2 className="font-display text-4xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.1] mb-5">
              Our Premium <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">Courses</span>
            </h2>
            <p className="text-lg text-ink-secondary leading-relaxed">
              Practical, project-based training designed by hiring managers — not just theory. Pick the path that matches your goals.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-ink text-white font-display font-bold px-7 py-3.5 shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            View All Programs <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-7 lg:gap-9">
          {courses.map((c) => (
            <article
              key={c.title}
              className="group relative flex flex-col rounded-[2rem] bg-card border border-black/[0.05] shadow-[0_16px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_70px_rgba(14,154,154,0.15)] hover:-translate-y-2.5 transition-all duration-500 overflow-hidden"
            >
              {/* Top colored accent bar with shimmer */}
              <div className="h-1.5 w-full relative overflow-hidden" style={{ background: c.accent }}>
                <span className="absolute inset-0 shimmer opacity-40" />
              </div>

              <div className="p-8 lg:p-10 flex flex-col flex-1">
                {/* Icon tile showy */}
                <div className={`mb-7 inline-flex h-16 w-16 rounded-2xl items-center justify-center shadow-md shadow-black/5 relative overflow-hidden ${c.tint}`}>
                  <span className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-60" />
                  <c.icon size={28} style={{ color: c.accent }} strokeWidth={2} className="relative z-10" />
                </div>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-ink leading-snug tracking-tight">{c.title}</h3>
                  <span className={`shrink-0 text-[11px] font-extrabold px-3 py-1 rounded-full ${c.tagColor} shadow-sm`}>{c.tag}</span>
                </div>

                <p className="text-ink-secondary leading-relaxed mb-6">{c.desc}</p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-ink-secondary">
                      <CheckCircle2 size={16} style={{ color: c.accent }} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t border-black/[0.05]">
                  <div className="font-display text-2xl font-extrabold text-ink">{c.price}</div>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-brand/8 text-brand font-bold text-sm px-5 py-2 hover:bg-brand hover:text-white transition-colors duration-300"
                  >
                    View Course
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
