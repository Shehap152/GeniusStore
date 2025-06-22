import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { IoIosHelpBuoy } from "react-icons/io";
import { BiSupport } from "react-icons/bi";

const ContactButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Replace with your actual WhatsApp number and Crisp App ID
    const whatsappUrl = "https://wa.me/YOUR_WHATSAPP_NUMBER"; 
    const crispAppId = "YOUR_CRISP_APP_ID";

    const openCrispChat = () => {
        if (window.$crisp) {
            window.$crisp.push(["do", "chat:open"]);
        } else {
            console.error("Crisp script not loaded.");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Contact options */}
            <div 
                className={`flex flex-col items-center gap-4 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                {/* WhatsApp Button */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="WhatsApp"
                >
                    <FaWhatsapp size={28} color="white" />
                </a>
                
                {/* Crisp Chat Button */}
                <button
                    onClick={openCrispChat}
                    className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Live Chat"
                >
                    <BiSupport size={28} color="white" />
                </button>
            </div>

            {/* Main floating action button */}
            <button
                className={`mt-4 flex items-center justify-center w-16 h-16 rounded-full text-white shadow-xl transform transition-all duration-300 ease-in-out hover:scale-110 ${isOpen ? 'bg-gradient-to-r from-red-500 to-red-700 rotate-180' : 'bg-gradient-to-r from-purple-500 to-indigo-600'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={28} /> : <IoIosHelpBuoy size={32} />}
            </button>
        </div>
    );
};

export default ContactButton; 