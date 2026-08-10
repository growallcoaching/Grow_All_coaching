import { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';
import About from './components/About';
import Internships from './components/Internships';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsApp from './components/WhatsApp';
import Revealer from './components/Revealer';
import EnrollmentForm from './components/EnrollmentForm';

export default function App() {
  const [view, setView] = useState<'home' | 'enroll'>('home');

  useEffect(() => {
    const syncView = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'enroll') setView('enroll');
      else setView('home');
    };

    syncView();
    window.addEventListener('hashchange', syncView);
    return () => window.removeEventListener('hashchange', syncView);
  }, []);

  if (view === 'enroll') {
    return (
      <div className="min-h-screen bg-[#F7F9F9] text-ink font-body selection:bg-brand/20">
        <Header />
        <main className="pt-[84px]">
          <EnrollmentForm />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm text-ink font-body selection:bg-brand/20">
      <Header />
      <main>
        <Hero />
        <Revealer><Courses /></Revealer>
        <Revealer><About /></Revealer>
        <Revealer><Internships /></Revealer>
        <Revealer><Testimonials /></Revealer>
        <Revealer><Contact /></Revealer>
      </main>
      <Footer />
      <WhatsApp />
    </div>
  );
}
