import { useEffect, useState } from 'react';
import { Monitor, Sparkles, Briefcase, ArrowRight, X } from 'lucide-react';

const tracks = [
  {
    title: 'Web Development Internship',
    desc: 'Build production-grade frontend and backend features under senior engineers. Real tickets, real reviews.',
    duration: '3 months',
    price: '₹999',
    badge: 'Frontend + Backend',
    icon: Monitor,
    color: '#0E9A9A',
  },
  {
    title: 'AI / ML Internship',
    desc: 'Learn how to build intelligent solutions using Python, Machine Learning, and AI. Work on real-world datasets, train predictive models, and turn data into practical AI applications with guidance from experienced mentors.',
    duration: '3 months',
    price: '₹1999',
    badge: 'ML + Python',
    icon: Sparkles,
    color: '#FFD24D',
  },
  {
    title: 'Automation & BI Internship',
    desc: 'Turn raw data into meaningful insights and interactive dashboards using Power BI. Learn data cleaning, visualization, reporting, and business analytics while working with real-world datasets and practical projects.',
    duration: '2 months',
    price: '₹2999',
    badge: 'Automation + Analytics',
    icon: Briefcase,
    color: '#2EC4B6',
  },
];

const steps = [
  { num: '01', title: 'Apply', desc: 'Send your resume and a short note — no cover letter required.' },
  { num: '02', title: 'Learn', desc: 'Join our bootcamp and work on real tasks with team feedback.' },
  { num: '03', title: 'Get Placed', desc: 'Earn a certificate and get introduced to hiring partners.' },
];

const featureRows = [
  { label: 'Real Projects', icon: '</>' },
  { label: 'Expert Mentors', icon: '◌' },
  { label: 'Certificate', icon: '★' },
  { label: 'Placement Support', icon: '▣' },
];

const buildTiles = [
  'Responsive\nWeb Apps',
  'RESTful APIs\n& Backend',
  'Authentication\n& Security',
  'Deployment\n& Hosting',
];

