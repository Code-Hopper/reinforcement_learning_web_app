import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { validateUser } from '../../../Auth/validateUserDashboard.js';
import { useUser } from '../../../context/userContext.jsx';
import "./dashboard.scss";

import Navbar from './sections/Navbar.jsx';
import Content from './sections/Content.jsx';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, getUserData } = useUser();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('account');

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/');
        try {
            const result = await validateUser(token);

            console.log(result)

            if (!result.success) throw ("access rejected !")
                
            getUserData(result.user)
        } catch (err) {
            console.error("Validation error:", err);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, [navigate]);

    if (loading) {
        return (
            <div className='w-screen h-screen flex justify-center items-center bg-black text-white'>
                <h1 className='text-3xl font-bold'>Loading...</h1>
            </div>
        );
    }

    return (
        <div className='dashboard-container'>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Content activeTab={activeTab} />
        </div>
    );
};

export default Dashboard;
