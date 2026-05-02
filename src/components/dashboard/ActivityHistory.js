import React, { useState } from 'react';
import { Clock, Search as SearchIcon, Eye, Edit, Trash2, Plus, LogIn, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const ActivityHistory = ({ activityLog = [], onReplay }) => {
    const [filterType, setFilterType] = useState('All');
    const [filterDate, setFilterDate] = useState('All Time');
    const [customDate, setCustomDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const activityTypes = ['All', 'Navigation', 'Search', 'Create', 'Edit', 'Delete', 'Session'];
    const dateFilters = ['All Time', 'Today', 'Yesterday', 'Last 7 Days'];

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filterType, filterDate, customDate]);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'Navigation': return <Eye className="w-4 h-4" />;
            case 'Search': return <SearchIcon className="w-4 h-4" />;
            case 'Create': return <Plus className="w-4 h-4" />;
            case 'Edit': return <Edit className="w-4 h-4" />;
            case 'Delete': return <Trash2 className="w-4 h-4" />;
            case 'Session': return <LogIn className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'Navigation': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Search': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Create': return 'bg-green-100 text-green-700 border-green-200';
            case 'Edit': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Delete': return 'bg-red-100 text-red-700 border-red-200';
            case 'Session': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filterByDate = (activity) => {
        // Add date validation to prevent Invalid time value errors
        if (!activity.timestamp) return false;
        
        let activityDate;
        try {
            activityDate = new Date(activity.timestamp);
            // Check if date is valid
            if (isNaN(activityDate.getTime())) {
                console.warn('Invalid date detected:', activity.timestamp);
                return false;
            }
        } catch (error) {
            console.warn('Date parsing error:', error, activity.timestamp);
            return false;
        }
        
        const activityDateStr = activity.timestamp.split('T')[0];

        // Custom Date Picker Priority
        if (customDate) {
            return activityDateStr === customDate;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        switch (filterDate) {
            case 'Today':
                return activityDate >= today;
            case 'Yesterday':
                return activityDate >= yesterday && activityDate < today;
            case 'Last 7 Days':
                return activityDate >= lastWeek;
            default:
                return true;
        }
    };

    const filteredActivities = activityLog
        .filter(activity => filterType === 'All' || activity.type === filterType)
        .filter(filterByDate)
        .sort((a, b) => {
            // Add date validation to sorting to prevent Invalid time value errors
            try {
                const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
                const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
                
                // Check if dates are valid
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                    console.warn('Invalid date in sorting:', { a: a.timestamp, b: b.timestamp });
                    return 0;
                }
                
                return dateB - dateA;
            } catch (error) {
                console.warn('Date sorting error:', error);
                return 0;
            }
        });

    // Pagination Logic
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const paginatedActivities = filteredActivities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatTimestamp = (timestamp) => {
        // Add date validation to prevent Invalid time value errors
        if (!timestamp) return 'Invalid Date';
        
        let date;
        try {
            date = new Date(timestamp);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                console.warn('Invalid date in formatTimestamp:', timestamp);
                return 'Invalid Date';
            }
        } catch (error) {
            console.warn('Date formatting error:', error, timestamp);
            return 'Invalid Date';
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const groupByDate = (activities) => {
        const groups = {};
        activities.forEach(activity => {
            // Add date validation to prevent Invalid time value errors
            let dateStr;
            try {
                if (!activity.timestamp) {
                    dateStr = 'Invalid Date';
                } else {
                    const date = new Date(activity.timestamp);
                    if (isNaN(date.getTime())) {
                        console.warn('Invalid date in groupByDate:', activity.timestamp);
                        dateStr = 'Invalid Date';
                    } else {
                        dateStr = date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    }
                }
            } catch (error) {
                console.warn('Date grouping error:', error, activity.timestamp);
                dateStr = 'Invalid Date';
            }
            if (!groups[date]) groups[date] = [];
            groups[date].push(activity);
        });
        return groups;
    };

    const groupedActivities = groupByDate(paginatedActivities);

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity History</h2>
                <p className="text-gray-500">Track and replay all your CRM actions</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Type Filter */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activityTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterType === type
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Filter by Date:</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {dateFilters.map(date => (
                                <button
                                    key={date}
                                    onClick={() => {
                                        setFilterDate(date);
                                        setCustomDate('');
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterDate === date && !customDate
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {date}
                                </button>
                            ))}
                            <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>
                            <input
                                type="date"
                                value={customDate}
                                onChange={(e) => {
                                    setCustomDate(e.target.value);
                                    setFilterDate(''); // Clear preset filter logic visually
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500 ${customDate ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 text-gray-600'
                                    }`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            {Object.keys(groupedActivities).length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(groupedActivities).map(([date, activities]) => (
                        <div key={date} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 sticky top-0">
                                <h3 className="font-bold text-gray-900">{date}</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {activities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            onClick={() => activity.metadata?.replayable && onReplay(activity)}
                                            className={`p-4 border rounded-lg transition-all ${activity.metadata?.replayable
                                                ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50'
                                                : 'cursor-default'
                                                } border-gray-200`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2 rounded-lg border ${getActivityColor(activity.type)}`}>
                                                    {getActivityIcon(activity.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <p className="font-medium text-gray-900">{activity.description}</p>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{formatTimestamp(activity.timestamp)}</span>
                                                    </div>
                                                    {activity.metadata?.details && (
                                                        <p className="text-sm text-gray-600">{activity.metadata.details}</p>
                                                    )}
                                                    {activity.metadata?.replayable && (
                                                        <p className="text-xs text-indigo-600 mt-2 font-medium">Click to replay this action</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-6 pb-10">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <span className="text-sm font-medium text-gray-600">
                                Page <span className="text-indigo-600 font-bold">{currentPage}</span> of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                    <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No activities found</h3>
                    <p className="text-gray-500">Try adjusting your filters, selecting a different date, or start using the CRM.</p>
                </div>
            )}
        </div>
    );
};

export default ActivityHistory;
