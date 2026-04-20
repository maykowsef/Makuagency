import React, { useState } from 'react';
import { Calendar, Clock, User, Filter, Globe, Phone, CheckCircle, XCircle, AlertCircle, Mail, MessageSquare, Instagram, Facebook, Music } from 'lucide-react';

const ScheduleDashboard = ({ schedules = [], onNavigate, minisites = [], userData, users = [] }) => {
    const isAdmin = userData?.role === 'Administrator';

    // Filters State
    const [userFilter, setUserFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('Pending'); // Default to Pending
    const [timeFilter, setTimeFilter] = useState('All');

    const userOptions = isAdmin
        ? ['All', ...users.map(u => u.name)]
        : ['All', 'Myself'];

    const statusOptions = ['All', 'Pending', 'Convinced', 'Not Convinced'];
    const timeOptions = ['All', 'Nearest', 'Today', 'Overdue'];

    const handleReset = () => {
        setUserFilter('All');
        setStatusFilter('Pending');
        setTimeFilter('All');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Convinced': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Not Convinced': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Convinced': return <CheckCircle className="w-4 h-4" />;
            case 'Not Convinced': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const hasMinisite = (sellingPointId) => {
        return minisites.some(site => site.sellingPointId === sellingPointId);
    };

    const filteredSchedules = schedules.filter(schedule => {
        // 1. User Filter
        const isOwner = String(schedule.schedulerId) === String(userData?.id) ||
            (schedule.scheduler === userData?.name);

        let userMatch = true;
        if (userFilter === 'Myself') userMatch = isOwner;
        else if (userFilter !== 'All') userMatch = schedule.scheduler === userFilter;
        else userMatch = isAdmin || isOwner;

        if (!userMatch) return false;

        // 2. Status Filter
        if (statusFilter !== 'All' && schedule.status !== statusFilter) return false;

        // 3. Time Filter
        const now = new Date();
        const schedDate = new Date(schedule.date);

        if (timeFilter === 'Today') {
            if (schedDate.toDateString() !== now.toDateString()) return false;
        }
        if (timeFilter === 'Overdue') {
            if (!(schedDate < now && schedule.status === 'Pending')) return false;
        }

        return true;
    }).sort((a, b) => {
        // Nearest first logic
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });



    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Schedules</h2>
                    <p className="text-gray-500 mt-1">Manage calls and appointments with selling points</p>
                </div>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-100 transition-all flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" /> Reset Filters
                </button>
            </div>

            {/* Filters Bar */}
            <div className="space-y-4 mb-8">
                {/* Status Filters - Primary Row */}
                <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 px-3 border-r border-gray-100 shrink-0">
                        <CheckCircle className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</span>
                    </div>
                    <div className="flex items-center gap-2 p-1">
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105'
                                    : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* User Filters - Only for Admin */}
                    {isAdmin && (
                        <div className="flex-1 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-2 px-3 border-r border-gray-100 shrink-0">
                                <User className="w-5 h-5 text-indigo-500" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employee:</span>
                            </div>
                            <div className="flex items-center gap-2 p-1">
                                {userOptions.map(user => (
                                    <button
                                        key={user}
                                        onClick={() => setUserFilter(user)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${userFilter === user
                                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                            : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        {user}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Time Filters */}
                    <div className={`${isAdmin ? '' : 'flex-1'} bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 shrink-0`}>
                        <div className="flex items-center gap-2 px-3 border-r border-gray-100">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Timing:</span>
                        </div>
                        <div className="flex items-center gap-2 p-1">
                            {timeOptions.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setTimeFilter(time)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeFilter === time
                                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                        : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            onClick={() => onNavigate('schedule-detail', { id: schedule.id })}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/30">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">ID #{schedule.sellingPointId}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg hover:text-indigo-600 transition-colors">{schedule.sellingPointName}</h3>
                                    </div>
                                    {hasMinisite(schedule.sellingPointId) ? (
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Globe className="w-5 h-5 text-green-500" title="Has Minisite" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <Globe className="w-5 h-5 text-gray-300" title="No Minisite" />
                                        </div>
                                    )}
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                                    {getStatusIcon(schedule.status)}
                                    {schedule.status}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>{new Date(schedule.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>{new Date(schedule.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>Scheduled by: <span className="font-medium">{schedule.scheduler}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{schedule.calls?.length || 0} call(s) logged</span>
                                </div>

                                <div className="h-px bg-gray-50 my-1" />

                                <div className="flex flex-wrap items-center gap-3">
                                    <Mail className={`w-3.5 h-3.5 ${schedule.emailSent ? 'text-blue-600' : 'text-gray-200'}`} title="Email Status" />
                                    <MessageSquare className={`w-3.5 h-3.5 ${schedule.whatsappSent ? 'text-green-600' : 'text-gray-200'}`} title="WhatsApp Status" />
                                    <Instagram className={`w-3.5 h-3.5 ${schedule.instagramSent ? 'text-pink-600' : 'text-gray-200'}`} title="Instagram Status" />
                                    <Facebook className={`w-3.5 h-3.5 ${schedule.facebookSent ? 'text-indigo-600' : 'text-gray-200'}`} title="Facebook Status" />
                                    <Music className={`w-3.5 h-3.5 ${schedule.tiktokSent ? 'text-slate-900' : 'text-gray-200'}`} title="TikTok Status" />
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onNavigate('selling-point-detail', { id: schedule.sellingPointId });
                                    }}
                                    className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition-all border border-indigo-100/50"
                                >
                                    <Globe className="w-3 h-3" /> View Selling Point Data
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No schedules found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleDashboard;
