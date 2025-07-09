import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../../context/userContext';

const Account = () => {
    const { user, updateUser } = useUser();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                password: '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = () => {
        const updatedData = { fullName: formData.fullName };
        if (formData.password) updatedData.password = formData.password;
        updateUser(updatedData);
        alert("Profile updated!");
    };

    if (!user) return <div>Loading user data...</div>;

    const hasChanges =
        formData.fullName.trim() !== user.fullName ||
        formData.password.trim() !== '';

    return (
        <div className='tab'>
            <h2 className='text-2xl font-bold mb-4 text-primaryColor'>Account Info</h2>
            <div className='account-info'>
                <div className='p-5 rounded-lg'>
                    <div className='user-data-display mb-6'>
                        <div className='field flex items-center mb-2'>
                            <div className='title w-24 font-semibold'>Name</div>
                            <div className='mx-2'>:</div>
                            <div><span>{user.fullName}</span></div>
                        </div>
                        <div className='field flex items-center'>
                            <div className='title w-24 font-semibold'>Email</div>
                            <div className='mx-2'>:</div>
                            <div><span>{user.email}</span></div>
                        </div>
                    </div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleSave();
                        }}
                        className='flex flex-col gap-4'
                    >
                        <div>
                            <label className='block mb-1 font-medium'>Full Name</label>
                            <input
                                type='text'
                                name='fullName'
                                value={formData.fullName}
                                onChange={handleChange}
                                className='p-3 input input-bordered w-full'
                                autoComplete='off'
                            />
                        </div>
                        <div>
                            <label className='block mb-1 font-medium'>Email</label>
                            <input
                                type='email'
                                name='email'
                                value={formData.email}
                                disabled
                                className='p-3 input input-bordered w-full bg-gray-100 cursor-not-allowed'
                            />
                        </div>
                        <div>
                            <label className='block mb-1 font-medium'>New Password</label>
                            <input
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                className='p-3 input input-bordered w-full'
                                autoComplete='new-password'
                                placeholder='Leave blank to keep current password'
                            />
                        </div>
                        {hasChanges && (
                            <button
                                type='submit'
                                className='btn btn-primary mt-2 self-start bg-green-500 text-white font-bold p-3'
                            >
                                Save Changes
                            </button>
                        )}

                        <div>
                            <button className='bg-red-500 text-white p-3 font-bold'>Request Delete Account</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;