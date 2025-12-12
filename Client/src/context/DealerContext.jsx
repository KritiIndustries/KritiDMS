import React, { createContext, useContext, useState, useEffect } from 'react';

const DealerContext = createContext();

export const DealerProvider = ({ children }) => {
    const [dealer, setDealer] = useState(null);

    // Load dealer from localStorage when app starts
    useEffect(() => {
        const storedDealer = localStorage.getItem('dealerData');
        if (storedDealer) {
            setDealer(JSON.parse(storedDealer));
        }
    }, []);

    return (
        <DealerContext.Provider value={{ dealer, setDealer }}>
            {children}
        </DealerContext.Provider>
    );
};

export const useDealer = () => useContext(DealerContext);
