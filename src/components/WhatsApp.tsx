import { MessageCircle } from 'lucide-react';

export default function WhatsApp() {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-7 right-7 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/30 hover:scale-110 hover:shadow-[#25D366]/50 transition-all duration-300 ring-4 ring-warm/60"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={2} />
    </a>
  );
}
