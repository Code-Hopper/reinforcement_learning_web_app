import React, { useState } from 'react';
import axios from 'axios';

const Learning = () => {
    const [topic, setTopic] = useState('');
    const [currentTopic, setCurrentTopic] = useState(''); // ✅ Store actual topic for upload
    const [history, setHistory] = useState([]);
    const [mcqs, setMcqs] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setChecked(false);

        try {
            const res = await axios.post(
                'http://localhost:5000/api/user/generate-questions',
                { query: topic },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const questions = res.data.questions || [];

            if (questions.length > 0) {
                setMcqs(questions);
                setSelectedAnswers({});
                setCurrentTopic(topic); // ✅ Store topic before clearing
                setShowModal(true);
                setHistory(prev => [topic, ...prev.filter(t => t !== topic)]);
            } else {
                alert("No questions found.");
            }
        } catch (error) {
            console.error("Error fetching MCQs:", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
            setTopic(''); // reset input field
        }
    };

    const handleOptionSelect = (qIdx, optionLetter) => {
        if (checked) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [qIdx]: optionLetter
        }));
    };

    const handleCheckAnswers = () => {
        if (checked) return;

        if (Object.keys(selectedAnswers).length === 0) {
            alert("Please attempt at least one question.");
            return;
        }

        setChecked(true);
        uploadAnswers(); // ✅ Send answers to backend
    };

    const uploadAnswers = async () => {
        const payload = {
            topic: currentTopic,
            answers: mcqs.map((mcq, idx) => {
                const selectedLetter = selectedAnswers[idx] || null;
                const correctLetter = mcq.answer;

                // Find selected and correct options by letter
                const selectedOptionFull = selectedLetter
                    ? mcq.options.find(opt => opt.startsWith(selectedLetter)) || null
                    : null;

                const correctOptionFull = mcq.options.find(opt => opt.startsWith(correctLetter)) || null;

                return {
                    question: mcq.question,
                    selectedLetter,                 // "A"
                    selectedOption: selectedOptionFull, // "A. JavaScript"
                    correctLetter,                  // "B"
                    correctOption: correctOptionFull,   // "B. Python"
                    isCorrect: selectedLetter === correctLetter
                };
            }),
        };

        try {
            const res = await axios.post(
                'http://localhost:5000/api/user/store-answers',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (res.status === 201) {
                alert("Your answers have been stored successfully!");
            }
        } catch (error) {
            console.error("Error storing answers:", error);
            alert("Failed to store answers.");
        }
    };

    return (
        <div className='tab p-6'>
            <h2 className='text-2xl font-bold mb-4 text-primaryColor'>Let's Learn</h2>

            <form onSubmit={handleSearch} className='flex items-center gap-4 mb-6'>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., JavaScript, AI)"
                    className="px-4 py-2 rounded w-full text-black"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`py-2 px-4 rounded font-bold text-white ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {history.length > 0 && (
                <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-primaryColor mb-2'>History</h3>
                    <div className='flex flex-wrap gap-2'>
                        {history.map((item, index) => (
                            <span key={index} className='bg-gray-700 text-white px-3 py-1 rounded-full text-sm'>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-[90%] max-w-xl max-h-[80vh] overflow-y-auto'>
                        <h3 className='text-xl font-bold mb-4 text-center'>MCQs for your topic</h3>

                        {mcqs.map((mcq, idx) => (
                            <div key={idx} className='mb-4'>
                                <p className='font-semibold text-gray-800'>{idx + 1}. {mcq.question}</p>
                                <ul className='pl-4'>
                                    {(mcq.options || []).map((opt, i) => {
                                        const optionLetter = opt[0]; // e.g., "A"
                                        const isSelected = selectedAnswers[idx] === optionLetter;
                                        const isCorrect = mcq.answer === optionLetter;

                                        let bg = '';
                                        if (checked) {
                                            if (isSelected && isCorrect) {
                                                bg = 'bg-green-200 text-green-800';
                                            } else if (isSelected && !isCorrect) {
                                                bg = 'bg-red-200 text-red-800';
                                            } else if (!isSelected && isCorrect) {
                                                bg = 'bg-green-100';
                                            }
                                        } else if (isSelected) {
                                            bg = 'bg-blue-100';
                                        }

                                        return (
                                            <li
                                                key={i}
                                                className={`cursor-pointer p-2 rounded ${bg}`}
                                                onClick={() => handleOptionSelect(idx, optionLetter)}
                                            >
                                                {opt}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}

                        <div className='text-center mt-6 flex flex-col gap-3'>
                            {!checked && (
                                <button
                                    onClick={handleCheckAnswers}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Check Answers
                                </button>
                            )}
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Learning;