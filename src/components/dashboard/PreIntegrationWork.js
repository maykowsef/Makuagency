import React, { useState } from 'react';
import {
    CheckCircle2, XCircle, Globe, AlertCircle, FileText,
    MapPin, Phone, Mail, Calendar, User, ArrowLeft,
    Upload, Download, Filter, Search, Eye, Flag
} from 'lucide-react';

const PreIntegrationWork = ({
    preIntegrationPoints = [],
    onUpdatePreIntegration,
    onIntegrateAsSellingPoint,
    currentUser,
    onBack
}) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [decision, setDecision] = useState('');
    const [notes, setNotes] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Filter items assigned to current user
    const myItems = preIntegrationPoints.filter(item =>
        item.assignedTo === currentUser?.id
    );

    const filteredItems = filterStatus === 'all'
        ? myItems
        : myItems.filter(item => item.status.toLowerCase() === filterStatus);

    const handleDecision = (item, decisionType) => {
        setSelectedItem(item);
        setDecision(decisionType);
        setNotes(item.employeeNotes || '');
    };

    const handleSubmitDecision = () => {
        if (!selectedItem) return;

        const updatedItem = {
            ...selectedItem,
            employeeDecision: decision,
            employeeNotes: notes,
            status: decision === 'integrate' ? 'Reviewed' : 'Rejected',
            reviewedAt: new Date().toISOString()
        };

        if (decision === 'integrate') {
            // Create actual selling point
            onIntegrateAsSellingPoint(updatedItem);
        } else {
            // Just update the pre-integration item
            onUpdatePreIntegration(updatedItem);
        }

        setSelectedItem(null);
        setDecision('');
        setNotes('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'gray';
            case 'Assigned': return 'blue';
            case 'Reviewed': return 'green';
            case 'Integrated': return 'indigo';
            case 'Rejected': return 'red';
            default: return 'gray';
        }
    };

    const stats = {
        total: myItems.length,
        pending: myItems.filter(i => i.status === 'Assigned').length,
        reviewed: myItems.filter(i => i.status === 'Reviewed').length,
        integrated: myItems.filter(i => i.status === 'Integrated').length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Pre-Integration Review</h1>
                                <p className="text-sm text-gray-600">Review and process assigned business data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Assigned</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <FileText className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Pending Review</p>
                                <p className="text-3xl font-bold text-blue-900 mt-1">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Reviewed</p>
                                <p className="text-3xl font-bold text-green-900 mt-1">{stats.reviewed}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-indigo-600">Integrated</p>
                                <p className="text-3xl font-bold text-indigo-900 mt-1">{stats.integrated}</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <Globe className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <div className="flex gap-2">
                            {['all', 'assigned', 'reviewed', 'integrated', 'rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filterStatus === status
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                    {filteredItems.length === 0 ? (
                        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Items Found</h3>
                            <p className="text-gray-500">No pre-integration items match your current filter.</p>
                        </div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{item.businessName}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-${getStatusColor(item.status)}-100 text-${getStatusColor(item.status)}-600`}>
                                                {item.status}
                                            </span>
                                            <span className="text-xs font-mono text-gray-400">{item.id}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span>{item.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{item.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span>{item.businessType}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>Source: {item.source}</span>
                                            </div>
                                        </div>

                                        {/* Scraped Data */}
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Scraped Data</p>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">Website:</span>
                                                    <span className={item.scrapedData.website ? 'text-green-600' : 'text-red-600'}>
                                                        {item.scrapedData.website || 'Not Found'}
                                                    </span>
                                                </div>
                                                {item.scrapedData.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium">Email:</span>
                                                        <span>{item.scrapedData.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {item.employeeNotes && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Your Notes</p>
                                                <p className="text-sm text-blue-900">{item.employeeNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {item.status === 'Assigned' && (
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => handleDecision(item, 'integrate')}
                                            className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Integrate as Selling Point
                                        </button>
                                        <button
                                            onClick={() => handleDecision(item, 'has_website')}
                                            className="flex-1 py-3 bg-yellow-600 text-white rounded-xl font-bold text-sm hover:bg-yellow-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Has Website
                                        </button>
                                        <button
                                            onClick={() => handleDecision(item, 'other')}
                                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Other Reason
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Decision Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900">Confirm Decision</h3>
                            <p className="text-sm text-gray-500 mt-1">{selectedItem.businessName}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-sm font-bold text-indigo-900">
                                    {decision === 'integrate' && '✓ You are integrating this as a new Selling Point'}
                                    {decision === 'has_website' && '⚠ Flagging as "Has Website" - will not be integrated'}
                                    {decision === 'other' && '✗ Rejecting for other reasons - will not be integrated'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 font-medium"
                                    rows="4"
                                    placeholder="Add any notes about your decision..."
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={() => {
                                    setSelectedItem(null);
                                    setDecision('');
                                    setNotes('');
                                }}
                                className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitDecision}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all"
                            >
                                Confirm Decision
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreIntegrationWork;
