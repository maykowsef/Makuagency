import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const navigateTo = (view, params = {}) => {
        const newEntry = { view, params, timestamp: Date.now() };

        // Remove any forward history when navigating to a new page
        const newHistory = history.slice(0, currentIndex + 1);
        newHistory.push(newEntry);

        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);

        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set('view', view);
        if (params.id) url.searchParams.set('id', params.id);
        window.history.pushState({ view, params }, '', url);

        return newEntry;
    };

    const goBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            return history[currentIndex - 1];
        }
        return null;
    };

    const goForward = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return history[currentIndex + 1];
        }
        return null;
    };

    const canGoBack = currentIndex > 0;
    const canGoForward = currentIndex < history.length - 1;

    const getCurrentView = () => {
        return currentIndex >= 0 ? history[currentIndex] : null;
    };

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state) {
                const { view, params } = event.state;
                // Find this state in history or add it
                const existingIndex = history.findIndex(
                    h => h.view === view && JSON.stringify(h.params) === JSON.stringify(params)
                );

                if (existingIndex >= 0) {
                    setCurrentIndex(existingIndex);
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [history]);

    return (
        <NavigationContext.Provider value={{
            history,
            currentIndex,
            navigateTo,
            goBack,
            goForward,
            canGoBack,
            canGoForward,
            getCurrentView
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
};
