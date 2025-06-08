import { useState, useEffect } from 'react';
import TimestampConverter from './components/TimestampConverter';
import WorldClock from './components/WorldClock';
import TimeCalculator from './components/TimeCalculator';
import { Moon, Sun } from 'lucide-react';
import logo from './assets/timestamplab-logo.png';

export default function EpochTimeConverter() {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage on first load
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return true; // fallback to dark by default
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-3 text-center md:text-left">
                        <img src={logo} alt="TimestampLab Logo" className="h-20 w-20 rounded" />
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                                TimestampLab
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">Advanced epoch time converter and timezone utility</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDarkMode((d) => !d)}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
                <div className="block lg:hidden space-y-6">
                    <TimestampConverter />
                    <WorldClock />
                    <TimeCalculator />
                </div>
                <div className="hidden lg:block">
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <TimestampConverter />
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                            <TimeCalculator />
                        </div>
                        <div className="lg:col-span-4">
                            <WorldClock />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-12">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>Built with React & Tailwind CSS • Perfect for developers and time zone management</p>
                </div>
            </div>
        </div>
    );
}
