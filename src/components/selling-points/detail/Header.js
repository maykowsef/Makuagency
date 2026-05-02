import React from 'react';
import { ArrowLeft, Trash2, Check, AlertTriangle } from 'lucide-react';

const Header = ({ sp, onBack, onDelete, onCheck, onFlagFaulty, onShowDeduplicate, setEditSection, setEditingItem, setShowEditModal, getPriorityColor, viewParams, userData }) => {
    const isAdmin = userData?.role === 'Administrator';

    // COMPREHENSIVE NULL CHECKS
    if (!sp || typeof sp !== 'object') {
        return (
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={onBack} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Unknown Selling Point</h1>
                                <span className="text-sm font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">ID: #N/A</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                            {viewParams?.returnTo && <span className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">Back Previous</span>}
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{sp.name || 'Unknown Selling Point'}</h1>
                                <span className="text-sm font-mono bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">ID: #{sp.id || 'N/A'}</span>
                                {sp.status === 'Faulty' && (
                                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                                        <AlertTriangle className="w-3 h-3" /> Faulty Data
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">{sp.companyName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <button
                                onClick={() => {
                                    setEditSection('single_field');
                                    setEditingItem({ field: 'priority', value: sp.priority, label: 'Priority' });
                                    setShowEditModal(true);
                                }}
                                className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(sp.priority)} hover:opacity-80 transition-opacity cursor-pointer`}
                                title="Change Priority"
                            >
                                {sp.priority} Priority
                            </button>
                            {sp.history?.find(h => h.field === 'Priority') && (
                                <span className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">
                                    Last modified by {sp.history.find(h => h.field === 'Priority').performedBy?.name}
                                </span>
                            )}
                        </div>
                        {sp.duplicateCheck?.hasPotentialDuplicates && (
                            <button onClick={onShowDeduplicate} className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full hover:bg-orange-200 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />{sp.duplicateCheck.duplicateChance}% Duplicate
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                onClick={() => {
                                    const reason = window.prompt("Reason for marking as incorrect/faulty:");
                                    if (reason) onFlagFaulty(sp.id, reason);
                                }}
                                className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2"
                            >
                                <AlertTriangle className="w-4 h-4" /><span>Incorrect</span>
                            </button>
                        )}

                        <button onClick={onCheck} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                            <Check className="w-4 h-4" /><span>Check</span>
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this Selling Point?')) onDelete(sp.id);
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /><span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
