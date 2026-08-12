import { Star, Quote, Sparkles } from 'lucide-react';

const testimonials = [
  {
    quote: "The web dev course changed my career. Within two months of completing it, I landed a junior developer role with a 40% salary increase. The projects were real — not toy examples.",
    name: 'Piyush Pawar',
    role: 'Junior Web Developer, TechNova',
    img: 'https://res.cloudinary.com/drptz4uh/image/upload/v1786547968/Piyush_Pawar_p30env.jpg',
    rating: 5,
  },
  {
    quote: "I came in with basic Excel skills and left knowing Power BI and automation workflows. My manager specifically asked how I learned so fast — it was this program.",
    name: 'Ananya Singh',
    role: 'BI Analyst, FinEdge',
    img: 'https://res.cloudinary.com/drptz4uh/image/upload/v1786547968/Ananya_Singh_cti4r9.jpg',
    rating: 5,
  },
  {
    quote: "The AI internship was hands-on from day one. I contributed to a real model pipeline and got a full-time offer after the program ended. Best investment I made.",
    name: 'Rohit Mehra',
    role: 'ML Engineer, Neural Labs',
    img: 'https://res.cloudinary.com/drptz4uh/image/upload/v1786548053/Rohit_Mehra_aartng.jpg',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 lg:py-36 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand mb-3">
            <Sparkles size={16} className="text-lime" /> Testimonials
          </span>
          <h2 className="font-display text-4xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.1] mb-5">
            What students <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">say</span>
          </h2>
          <p className="text-lg text-ink-secondary leading-relaxed">Real outcomes from real students — not marketing copy.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="group relative rounded-[2rem] bg-card border border-black/[0.05] shadow-[0_16px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_70px_rgba(14,154,154,0.12)] hover:-translate-y-2.5 transition-all duration-500 p-8 lg:p-10 flex flex-col overflow-hidden"
            >
              <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand via-lime to-coral opacity-0 group-hover:opacity-100 transition" />
              <Quote size={32} className="text-brand/20 mb-5" strokeWidth={2.5} />
              <p className="text-ink leading-relaxed mb-8 flex-1">"{t.quote}"</p>

              <div className="flex items-center gap-4 pt-6 border-t border-black/[0.05]">
                <img
                  src={t.img}
                  alt={t.name}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-md shadow-black/5"
                  loading="lazy"
                />
                <div>
                  <div className="font-display font-bold text-ink leading-tight">{t.name}</div>
                  <div className="text-[13px] text-ink-secondary font-medium">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5 text-lime">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
