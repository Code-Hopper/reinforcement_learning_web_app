import React, { createContext, useContext, useState } from 'react';

const userContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const updateUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    return (
        <userContext.Provider value={{ user, setUser, updateUser }}>
            {children}
        </userContext.Provider>
    );
};

const useUser = () => useContext(userContext);

export { UserProvider, useUser };