import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import CopyButton from './CopyButton';

export default function TimeCalculator() {
    // Set default values
    const defaultBase = new Date();
    defaultBase.setMinutes(0, 0, 0); // round to the hour
    const defaultBaseStr = defaultBase.toISOString().slice(0, 16);
    const [baseTime, setBaseTime] = useState(defaultBaseStr);
    const [operation, setOperation] = useState('add');
    const [amount, setAmount] = useState('5');
    const [unit, setUnit] = useState('hours');
    const [result, setResult] = useState<null | { date: string; unix: number; iso: string }>(null);

    const calculateTime = () => {
        if (!baseTime || !amount) return;

        const base = new Date(baseTime);
        const num = Number(amount);
        let multiplier = 1;

        switch (unit) {
            case 'seconds': multiplier = 1000; break;
            case 'minutes': multiplier = 60 * 1000; break;
            case 'hours': multiplier = 60 * 60 * 1000; break;
            case 'days': multiplier = 24 * 60 * 60 * 1000; break;
        }

        const change = num * multiplier * (operation === 'add' ? 1 : -1);
        const newTime = new Date(base.getTime() + change);

        setResult({
            date: newTime.toLocaleString(),
            unix: Math.floor(newTime.getTime() / 1000),
            iso: newTime.toISOString()
        });
    };

    // Calculate result on mount and whenever inputs change
    useEffect(() => {
        calculateTime();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseTime, operation, amount, unit]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 min-h-[420px]">
            <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-purple-500" size={24} />
                <h2 className="text-xl md:text-2xl font-bold dark:text-white">Time Calculator</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Base Date & Time</label>
                        <input
                            type="datetime-local"
                            value={baseTime}
                            onChange={(e) => setBaseTime(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Operation</label>
                            <select
                                value={operation}
                                onChange={(e) => setOperation(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                            >
                                <option value="add">Add</option>
                                <option value="subtract">Subtract</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g., 5"
                                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Unit</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        >
                            <option value="seconds">Seconds</option>
                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                        </select>
                    </div>

                    <button
                        onClick={calculateTime}
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                    >
                        Calculate
                    </button>
                </div>

                {result && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Result</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Local Date</p>
                                    <p className="font-semibold dark:text-white">{result.date}</p>
                                </div>
                                <CopyButton text={result.date} label="date" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Unix Timestamp</p>
                                    <p className="font-mono font-semibold dark:text-white">{result.unix}</p>
                                </div>
                                <CopyButton text={result.unix.toString()} label="timestamp" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">ISO String</p>
                                    <p className="font-mono text-sm dark:text-white">{result.iso}</p>
                                </div>
                                <CopyButton text={result.iso} label="ISO string" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 