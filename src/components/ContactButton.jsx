import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { IoIosHelpBuoy } from "react-icons/io";
import { BiSupport } from "react-icons/bi";

const ContactButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Replace with your actual WhatsApp number and Crisp App ID
    const whatsappUrl = "https://wa.me/message/HPK7XPQT5V2LD1"; 
    const crispAppId = "YOUR_CRISP_APP_ID";

    const openCrispChat = () => {
        if (window.$crisp) {
            window.$crisp.push(["do", "chat:open"]);
        } else {
            console.error("Crisp script not loaded.");
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            {/* Contact options */}
            <div 
                className={`flex flex-col items-end gap-4 mb-2 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                {/* WhatsApp Button */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-lg border border-green-400 shadow-xl hover:scale-110 hover:bg-green-50 transition-all relative"
                    title="WhatsApp"
                >
                    <FaWhatsapp size={28} className="text-green-500 group-hover:text-green-600 transition-colors" />
                    <span className="absolute right-full mr-3 px-3 py-1 rounded-lg bg-gray-900/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">WhatsApp</span>
                </a>
                {/* Live Chat Button */}
                <button
                    onClick={openCrispChat}
                    className="group flex items-center justify-center w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-lg border border-blue-400 shadow-xl hover:scale-110 hover:bg-blue-50 transition-all relative"
                    title="Live Chat"
                >
                    <BiSupport size={28} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                    <span className="absolute right-full mr-3 px-3 py-1 rounded-lg bg-gray-900/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Live Chat</span>
                </button>
            </div>

            {/* Main floating action button */}
            <button
                className={`flex items-center justify-center w-16 h-16 rounded-3xl shadow-2xl border-2 border-white/40 bg-white/40 backdrop-blur-2xl text-blue-700 hover:text-white hover:bg-gradient-to-tr hover:from-blue-500 hover:to-purple-600 transition-all duration-300 relative ${isOpen ? 'rotate-180' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
                aria-label="Contact options"
            >
                <span className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400/30 to-purple-400/20 blur-lg opacity-60 pointer-events-none"></span>
                {isOpen ? <FaTimes size={32} className="relative z-10" /> : <IoIosHelpBuoy size={36} className="relative z-10 animate-pulse" />}
            </button>
        </div>
    );
};

export default ContactButton; 