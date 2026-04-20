import React, { useState } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle2, Search, Filter, Trash2, CheckCircle } from 'lucide-react';

const NotificationsView = ({ notifications: initialNotifications = [] }) => {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(initialNotifications.length > 0 ? initialNotifications : [
        { id: 1, type: 'warning', message: 'Duplicate detected! Selling point ID 100 and 105', time: '5 min ago', read: false },
        { id: 2, type: 'info', message: 'Business now has website', time: '10 min ago', read: true },
        { id: 3, type: 'reminder', message: 'Contact schedule in 5 minutes', time: '15 min ago', read: false },
        { id: 4, type: 'reminder', message: 'Follow-up reminder', time: '1 hour ago', read: true },
        { id: 5, type: 'success', message: 'New AI matches available', time: '2 hours ago', read: false },
        { id: 6, type: 'info', message: 'Database backup completed successfully', time: '4 hours ago', read: true },
        { id: 7, type: 'warning', message: 'Invalid phone format in "Sunny Dental"', time: 'Yesterday', read: true },
    ]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'info': return <Info className="w-5 h-5 text-blue-500" />;
            default: return <Bell className="w-5 h-5 text-indigo-500" />;
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-gray-600">Stay updated with the latest CRM alerts</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <CheckCircle className="w-4 h-4" /> Mark all as read
                    </button>
                    <button onClick={() => setNotifications([])} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" /> Clear all
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'warning', label: 'Warnings' },
                    { id: 'info', label: 'Info' },
                    { id: 'success', label: 'Success' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setFilter(item.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${filter === item.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n) => (
                            <div key={n.id} className={`p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors group relative ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>}
                                <div className={`p-2 rounded-lg bg-white shadow-sm border border-gray-100`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                            {n.message}
                                        </p>
                                        <span className="text-xs text-gray-400 font-medium">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">System Notification</p>
                                </div>
                                <button
                                    onClick={() => deleteNotification(n.id)}
                                    className="p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                                <Bell className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No notifications found</h3>
                            <p className="text-gray-500">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsView;
