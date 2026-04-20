import React, { useState } from 'react';
import {
    TrendingUp, Users, Building2, MapPin,
    Award, Target, BarChart3, PieChart,
    ChevronUp, ChevronDown, Globe, Filter,
    Calendar, Clock, CheckCircle2, Zap
} from 'lucide-react';

const Analytics = ({
    sellingPoints = [],
    companies = [],
    contacts = [],
    minisites = [],
    activityLog = [],
    dailyWork = [],
    users = [],
    currentUser,
    workAssignments = [],
    preIntegrationPoints = []
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState(currentUser?.role === 'Administrator' ? 'all' : currentUser?.id);
    const [timeRange, setTimeRange] = useState('week'); // week, month, all

    const isAdmin = currentUser?.role === 'Administrator';

    // Filter data based on selected employee
    const getFilteredData = () => {
        if (selectedEmployee === 'all') {
            return {
                activityLog,
                dailyWork,
                sellingPoints,
                workAssignments,
                preIntegrationPoints
            };
        }

        const employeeId = parseInt(selectedEmployee);
        return {
            activityLog: activityLog.filter(log => log.performedBy?.id === employeeId),
            dailyWork: dailyWork.filter(w => w.userId === employeeId),
            sellingPoints: sellingPoints.filter(sp => sp.createdBy?.id === employeeId),
            workAssignments: workAssignments.filter(w => w.assignedTo === employeeId),
            preIntegrationPoints: preIntegrationPoints.filter(p => p.assignedTo === employeeId)
        };
    };

    const filteredData = getFilteredData();

    // Calculate time-based activity
    const getTimeRangeData = () => {
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0);
        }

        return filteredData.activityLog.filter(log => new Date(log.timestamp) >= startDate);
    };

    const timeRangeActivity = getTimeRangeData();

    // 1. Calculate Business Type Distribution
    const businessTypeCounts = filteredData.sellingPoints.reduce((acc, sp) => {
        const type = sp.businessType || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const totalSP = filteredData.sellingPoints.length;
    const businessTypeData = Object.entries(businessTypeCounts)
        .map(([name, count]) => ({
            name,
            count,
            percentage: totalSP > 0 ? Math.round((count / totalSP) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // 2. Weekly Activity Logic
    const getWeeklyActivity = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return { day: days[d.getDay()], dateStr: d.toDateString(), count: 0 };
        });

        filteredData.activityLog.forEach(log => {
            const logDate = new Date(log.timestamp).toDateString();
            const dayEntry = last7Days.find(d => d.dateStr === logDate);
            if (dayEntry) dayEntry.count++;
        });

        const maxCount = Math.max(...last7Days.map(d => d.count), 1);
        return last7Days.map(d => ({
            day: d.day,
            value: Math.round((d.count / maxCount) * 100),
            realValue: d.count
        }));
    };

    const performanceData = getWeeklyActivity();

    // 3. User Leaderboard
    const getLeaderboard = () => {
        const userStats = {};

        // Initialize all users
        users.forEach(user => {
            if (user.role !== 'Administrator') {
                userStats[user.id] = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    score: 0,
                    actions: 0,
                    creations: 0,
                    completedWork: 0
                };
            }
        });

        // Count activities
        activityLog.forEach(log => {
            const userId = log.performedBy?.id;
            if (userId && userStats[userId]) {
                userStats[userId].score += 10;
                userStats[userId].actions++;
            }
        });

        // Count creations
        sellingPoints.forEach(sp => {
            const userId = sp.createdBy?.id;
            if (userId && userStats[userId]) {
                userStats[userId].creations++;
                userStats[userId].score += 50;
            }
        });

        // Count completed work
        workAssignments.forEach(work => {
            if (work.status === 'Completed' && userStats[work.assignedTo]) {
                userStats[work.assignedTo].completedWork++;
                userStats[work.assignedTo].score += 100;
            }
        });

        return Object.values(userStats)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    };

    const leaderboard = getLeaderboard();

    // Employee-specific stats
    const getEmployeeStats = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayWork = filteredData.dailyWork.find(w => w.date === today) || { checks: [], creations: [], tasks: [] };

        return {
            todayChecks: todayWork.checks?.length || 0,
            todayCreations: todayWork.creations?.length || 0,
            totalActions: timeRangeActivity.length,
            pendingWork: filteredData.workAssignments.filter(w => w.status === 'Pending').length,
            inProgressWork: filteredData.workAssignments.filter(w => w.status === 'In Progress').length,
            completedWork: filteredData.workAssignments.filter(w => w.status === 'Completed').length,
            preIntegrationPending: filteredData.preIntegrationPoints.filter(p => p.status === 'Assigned').length,
            preIntegrationCompleted: filteredData.preIntegrationPoints.filter(p => p.status === 'Integrated').length
        };
    };

    const employeeStats = getEmployeeStats();

    const stats = [
        { label: 'Total Selling Points', value: filteredData.sellingPoints.length, icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-50', change: '+12%' },
        { label: 'Total Companies', value: companies.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', change: '+8%' },
        { label: 'Total Contacts', value: contacts.length, icon: Users, color: 'text-green-600', bg: 'bg-green-50', change: '+15%' },
        { label: 'Minisites Created', value: minisites.length, icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50', change: '+5%' },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Analytics & Insights</h2>
                    <p className="text-gray-600">
                        {selectedEmployee === 'all' ? 'Team performance overview' : `Performance for ${users.find(u => u.id === parseInt(selectedEmployee))?.name || 'Employee'}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <label className="text-sm font-medium text-gray-700">Employee:</label>
                            <select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="all">All Employees</option>
                                {users.filter(u => u.role !== 'Administrator').map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <label className="text-sm font-medium text-gray-700">Time Range:</label>
                        <div className="flex gap-1">
                            {['week', 'month', 'all'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${stat.bg} rounded-lg`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Employee-Specific Stats */}
            {selectedEmployee !== 'all' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle2 className="w-8 h-8 opacity-80" />
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Today</span>
                        </div>
                        <p className="text-sm font-medium opacity-90">Checks Completed</p>
                        <p className="text-3xl font-bold">{employeeStats.todayChecks}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-2">
                            <Zap className="w-8 h-8 opacity-80" />
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Today</span>
                        </div>
                        <p className="text-sm font-medium opacity-90">New Creations</p>
                        <p className="text-3xl font-bold">{employeeStats.todayCreations}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-8 h-8 opacity-80" />
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">{timeRange}</span>
                        </div>
                        <p className="text-sm font-medium opacity-90">Work Completed</p>
                        <p className="text-3xl font-bold">{employeeStats.completedWork}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-8 h-8 opacity-80" />
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Pending</span>
                        </div>
                        <p className="text-sm font-medium opacity-90">Pending Work</p>
                        <p className="text-3xl font-bold">{employeeStats.pendingWork}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-600" /> Weekly Activity
                        </h3>
                        <span className="text-sm text-gray-500">{timeRangeActivity.length} total actions</span>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {performanceData.map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-700 hover:to-indigo-500 relative group cursor-pointer"
                                    style={{ height: `${Math.max(data.value, 5)}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {data.realValue} actions
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-500">{data.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <Award className="w-5 h-5 text-yellow-500" /> Leaderboard
                        </h3>
                        <div className="space-y-4">
                            {leaderboard.map((user, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 text-sm font-bold ${idx === 0 ? 'text-yellow-500' :
                                                idx === 1 ? 'text-gray-400' :
                                                    idx === 2 ? 'text-orange-400' :
                                                        'text-gray-300'
                                            }`}>
                                            #{idx + 1}
                                        </span>
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-gray-100" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.score.toLocaleString()} pts</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">{user.creations} created</p>
                                        <p className="text-xs text-gray-400">{user.completedWork} completed</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* More Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-indigo-600" /> Business Distribution
                    </h3>
                    <div className="space-y-4">
                        {businessTypeData.map((type, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-indigo-500' :
                                                idx === 1 ? 'bg-green-500' :
                                                    idx === 2 ? 'bg-amber-500' :
                                                        idx === 3 ? 'bg-blue-500' :
                                                            'bg-purple-500'
                                            }`}></div> {type.name}
                                    </span>
                                    <span className="text-sm font-bold">{type.percentage}% ({type.count})</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full transition-all ${idx === 0 ? 'bg-indigo-500' :
                                                idx === 1 ? 'bg-green-500' :
                                                    idx === 2 ? 'bg-amber-500' :
                                                        idx === 3 ? 'bg-blue-500' :
                                                            'bg-purple-500'
                                            }`}
                                        style={{ width: `${type.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {businessTypeData.length === 0 && <p className="text-sm text-gray-400 italic">No business data yet.</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-indigo-600" /> Goal Completion
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Minisite Coverage</span>
                                <span className="font-bold">{totalSP > 0 ? Math.round((minisites.length / totalSP) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${totalSP > 0 ? Math.round((minisites.length / totalSP) * 100) : 0}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Contact Coverage</span>
                                <span className="font-bold">{totalSP > 0 ? Math.round((contacts.filter(c => c.linkedEntities?.length > 0).length / totalSP) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${totalSP > 0 ? Math.round((contacts.filter(c => c.linkedEntities?.length > 0).length / totalSP) * 100) : 0}%` }}></div>
                            </div>
                        </div>
                        {selectedEmployee !== 'all' && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Work Completion Rate</span>
                                        <span className="font-bold">
                                            {filteredData.workAssignments.length > 0
                                                ? Math.round((employeeStats.completedWork / filteredData.workAssignments.length) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all"
                                            style={{
                                                width: `${filteredData.workAssignments.length > 0
                                                    ? Math.round((employeeStats.completedWork / filteredData.workAssignments.length) * 100)
                                                    : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Pre-Integration Progress</span>
                                        <span className="font-bold">
                                            {filteredData.preIntegrationPoints.length > 0
                                                ? Math.round((employeeStats.preIntegrationCompleted / filteredData.preIntegrationPoints.length) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-purple-500 h-2 rounded-full transition-all"
                                            style={{
                                                width: `${filteredData.preIntegrationPoints.length > 0
                                                    ? Math.round((employeeStats.preIntegrationCompleted / filteredData.preIntegrationPoints.length) * 100)
                                                    : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
