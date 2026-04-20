import React from 'react';
import { History, TrendingUp, Filter, Clock, CheckCircle2 } from 'lucide-react';

const HistoryList = ({
    sp,
    activeHistoryPage,
    setActiveHistoryPage,
    currentHistoryItems,
    totalHistoryPages,
    Pagination,
    formatDate
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <History className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Activity History</h3>
                        <p className="text-sm text-gray-500">{sp.history?.length || 0} events recorded</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Timeline</span>
                </div>

                <div className="space-y-4">
                    {currentHistoryItems.map((event, idx) => (
                        <div key={event.id || idx} className="relative pl-6 pb-6 last:pb-0">
                            {idx !== currentHistoryItems.length - 1 && (
                                <div className="absolute left-2.5 top-6 bottom-0 w-px bg-gray-200" />
                            )}
                            <div className="absolute left-0 top-1 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center z-10">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${event.action === 'Created' ? 'bg-green-100 text-green-700' :
                                                event.action === 'Modified' ? 'bg-blue-100 text-blue-700' :
                                                    event.action === 'Deleted' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {event.action}
                                        </span>
                                        <h4 className="text-sm font-bold text-gray-900">{event.field}</h4>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {formatDate(event.date || event.timestamp || new Date().toISOString())}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{event.details}</p>
                                {event.changes && (
                                    <div className="bg-gray-50 rounded p-2 text-xs border-l-2 border-indigo-200">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Before</p>
                                                <p className="text-red-600 line-through truncate">{String(event.changes.oldValue || 'None')}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">After</p>
                                                <p className="text-green-600 truncate">{String(event.changes.newValue || 'None')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                                    <img src={event.performedBy?.avatar || 'https://ui-avatars.com/api/?name=System&background=eee'} className="w-4 h-4 rounded-full" alt="" />
                                    <span className="text-[10px] text-gray-500">Performed by <strong>{event.performedBy?.name || 'System'}</strong></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {totalHistoryPages > 1 && (
                <Pagination
                    currentPage={activeHistoryPage}
                    totalPages={totalHistoryPages}
                    onPageChange={setActiveHistoryPage}
                />
            )}
        </div>
    );
};

export default HistoryList;
