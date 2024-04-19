import React, { createContext, useContext, useState } from 'react';

const ActiveLinkContext = createContext({ activeLink: 'Normal', setActiveLink: () => {} });
  // Changed from initializing with an object to null

export const ActiveLinkProvider = ({ children }) => {
    const [activeLink, setActiveLink] = useState('Normal');
    return (
        <ActiveLinkContext.Provider value={{ activeLink, setActiveLink }}>
            {children}
        </ActiveLinkContext.Provider>
    );
};

export const useActiveLink = () => {
    const context = useContext(ActiveLinkContext);
    console.log(context);  // Add this to see what's inside context
    if (context === null) {  // Checks explicitly for null
        throw new Error('useActiveLink must be used within an ActiveLinkProvider');
    }
    return context;
};
