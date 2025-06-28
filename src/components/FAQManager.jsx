import React, { useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa';
import * as yup from 'yup';

const faqSchema = yup.object().shape({
  question: yup.string().trim().min(5, 'Question too short').max(200, 'Question too long').required('Question is required'),
  answer: yup.string().trim().min(5, 'Answer too short').max(1000, 'Answer too long').required('Answer is required'),
});

const sanitize = (str) => str.replace(/<[^>]*>?/gm, '').trim();

const FAQManager = ({ faqs, onSave, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentFaq, setCurrentFaq] = useState({ id: null, question: '', answer: '' });
    const [errors, setErrors] = useState({});

    const handleFormSubmit = async (e) => {
        console.log('FAQ form submitted');
        e.preventDefault();
        setErrors({});
        const sanitizedFaq = {
            ...currentFaq,
            question: sanitize(currentFaq.question),
            answer: sanitize(currentFaq.answer),
        };
        try {
            await faqSchema.validate(sanitizedFaq, { abortEarly: false });
            onSave(sanitizedFaq);
            resetForm();
        } catch (err) {
            if (err.inner) {
                const formErrors = {};
                err.inner.forEach(e => { formErrors[e.path] = e.message; });
                setErrors(formErrors);
            }
        }
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
                        {errors.question && (
                            <span className="text-red-500 text-sm">{errors.question}</span>
                        )}
                        <textarea
                            placeholder="Answer"
                            value={currentFaq.answer}
                            onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                            className="p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 h-24"
                            required
                        />
                        {errors.answer && (
                            <span className="text-red-500 text-sm">{errors.answer}</span>
                        )}
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