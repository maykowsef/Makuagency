import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const loadInitialTimerState = () => {
        const saved = localStorage.getItem('dashboardTimer');
        const today = new Date().toDateString();

        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === today) {
                return {
                    activeTime: parsed.activeTime || 0,
                    freeBreakTime: parsed.freeBreakTime ?? 7200,
                    lastUpdateTimestamp: parsed.lastUpdateTimestamp || Date.now()
                };
            }
        }
        return { activeTime: 0, freeBreakTime: 7200, lastUpdateTimestamp: Date.now() };
    };

    const timerState = loadInitialTimerState();
    const [activeTime, setActiveTime] = useState(timerState.activeTime);
    const [freeBreakTime, setFreeBreakTime] = useState(timerState.freeBreakTime);
    const [isPaused, setIsPaused] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [isFreeBreak, setIsFreeBreak] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date().toDateString());

    // Use ref to track last update timestamp
    const lastUpdateTimestamp = useRef(timerState.lastUpdateTimestamp);

    // Timer Effect with Page Visibility API support
    useEffect(() => {
        let animationFrameId;
        let lastTime = Date.now();

        const updateTimer = () => {
            const now = Date.now();
            const today = new Date().toDateString();

            // Calculate elapsed time since last update
            const deltaSeconds = Math.floor((now - lastUpdateTimestamp.current) / 1000);

            // 1. Midnight Check: If day changed, reset
            if (today !== currentDate) {
                setActiveTime(0);
                setFreeBreakTime(7200);
                setCurrentDate(today);
                lastUpdateTimestamp.current = now;
                localStorage.setItem('dashboardTimer', JSON.stringify({
                    date: today,
                    activeTime: 0,
                    freeBreakTime: 7200,
                    lastUpdateTimestamp: now
                }));
                return;
            }

            // 2. Update timer if at least 1 second has passed
            if (deltaSeconds >= 1) {
                // Cap delta to prevent huge jumps (e.g., computer sleep)
                const cappedDelta = Math.min(deltaSeconds, 300); // Max 5 minutes catch-up

                if (!isPaused && !isTraining && !isFreeBreak) {
                    setActiveTime(prev => prev + cappedDelta);
                } else if (isFreeBreak) {
                    setFreeBreakTime(prev => Math.max(0, prev - cappedDelta));
                }

                lastUpdateTimestamp.current = now;
            }
        };

        // Use setInterval for consistent updates
        const interval = setInterval(updateTimer, 1000);

        // Handle page visibility changes
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Page became visible - update timer with elapsed time
                updateTimer();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPaused, isTraining, isFreeBreak, currentDate]);

    // Persist Timer
    useEffect(() => {
        const today = new Date().toDateString();
        localStorage.setItem('dashboardTimer', JSON.stringify({
            date: today,
            activeTime,
            freeBreakTime,
            lastUpdateTimestamp: lastUpdateTimestamp.current
        }));
    }, [activeTime, freeBreakTime]);

    const togglePause = () => {
        setIsPaused(prev => !prev);
        if (!isPaused) setIsFreeBreak(false);
    };

    const toggleFreeBreak = () => {
        if (isFreeBreak) {
            setIsFreeBreak(false);
        } else {
            if (freeBreakTime > 0) {
                setIsFreeBreak(true);
                setIsPaused(false);
            }
        }
    };

    const toggleTraining = () => {
        setIsTraining(prev => !prev);
    };

    const pauseTimer = () => setIsPaused(true);
    const resumeTimer = () => setIsPaused(false);

    const resetTimer = () => {
        setActiveTime(0);
        setFreeBreakTime(7200);
        setIsPaused(false);
        setIsFreeBreak(false);
        const today = new Date().toDateString();
        setCurrentDate(today);
        localStorage.setItem('dashboardTimer', JSON.stringify({ date: today, activeTime: 0, freeBreakTime: 7200 }));
    };

    const value = {
        activeTime,
        freeBreakTime,
        isPaused,
        isTraining,
        isFreeBreak,
        togglePause,
        toggleFreeBreak,
        toggleTraining,
        setActiveTime,
        setFreeBreakTime,
        setActiveTime,
        setFreeBreakTime,
        resetTimer,
        pauseTimer,
        resumeTimer
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};
