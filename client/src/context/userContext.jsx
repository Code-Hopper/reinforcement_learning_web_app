import React, { createContext, useContext, useEffect, useState } from 'react';

const userContext = createContext();

const UserProvider = ({ children }) => {
    const [points, setPoints] = useState(0);

    const [user, setUser] = useState()

    // Load points from localStorage on first load
    useEffect(() => {
        const storedPoints = localStorage.getItem("userPoints");
        if (storedPoints) {
            setPoints(parseInt(storedPoints, 10));
        }
    }, []);

    // Store updated points in localStorage
    const addPoints = (amount) => {
        setPoints(prev => {
            const updated = prev + amount;
            localStorage.setItem("userPoints", updated);
            return updated;
        });
    };

    const resetPoints = () => {
        setPoints(0);
        localStorage.setItem("userPoints", 0);
    };

    return (
        <userContext.Provider value={{
            points,
            addPoints,
            resetPoints,
            user,
            setUser
        }}>
            {children}
        </userContext.Provider>
    );
};

const useUser = () => useContext(userContext);

export { UserProvider, useUser };