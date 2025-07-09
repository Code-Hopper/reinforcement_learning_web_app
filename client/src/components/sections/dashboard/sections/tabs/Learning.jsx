import React, { useState } from 'react';
import { useUser } from '../../../../../context/userContext';
import { queryForTopicsToLearn } from '../../../../../api/backendApi';

const Learning = () => {
    const { user } = useUser();
    const [query, setQuery] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleQuery = async () => {
        if (!query.trim()) return;

        const userMessage = { role: "user", text: query };
        setChat(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await queryForTopicsToLearn(token, { topic: query }, user._id);

            const { response, startingPoints, suggestedTopics } = res;

            const aiMessage = {
                role: "ai",
                text: response,
                points: startingPoints,
                suggestions: suggestedTopics
            };

            setChat(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("AI Tutor Error:", err);
            setChat(prev => [
                ...prev,
                { role: "ai", text: "❌ Sorry, failed to fetch guidance." }
            ]);
        } finally {
            setLoading(false);
            setQuery('');
        }
    };

    return (
        <div className='learning p-4 min-h-screen bg-gray-50'>
            <h2 className='text-2xl font-bold mb-4 text-primaryColor'>👩‍🏫 AI Tutor Chat</h2>

            <div className='bg-white rounded-lg p-4 shadow max-h-[70vh] overflow-y-auto mb-4'>
                {chat.length === 0 && (
                    <p className='text-gray-500'>Start learning by typing a topic below.</p>
                )}
                {chat.map((msg, idx) => (
                    <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            {msg.text}
                        </div>

                        {msg.points && (
                            <ul className='mt-2 ml-4 list-disc list-inside text-sm text-gray-800'>
                                {msg.points.map((p, i) => (
                                    <li key={i}>{p}</li>
                                ))}
                            </ul>
                        )}

                        {msg.suggestions && (
                            <div className='flex flex-wrap gap-2 mt-2'>
                                {msg.suggestions.map((s, i) => (
                                    <span key={i} className='bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs'>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className='take-question bg-primaryColor rounded-lg p-3 flex gap-2'>
                <input
                    className='p-3 flex-1 rounded-lg text-black'
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a topic like 'Java', 'Data Structures', etc."
                    disabled={loading}
                />
                <button
                    onClick={handleQuery}
                    disabled={loading}
                    className='bg-white text-primaryColor font-bold px-4 py-2 rounded-lg'
                >
                    {loading ? "Loading..." : "Query"}
                </button>
            </div>
        </div>
    );
};

export default Learning;