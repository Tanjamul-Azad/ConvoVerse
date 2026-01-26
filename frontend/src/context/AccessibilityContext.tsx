
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityState {
    textSize: 'normal' | 'large' | 'xl';
    reducedMotion: boolean;
    highContrast: boolean;
    calmPalette: boolean;
    toggleTextSize: () => void;
    toggleReducedMotion: () => void;
    toggleHighContrast: () => void;
    toggleCalmPalette: () => void;
    resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityState | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [calmPalette, setCalmPalette] = useState(false);

    // Persist settings
    useEffect(() => {
        const saved = localStorage.getItem('convoverse_accessibility');
        if (saved) {
            const parsed = JSON.parse(saved);
            setTextSize(parsed.textSize || 'normal');
            setReducedMotion(parsed.reducedMotion || false);
            setHighContrast(parsed.highContrast || false);
            setCalmPalette(parsed.calmPalette || false);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('convoverse_accessibility', JSON.stringify({
            textSize, reducedMotion, highContrast, calmPalette
        }));

        // Apply global classes/styles
        document.documentElement.style.fontSize = textSize === 'normal' ? '16px' : textSize === 'large' ? '18px' : '20px';

        if (reducedMotion) {
            document.documentElement.style.scrollBehavior = 'auto';
            document.body.classList.add('motion-reduce');
        } else {
            document.documentElement.style.scrollBehavior = 'smooth';
            document.body.classList.remove('motion-reduce');
        }

        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        if (calmPalette) {
            document.body.classList.add('calm-palette');
        } else {
            document.body.classList.remove('calm-palette');
        }

    }, [textSize, reducedMotion, highContrast, calmPalette]);

    const toggleTextSize = () => {
        setTextSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xl' : 'normal');
    };

    const toggleReducedMotion = () => setReducedMotion(prev => !prev);
    const toggleHighContrast = () => setHighContrast(prev => !prev);
    const toggleCalmPalette = () => setCalmPalette(prev => !prev);

    const resetSettings = () => {
        setTextSize('normal');
        setReducedMotion(false);
        setHighContrast(false);
        setCalmPalette(false);
    };

    return (
        <AccessibilityContext.Provider value={{
            textSize, reducedMotion, highContrast, calmPalette,
            toggleTextSize, toggleReducedMotion, toggleHighContrast, toggleCalmPalette, resetSettings
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
