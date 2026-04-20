import React, { useState } from 'react';
import { Bell, Coffee, GraduationCap, Clock, Menu } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';

const Header = ({
    userData,
    notifications = [],
    onNavigate,
    onToggleSidebar
}) => {
    const {
        activeTime,
        freeBreakTime,
        isFreeBreak,
        isTraining,
        toggleFreeBreak,
        toggleTraining
    } = useTimer();

    const [showNotifications, setShowNotifications] = useState(false);

    const user = userData || {
        name: 'User',
        role: 'Role',
        avatar: 'https://ui-avatars.com/api/?name=User&background=4F46E5&color=fff'
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };

    const formatBreakTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-4xl flex items-center gap-6">
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Today</p>
                            <p className="text-xl font-bold text-gray-900 tabular-nums leading-none">{formatTime(activeTime)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleFreeBreak}
                            disabled={freeBreakTime <= 0 && !isFreeBreak}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium border ${isFreeBreak
                                ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Coffee className={`w-4 h-4 ${isFreeBreak ? 'animate-pulse' : ''}`} />
                            <span className="flex flex-col items-start leading-none">
                                <span className="text-sm">{isFreeBreak ? 'On Break' : 'Free Break'}</span>
                                <span className="text-[10px] opacity-70 mt-0.5 font-mono">
                                    {formatBreakTime(freeBreakTime)}
                                </span>
                            </span>
                        </button>

                        <button
                            onClick={toggleTraining}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium border ${isTraining
                                ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Training</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Bell className="w-6 h-6 text-gray-600" />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {notifications.length > 0 ? (
                                        <>
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => { setShowNotifications(false); onNavigate('notifications'); }}>
                                                    <p className="text-sm text-gray-900">{notif.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                </div>
                                            ))}
                                            <div
                                                className="p-3 text-center border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    onNavigate('notifications');
                                                }}
                                            >
                                                <span className="text-xs font-bold text-indigo-600">View All Notifications</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-4 text-sm text-gray-500 text-center">No new notifications</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group"
                        onClick={() => onNavigate('profile')}
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-tighter font-bold opacity-60 group-hover:opacity-100">{user.role}</p>
                        </div>
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full ring-2 ring-transparent group-hover:ring-indigo-500 transition-all p-0.5"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
