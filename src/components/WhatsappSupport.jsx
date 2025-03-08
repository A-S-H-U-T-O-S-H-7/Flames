import { FaWhatsapp } from "react-icons/fa";

export const WhatsAppSupport = () => (
  <a 
    href="https://wa.me/yourphonenumber" 
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center gap-2"
  >
    <FaWhatsapp size={20} />
    <span className="hidden md:inline">Message us for help</span>
  </a>
);