import { useState, useEffect } from 'react';
import { Zap, Calendar, Clock } from 'lucide-react';
import CopyButton from './CopyButton';

const toUnix = (date: string) => Math.floor(new Date(date).getTime() / 1000);
const fromUnix = (timestamp: number) => new Date(timestamp * 1000);

export default function TimestampConverter() {
    const [date, setDate] = useState('');
    const [unix, setUnix] = useState<number | null>(null);
    const [unixInput, setUnixInput] = useState('');
    const [convertedDates, setConvertedDates] = useState<Date[]>([]);
    const [currentUnix, setCurrentUnix] = useState(Math.floor(Date.now() / 1000));
    const [invalidTimestamps, setInvalidTimestamps] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentUnix(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDateChange = (value: string) => {
        setDate(value);
        if (value) {
            setUnix(toUnix(value));
        } else {
            setUnix(null);
        }
    };

    const handleUnixChange = (value: string) => {
        setUnixInput(value);
        if (value) {
            const rawTimestamps = value.split(',').map(v => v.trim());
            const validTimestamps = rawTimestamps.filter(v => v && /^-?\d+$/.test(v));
            const invalids = rawTimestamps.filter(v => v && !/^-?\d+$/.test(v));
            const dates = validTimestamps.map(ts => fromUnix(Number(ts)));
            setConvertedDates(dates);
            setInvalidTimestamps(invalids);
        } else {
            setConvertedDates([]);
            setInvalidTimestamps([]);
        }
    };

    const setCurrentTime = () => {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
        setDate(localDateTime);
        setUnix(Math.floor(now.getTime() / 1000));
    };

    const setCurrentUnixTime = () => {
        setUnixInput(currentUnix.toString());
        setConvertedDates([new Date(currentUnix * 1000)]);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6 min-h-[420px]">
            <div className="flex items-center gap-2 mb-6">
                <Zap className="text-blue-500" size={24} />
                <h2 className="text-xl md:text-2xl font-bold dark:text-white">Timestamp Converter</h2>
            </div>

            {/* Current Unix Time Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Current Unix Timestamp</p>
                        <p className="text-2xl md:text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">{currentUnix}</p>
                    </div>
                    <div className="flex gap-2">
                        <CopyButton text={currentUnix.toString()} label="current timestamp" />
                        <button
                            onClick={setCurrentUnixTime}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Use Current
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Date to Unix */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Calendar size={18} />
                        Date to Unix
                    </h3>
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Select Date & Time</label>
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        />
                        <button
                            onClick={setCurrentTime}
                            className="mt-2 text-sm text-blue-500 hover:text-blue-600 underline"
                        >
                            Use current time
                        </button>
                    </div>
                    {unix && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Unix Timestamp</p>
                                    <p className="font-mono text-lg font-semibold dark:text-white">{unix}</p>
                                </div>
                                <CopyButton text={unix.toString()} label="timestamp" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Unix to Date */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Clock size={18} />
                        Unix to Date
                    </h3>
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Enter Unix Timestamp</label>
                        <input
                            type="text"
                            value={unixInput}
                            onChange={(e) => handleUnixChange(e.target.value)}
                            placeholder="e.g., 1640995200 or 1640995200,1749110342"
                            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        />
                        {invalidTimestamps.length > 0 && (
                            <div className="mt-2 text-sm text-red-500">
                                Invalid timestamp(s): {invalidTimestamps.join(', ')}
                            </div>
                        )}
                    </div>
                    {convertedDates.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-4">
                            {convertedDates.map((convertedDate, idx) => (
                                <div key={idx} className="space-y-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-2 last:pb-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Local Date</p>
                                            <p className="font-semibold dark:text-white">{convertedDate.toLocaleString()}</p>
                                        </div>
                                        <CopyButton text={convertedDate.toLocaleString()} label="local date" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">ISO String</p>
                                            <p className="font-mono text-sm dark:text-white">{convertedDate.toISOString()}</p>
                                        </div>
                                        <CopyButton text={convertedDate.toISOString()} label="ISO string" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
