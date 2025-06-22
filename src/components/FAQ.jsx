import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { subscribeToFaqs } from '../logic/faqService';
import LoadingIndicator from './LoadingIndicator';

const FaqItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
                className="w-full flex justify-between items-center py-5 px-2 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                onClick={onClick}
            >
                <span className="text-xl font-semibold">{question}</span>
                <FaChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <p className="pb-5 px-2 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToFaqs((faqsData) => {
            setFaqs(faqsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-16 p-8">
                <LoadingIndicator />
            </div>
        );
    }

    if (faqs.length === 0) {
        return null; // Don't render the section if there are no FAQs
    }

    return (
        <div className="w-full max-w-3xl mx-auto mt-24 p-6 md:p-8 bg-white/30 dark:bg-gray-900/50 rounded-2xl shadow-2xl backdrop-blur-xl">
            <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
                Frequently Asked Questions
            </h2>
            <div className="space-y-2">
                {faqs.map((faq, index) => (
                    <FaqItem
                        key={faq.id}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ; 