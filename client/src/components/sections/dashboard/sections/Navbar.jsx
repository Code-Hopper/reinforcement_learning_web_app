import React from 'react';
import { useUser } from '../../../../context/userContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeTab, setActiveTab }) => {
    const { user, points } = useUser();
    const navigate = useNavigate();

    const tabs = [
        { id: 'account', label: 'Account' },
        { id: 'stats', label: 'Stats' },
        { id: 'learning', label: 'Learning' },
        { id: 'tests', label: 'Previous Tests' }
    ];

    return (
        <div className='bg-primaryColor text-white h-full p-4'>
            <h2 className='mb-4'>
                Welcome, <span className='text-highlightColor font-bold'>{user?.fullName || 'User'}</span>
            </h2>

            {/* Show points and skills */}
            <div className='mb-6'>
                <p className='text-2xl'>
                    🎯 <strong>Points:</strong> {points == 0 ? "Start Learning" : points}
                </p>
                <p className='text-sm mt-2'>
                    <strong>🧠 Achieved Tag : <span></span> </strong>
                </p>
            </div>

            {/* Tab buttons */}
            <div className='flex flex-col space-y-4'>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-left px-4 py-2 rounded-md transition ${activeTab === tab.id
                            ? 'bg-white text-black font-semibold'
                            : 'hover:bg-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Logout */}
            <div className='mt-5'>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}
                    className='text-center bg-secondaryColor w-full rounded-lg p-2'
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;