export default function Internships() {
  const [selectedProgram, setSelectedProgram] = useState<(typeof tracks)[number] | null>(null);

  useEffect(() => {
    if (!selectedProgram) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProgram]);

  return (
    <>
      <section id="internships" className="relative overflow-hidden">
        {/* Dark band - deep teal showy */}
        <div className="bg-deep relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-lime/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-warm to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-warm to-transparent z-10" />

        {/* Blob accents showy */}
        <div className="absolute top-10 -left-32 w-80 h-80 bg-brand/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-32 w-80 h-80 bg-lime/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-coral/5 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-28 lg:pt-36 pb-20 lg:pb-28">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-lime mb-4">
              <span className="h-1 w-8 rounded-full bg-lime" /> Internship Programs <span className="h-1 w-8 rounded-full bg-lime" />
            </span>
            <h2 className="font-display text-4xl lg:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Learn by building <span className="text-lime relative">real things
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-lime/30 rounded-full blur-[1px]" />
              </span>
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Our internships are not shadowing — they're hands-on, paid, and designed to turn you into a hireable professional in under 3 months.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7 lg:gap-9 mb-24 lg:mb-32">
            {tracks.map((t) => (
              <article
                key={t.title}
                className="group rounded-[2rem] bg-white/[0.07] border border-white/10 backdrop-blur-md p-8 lg:p-10 hover:bg-white/[0.11] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="relative z-10">
                  <div className="inline-flex h-14 w-14 rounded-2xl items-center justify-center mb-7 shadow-lg shadow-black/20 border border-white/10 relative overflow-hidden" style={{ background: t.color + '22', color: t.color }}>
                    <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <t.icon size={26} strokeWidth={2} className="relative z-10" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">{t.title}</h3>
                  <p className="text-white/60 leading-relaxed mb-6">{t.desc}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-sm font-semibold text-white/50">Duration: <span className="text-white">{t.duration}</span></span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProgram(t);
                        window.localStorage.setItem('gac_selected_program', JSON.stringify(t));
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-lime hover:text-deep px-4 py-2 transition-colors duration-300"
                    >
                      Apply Now <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* How it works strip showy */}
          <div className="relative">
            <h3 className="text-center font-display text-2xl lg:text-3xl font-extrabold text-white mb-14 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-white/20 hidden sm:block" /> How it works <span className="h-px w-10 bg-white/20 hidden sm:block" />
            </h3>
            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-stretch gap-6 lg:gap-4 relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-14 left-[20%] right-[20%] h-0 border-t-2 border-dashed border-white/15" />

              {steps.map((s) => (
                <div key={s.num} className="flex-1 relative">
                  <div className="rounded-3xl bg-white/[0.06] border border-white/10 p-8 lg:p-9 hover:bg-white/[0.10] transition-colors duration-300 text-center backdrop-blur-sm relative overflow-hidden group/step">
                    <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover/step:opacity-100 transition" />
                    <div className="relative z-10">
                      <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-brand to-brand-dark flex items-center justify-center text-white font-extrabold text-xl shadow-xl shadow-brand/30 mb-5 ring-4 ring-white/10">
                        {s.num}
                      </div>
                      <h4 className="font-display text-xl font-bold text-white mb-2">{s.title}</h4>
                      <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#324343]/70 px-4 py-6 backdrop-blur-[2px]" onClick={() => setSelectedProgram(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="internship-modal-title"
            className="w-full max-w-[1100px] max-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] border border-[#DFF1F1] bg-[#F8FEFE] p-5 sm:p-7 lg:p-8 shadow-[0_30px_90px_rgba(15,35,35,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-display text-[0.82rem] font-bold uppercase tracking-[0.24em] text-brand">
                  Internship Program
                </p>
                <h3 id="internship-modal-title" className="mt-4 font-display text-[clamp(2rem,3vw,3.4rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-ink">
                  {selectedProgram.title}
                </h3>
                <p className="mt-2 text-[1.2rem] italic font-medium text-ink/80">
                  Build. Learn. Ship. Get Placed.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E9F9F9] text-ink shadow-sm transition hover:bg-[#DFF6F6]"
                aria-label="Close internship details"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-7 rounded-[20px] border border-[#D7F3F1] bg-[#EAF9F8] px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex w-fit items-center rounded-full bg-[#DDF4F4] px-4 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.28em] text-brand">
                  {selectedProgram.badge}
                </span>
                <span className="text-[2.3rem] font-extrabold leading-none tracking-[-0.08em] text-ink sm:text-[2.7rem]">{selectedProgram.price}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.96rem] text-ink/80">
                {featureRows.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2">
                    <span className="text-[1rem] leading-none">{item.icon}</span>
                    {item.label}
                  </span>
                ))}
                <span className="ml-auto text-ink/60">One-time fee</span>
              </div>
            </div>

            <div className="mt-8 text-ink/80">
              <p className="text-[1.08rem] leading-[1.8] font-medium sm:text-[1.18rem]">
                {selectedProgram.desc}
              </p>
            </div>

            <div className="mt-8 space-y-4 text-ink">
              <div className="flex items-start gap-4 text-[1.02rem] sm:text-[1.15rem]">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DBF6EF] text-lg text-brand">✓</span>
                <span><span className="font-extrabold">Duration:</span> {selectedProgram.duration} of hands-on learning and development</span>
              </div>
              <div className="flex items-start gap-4 text-[1.02rem] sm:text-[1.15rem]">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DBF6EF] text-lg text-brand">✓</span>
                <span><span className="font-extrabold">Format:</span> Live guided sessions + code reviews + 1:1 mentor feedback</span>
              </div>
              <div className="flex items-start gap-4 text-[1.02rem] sm:text-[1.15rem]">
                <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DBF6EF] text-lg text-brand">✓</span>
                <span><span className="font-extrabold">Outcome:</span> Portfolio-ready projects, certificate & placement assistance</span>
              </div>
            </div>

            <div className="mt-8 rounded-[20px] border border-[#D7F3F1] bg-[#EAF9F8] p-4 sm:p-5">
              <p className="font-display text-[0.9rem] font-extrabold uppercase tracking-[0.26em] text-ink">What you'll build</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {buildTiles.map((item, index) => (
                  <div key={index} className="rounded-[14px] border border-[#D7F3F1] bg-white/70 px-3 py-4 text-center text-ink shadow-sm">
                    <div className="mb-2 text-2xl text-brand">
                      {index === 0 && '▣'}
                      {index === 1 && '◫'}
                      {index === 2 && '☁'}
                      {index === 3 && '✦'}
                    </div>
                    <div className="text-[1rem] font-medium leading-snug whitespace-pre-line">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-[#D7F3F1] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-[1.05rem] text-ink/70">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#DDF4F4] text-[10px] text-brand">◉</span>
                Limited seats. Start your journey today!
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="rounded-full border border-[#CFE9E9] bg-white px-7 py-3.5 text-[1.1rem] font-bold text-ink shadow-sm transition hover:bg-[#F3FDFD]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.setItem('gac_selected_program', JSON.stringify(selectedProgram));
                    window.location.hash = '#enroll';
                    setSelectedProgram(null);
                  }}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-brand to-brand-dark px-7 py-3.5 text-[1.1rem] font-bold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5"
                >
                  Enroll Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
