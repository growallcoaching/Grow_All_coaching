import { ArrowUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-deep text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/8 via-transparent to-lime/5 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 lg:pt-20 pb-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16 mb-14">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3.5 mb-5" aria-label="Grow All Coaching home">
              <span className="relative h-11 w-11 rounded-full bg-gradient-to-tr from-brand to-lime p-[2px] shadow-lg shadow-black/20">
                <span className="flex h-full w-full rounded-full bg-white p-[2px]">
                  <img
                    src="/gac-logo.png"
                    alt="GAC Grow More logo"
                    className="h-full w-full rounded-full object-cover"
                  />
                </span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold text-white leading-none tracking-tight">
                  Grow All <span className="text-lime">Coaching</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.18em] text-white/50 uppercase mt-1 flex items-center gap-1">
                  GAC • Grow More <Sparkles size={10} className="text-lime" />
                </span>
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed mb-6 max-w-sm">
              Premium career courses and paid internships built for real job outcomes. Project-first, mentor-supported, results-driven.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white text-deep font-display font-bold px-6 py-3 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started <ArrowUp size={16} className="rotate-45" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-display font-bold text-white mb-4">Programs</h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/60">
              <li><Link to="/#courses" className="hover:text-lime transition-colors">Full-Stack Web Dev</Link></li>
              <li><Link to="/#courses" className="hover:text-lime transition-colors">AI & Machine Learning</Link></li>
              <li><Link to="/#courses" className="hover:text-lime transition-colors">Excel Automation</Link></li>
              <li><Link to="/#internships" className="hover:text-lime transition-colors">Internship Tracks</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 md:col-start-10">
            <h4 className="font-display font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/60">
              <li><Link to="/#about" className="hover:text-lime transition-colors">About Us</Link></li>
              <li><Link to="/#testimonials" className="hover:text-lime transition-colors">Student Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-lime transition-colors">Contact</Link></li>
              <li><Link to="/" className="hover:text-lime transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <div>© {new Date().getFullYear()} Grow All Coaching. All rights reserved. <span className="text-white/70">GAC — Grow More</span></div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
