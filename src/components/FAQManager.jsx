import React, { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';

const FAQManager = ({ faqs, onSave, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentFaq, setCurrentFaq] = useState({ id: null, question: '', answer: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSave(currentFaq);
        resetForm();
    };
    
    const handleEdit = (faq) => {
        setEditMode(true);
        setCurrentFaq(faq);
        if (!isExpanded) setIsExpanded(true);
    };

    const handleDelete = (id) => {
        onDelete(id);
    };
    
    const resetForm = () => {
        setEditMode(false);
        setCurrentFaq({ id: null, question: '', answer: '' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <button
                className="w-full flex justify-between items-center text-xl font-semibold text-gray-700 dark:text-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span>Manage FAQs</span>
                <FaChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] mt-6' : 'max-h-0'}`}>
                {/* FAQ Form */}
                <form onSubmit={handleFormSubmit} className="mb-8 p-4 border rounded-lg dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">{editMode ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Question"
                            value={currentFaq.question}
                            onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                        <textarea
                            placeholder="Answer"
                            value={currentFaq.answer}
                            onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 h-24"
                            required
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                {editMode ? 'Update FAQ' : 'Add FAQ'}
                            </button>
                            {editMode && (
                                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs && faqs.length > 0 ? (
                        faqs.map(faq => (
                            <div key={faq.id} className="p-4 border rounded-lg dark:border-gray-700 flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{faq.question}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <button onClick={() => handleEdit(faq)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FaEdit /></button>
                                    <button onClick={() => handleDelete(faq.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"><FaTrash /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No FAQs yet. Add one above!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FAQManager; 