import { useState, useEffect, useMemo } from 'react';
import { Globe } from 'lucide-react';

const POPULAR_TIMEZONES = [
    { city: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
    { city: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
    { city: 'Sydney', timezone: 'Australia/Sydney', flag: '🇦🇺' },
    { city: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪' },
    { city: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
    { city: 'Delhi', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
    { city: 'Berlin', timezone: 'Europe/Berlin', flag: '🇩🇪' },
];

export default function WorldClock() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getTimeInTimezone = (timezone: string, timestamp = currentTime) => {
        return new Date(timestamp).toLocaleString('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const getTimeDifference = (timezone: string) => {
        const now = new Date();
        // Get local offset in minutes
        const localOffset = -now.getTimezoneOffset(); // in minutes
        // Get target offset in minutes
        const dtf = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' });
        // Get the offset in minutes for the target timezone
        const targetDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const targetOffset = (targetDate.getTime() - now.getTime() + localOffset * 60000) / 60000;
        // Difference in minutes
        const diffMinutes = Math.round(targetOffset);
        if (diffMinutes === 0) return 'Same time';
        const sign = diffMinutes > 0 ? '+' : '';
        const hours = Math.floor(Math.abs(diffMinutes) / 60);
        const minutes = Math.abs(diffMinutes) % 60;
        return minutes === 0
            ? `${sign}${hours}h`
            : `${sign}${hours}h ${minutes}m`;
    };

    const getTimezoneOffset = (timezone: string) => {
        const now = new Date();
        const utc1 = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
        const utc2 = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        return (utc2.getTime() - utc1.getTime()) / (1000 * 60 * 60);
    };

    // Detect user's local timezone
    const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
                <Globe className="text-green-500" size={24} />
                <h2 className="text-xl md:text-2xl font-bold dark:text-white">World Clock</h2>
            </div>

            <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Detected timezone: {userTimezone}</div>

            <div className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Compare specific timestamp (optional)
                </label>
                <input
                    type="number"
                    placeholder="Enter unix timestamp to compare across timezones"
                    onChange={(e) => setSelectedTimestamp(e.target.value ? Number(e.target.value) * 1000 : null)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {POPULAR_TIMEZONES.map((tz) => {
                    const isUser = tz.timezone === userTimezone;
                    return (
                        <div
                            key={tz.timezone}
                            className={
                                `bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 hover:shadow-md transition-shadow ` +
                                (isUser ? 'border-4 border-blue-500 ring-2 ring-blue-400 dark:border-blue-400 dark:ring-blue-300 bg-blue-50 dark:bg-blue-950 relative' : '')
                            }
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{tz.flag}</span>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{tz.city}</h3>
                                {isUser && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900">Your Time</span>
                                )}
                            </div>
                            <p className="font-mono text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-1">
                                {getTimeInTimezone(tz.timezone, selectedTimestamp ? new Date(selectedTimestamp) : currentTime)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {getTimeDifference(tz.timezone)} from your time
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 