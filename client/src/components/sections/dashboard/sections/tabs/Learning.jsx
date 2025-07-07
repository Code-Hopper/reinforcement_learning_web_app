import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../../../context/userContext.jsx';

const Learning = () => {
    const { addPoints } = useUser();

    const [topicsToLearn, setTopicsToLearn] = useState([]);
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [difficulty, setDifficulty] = useState('Easy');

    const [currentTopic, setCurrentTopic] = useState('');
    const [explanation, setExplanation] = useState('');
    const [showTakeQuiz, setShowTakeQuiz] = useState(false);

    const [mcqs, setMcqs] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [suggestedTopics, setSuggestedTopics] = useState([]);
    const [score, setScore] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setChecked(false);
        setScore(null);
        setExplanation('');
        setShowTakeQuiz(false);
        setCurrentTopic(topic);

        try {
            const res = await axios.post('http://localhost:8000/learn-topic', {
                query: topic
            });

            if (res.data?.explanation) {
                setExplanation(res.data.explanation);
                setShowTakeQuiz(true);
            } else {
                alert("No explanation found.");
            }
        } catch (err) {
            console.error("Learn error:", err);
            alert("Failed to fetch explanation.");
        } finally {
            setLoading(false);
        }
    };

    const handleTakeQuiz = async () => {
        setLoading(true);
        setChecked(false);
        setScore(null);

        try {
            const res = await axios.post(
                'http://localhost:5000/api/user/generate-questions',
                {
                    query: currentTopic,
                    level,
                    difficulty
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            const questions = res.data.questions || [];
            const suggestions = res.data.suggestedTopics || [];

            if (questions.length > 0) {
                setMcqs(questions);
                setSuggestedTopics(suggestions);
                setSelectedAnswers({});
                setShowModal(true);
            } else {
                alert("No questions found.");
            }
        } catch (err) {
            console.error("Quiz error:", err);
            alert("Failed to fetch questions.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qIdx, optionLetter) => {
        if (!checked) {
            setSelectedAnswers(prev => ({
                ...prev,
                [qIdx]: optionLetter
            }));
        }
    };

    const handleCheckAnswers = async () => {
        if (checked) return;

        if (Object.keys(selectedAnswers).length === 0) {
            alert("Please attempt at least one question.");
            return;
        }

        setChecked(true);

        const payload = {
            topic: currentTopic,
            answers: mcqs.map((mcq, idx) => {
                const selectedLetter = selectedAnswers[idx] || null;
                const correctLetter = mcq.answer;

                const selectedOption = selectedLetter
                    ? mcq.options.find(opt => opt.startsWith(selectedLetter)) || null
                    : null;

                const correctOption = mcq.options.find(opt => opt.startsWith(correctLetter)) || null;

                return {
                    question: mcq.question,
                    selectedLetter,
                    selectedOption,
                    correctLetter,
                    correctOption,
                    isCorrect: selectedLetter === correctLetter
                };
            }),
        };

        try {
            const res = await axios.post(
                'http://localhost:5000/api/user/store-answers',
                payload,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (res.status === 201) {
                const result = res.data;
                addPoints(result.creditPoints);

                setScore({
                    points: result.creditPoints,
                    skill: result.skillLevel,
                    correct: result.correctAnswers,
                    total: result.totalQuestions
                });
            }
        } catch (error) {
            console.error("Error storing answers:", error);
            alert("Failed to store answers.");
        }
    };

    const quickSearch = (text) => {
        setTopic(text);
        setLevel('Beginner');
        setDifficulty('Easy');
        handleSearch({ preventDefault: () => { } });
    };

    return (
        <div className='tab p-6'>
            <h2 className='text-2xl font-bold mb-4 text-primaryColor'>Let's Learn</h2>

            <form onSubmit={handleSearch} className='flex flex-col gap-4 mb-6 sm:flex-row sm:items-center'>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., JavaScript, AI)"
                    className="px-4 py-2 rounded w-full text-black"
                    disabled={loading}
                />
                <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-4 py-2 rounded text-black">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="px-4 py-2 rounded text-black">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>
                <button type="submit" disabled={loading} className={`py-2 px-4 rounded font-bold text-white ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {explanation && (
                <div className='bg-gray-100 p-4 rounded mb-4'>
                    <h3 className='text-lg font-semibold text-primaryColor mb-2'>Explanation</h3>
                    <p className='text-gray-800 whitespace-pre-wrap'>{explanation}</p>

                    {showTakeQuiz && (
                        <button
                            onClick={handleTakeQuiz}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Take Quiz
                        </button>
                    )}
                </div>
            )}

            {topicsToLearn.length > 0 && (
                <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-primaryColor mb-2'>Recommended Topics</h3>
                    <div className='flex flex-wrap gap-2'>
                        {topicsToLearn.map((t, i) => (
                            <button key={i} onClick={() => quickSearch(t)} className='bg-emerald-600 text-white px-3 py-1 rounded-full text-sm hover:bg-emerald-700'>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {suggestedTopics.length > 0 && (
                <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-primaryColor mb-2'>Suggested Topics</h3>
                    <div className='flex flex-wrap gap-2'>
                        {suggestedTopics.map((s, i) => (
                            <button key={i} onClick={() => quickSearch(s)} className='bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600'>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 w-[90%] max-w-xl max-h-[80vh] overflow-y-auto'>
                        <h3 className='text-xl font-bold mb-4 text-center'>MCQs for "{currentTopic}"</h3>

                        {mcqs.map((mcq, idx) => (
                            <div key={idx} className='mb-4'>
                                <p className='font-semibold text-gray-800'>{idx + 1}. {mcq.question}</p>
                                <ul className='pl-4'>
                                    {mcq.options.map((opt, i) => {
                                        const letter = opt[0];
                                        const isSelected = selectedAnswers[idx] === letter;
                                        const isCorrect = mcq.answer === letter;

                                        let bg = '';
                                        if (checked) {
                                            if (isSelected && isCorrect) bg = 'bg-green-200 text-green-800';
                                            else if (isSelected) bg = 'bg-red-200 text-red-800';
                                            else if (isCorrect) bg = 'bg-green-100';
                                        } else if (isSelected) {
                                            bg = 'bg-blue-100';
                                        }

                                        return (
                                            <li
                                                key={i}
                                                className={`cursor-pointer p-2 rounded ${bg}`}
                                                onClick={() => handleOptionSelect(idx, letter)}
                                            >
                                                {opt}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}

                        {score && (
                            <div className='text-center mt-4'>
                                <p className='text-lg font-semibold text-green-600'>
                                    You got {score.correct}/{score.total} correct!
                                </p>
                                <p className='text-md text-blue-600'>Credit Points: {score.points}</p>
                                <p className='text-md text-purple-600'>Skill Level: {score.skill}</p>
                            </div>
                        )}

                        <div className='text-center mt-6 flex flex-col gap-3'>
                            {!checked && (
                                <button onClick={handleCheckAnswers} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Check Answers
                                </button>
                            )}
                            <button onClick={() => setShowModal(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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