import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PreviousTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPreviousTests();
    }, []);

    const fetchPreviousTests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/all-tests', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setTests(res.data.tests || []);
        } catch (error) {
            console.error('Error fetching previous tests:', error);
            alert('Failed to load previous tests.');
        } finally {
            setLoading(false);
        }
    };

    const calculateScore = (answers) => {
        const correct = answers.filter(ans => ans.isCorrect).length;
        const total = answers.length;
        return total > 0 ? Math.round((correct / total) * 100) : 0;
    };

    return (
        <div className='tab p-6 overflow-scroll w-full h-full'>
            <h2 className='text-2xl font-bold mb-4 text-primaryColor'>Previous Tests</h2>

            {loading ? (
                <p className='text-white'>Loading...</p>
            ) : tests.length === 0 ? (
                <p className='text-white'>No previous tests found.</p>
            ) : (
                <div className='space-y-6'>
                    {tests.map((test, index) => {
                        const score = calculateScore(test.answers);

                        return (
                            <div key={index} className='bg-gray-800 p-4 rounded-lg text-white shadow'>
                                <div className='flex justify-between items-center mb-2'>
                                    <h3 className='text-xl font-semibold text-blue-400'>
                                        {test.topic}
                                    </h3>
                                    <span className='bg-green-700 text-white px-3 py-1 rounded-full text-sm'>
                                        Score: {score}%
                                    </span>
                                </div>
                                <p className='text-sm text-gray-400 mb-3'>
                                    {new Date(test.createdAt).toLocaleString()}
                                </p>
                                <ul className='space-y-2'>
                                    {test.answers.map((ans, i) => (
                                        <li key={i} className='border-b border-gray-600 pb-2'>
                                            <p className='font-medium'>{i + 1}. {ans.question}</p>
                                            <p>
                                                Selected:{' '}
                                                <span className={ans.isCorrect ? "text-green-400" : "text-red-400"}>
                                                    {ans.selectedOption || "Not Attempted"}
                                                </span>
                                            </p>
                                            <p>
                                                Correct:{' '}
                                                <span className='text-green-400'>
                                                    {ans.correctOption || "N/A"}
                                                </span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PreviousTests;