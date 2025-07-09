import React, { createContext, useContext, useEffect, useState } from 'react';
import { updateUserPoints } from '../api/backendApi'; // Create this API call

const userContext = createContext();

const UserProvider = ({ children }) => {
    const [points, setPoints] = useState(0);
    const [user, setUser] = useState(null);

    const addPoints = async (amount) => {
        const newPoints = points + amount;
        setPoints(newPoints);

        // Save points to DB if user exists
        if (user?._id) {
            try {
                await updateUserPoints(user._id, newPoints);
            } catch (error) {
                console.error("Error saving points to DB", error);
            }
        }
    };

    const resetPoints = () => {
        setPoints(0);
    };

    const getUserData = (data) => {
        setUser(data);
        setPoints(data.points || 0); // initialize points from DB if available
    };

    useEffect(() => {
        console.log("Current User:", user);
    }, [user]);

    return (
        <userContext.Provider value={{
            points,
            addPoints,
            resetPoints,
            user,
            getUserData
        }}>
            {children}
        </userContext.Provider>
    );
};

const useUser = () => useContext(userContext);

export { UserProvider, useUser };
