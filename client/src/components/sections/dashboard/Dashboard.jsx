import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { validateUser } from '../../../Auth/validateUserDashboard.js'; // adjust path

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');


            if (!token) {
                navigate('/');
                return;
            }

            console.log("dashboard has token")

            try {
                const result = await validateUser(token);

                if (result.success) {
                    setUser(result.user);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Validation failed:", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [navigate]);

    if (loading) {
        return (
            <div className='w-[100vw] h-[100vh] absolute start-0 top-0 bg-black text-white flex items-center justify-center'>
                <h1 className='text-3xl font-bold'>Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome, {user.fullName}</h1>
        </div>
    );
};

export default Dashboard;
