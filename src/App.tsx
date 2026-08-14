import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

function HomePage() {
  return (
    <>
      <Hero />
      <Revealer><Courses /></Revealer>
      <Revealer><About /></Revealer>
      <Revealer><Internships /></Revealer>
      <Revealer><Testimonials /></Revealer>
      <Revealer><Contact /></Revealer>
    </>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elementId = location.hash.replace('#', '');
    const element = document.getElementById(elementId);

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-warm text-ink font-body selection:bg-brand/20">
      <Header />
      <main className="pt-[84px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/enroll" element={<EnrollmentForm />} />
        </Routes>
      </main>
      <Footer />
      {location.pathname !== '/login' && location.pathname !== '/signup' && <WhatsApp />}
    </div>
  );
}
