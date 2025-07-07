import React from 'react';
import { useUser } from '../../../../context/userContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeTab, setActiveTab }) => {
    const { user } = useUser();

    let navigate = useNavigate()

    const tabs = [
        { id: 'account', label: 'Account' },
        { id: 'learning', label: 'Learning' },
        { id: 'tests', label: 'Previous Tests' }
    ];

    return (
        <div className='bg-primaryColor text-white h-full p-4'>
            <h2 className='mb-8'>Welcome, <span className='text-highlightColor font-bold '>{user?.fullName || 'User'}</span></h2>
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
            <div className='mt-5'>
                <button onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/")
                }} className='text-center bg-secondaryColor w-full rounded-lg p-2'>logout</button>
            </div>
        </div>
    );
};

export default Navbar;
