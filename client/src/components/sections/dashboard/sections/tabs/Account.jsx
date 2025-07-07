import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../../context/userContext';

const Account = () => {
    const { user, updateUser } = useUser();

    const [formData, setFormData] = useState({
        fullName: '',
        password: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
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

    if (!user) return <div className='text-white'>Loading user data...</div>;

    // ✅ Only show "Save Changes" if any input is changed
    const hasChanges =
        formData.fullName.trim() !== user.fullName ||
        formData.password.trim() !== '';

    return (
        <div className='tab'>
            <h2 className='text-2xl font-bold mb-4 text-primaryColor'>Account Info</h2>
            <div className='acount-info'>
                <div className='bg-primaryColor p-5 rounded-lg'>
                    <table className="min-w-full text-left text-sm">
                        <tbody className='text-primaryColor'>
                            <tr>
                                <th className="py-2 pr-4 font-semibold text-white">Full Name</th>
                                <td className='text-white'>:</td>
                                <td>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="py-2 pr-4 font-semibold text-white">Email</th>
                                <td className='text-white'>:</td>
                                <td>
                                    <input
                                        type="email"
                                        value={user.email}
                                        className="border rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="py-2 pr-4 font-semibold text-white">Password</th>
                                <td className='text-white'>:</td>
                                <td>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter new password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th className="py-2 pr-4 font-semibold text-white">Created At</th>
                                <td className='text-white'>:</td>
                                <td>
                                    <input
                                        type="text"
                                        value={new Date(user.createdAt).toLocaleString()}
                                        className="border rounded px-2 py-1 w-full bg-gray-100 cursor-not-allowed"
                                        readOnly
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {hasChanges && (
                        <div className='mt-4 text-center'>
                            <button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Account;