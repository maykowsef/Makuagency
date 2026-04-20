import React, { useState } from 'react';
import {
    ArrowLeft, Globe, Plus, Phone, Clock, FileText, Mic, Calendar,
    Trash2, Edit3, CheckCircle, XCircle, History, Upload, Lightbulb, Copy, MessageSquare,
    Mail, Send, Check, User, Music, ExternalLink
} from 'lucide-react';

const ScheduleDetail = ({ scheduleId, schedules = [], minisites = [], customTemplates = [], onBack, onAddCall, onReschedule, onUpdate, onDelete, onNavigateToMinisite, viewParams, onNavigate }) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    const hasMinisite = schedule ? minisites.some(site => site.sellingPointId === schedule.sellingPointId) : false;

    const [showCallForm, setShowCallForm] = useState(false);
    const [showRescheduleForm, setShowRescheduleForm] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Call form state
    const [callData, setCallData] = useState({
        duration: '',
        callType: hasMinisite ? 'Minisite Pitch' : 'General Inquiry',
        notes: '',
        outcome: 'Pending',
        voiceNote: null
    });

    // Reschedule form state
    const [rescheduleData, setRescheduleData] = useState({
        newDate: '',
        reason: ''
    });

    if (!schedule) {
        return <div className="p-8 text-center text-gray-500">Schedule not found.</div>;
    }

    const handleAddCall = () => {
        const newCall = {
            id: Date.now(),
            time: new Date().toISOString(),
            ...callData
        };
        onAddCall(scheduleId, newCall);
        setCallData({ duration: '', notes: '', outcome: 'Pending', voiceNote: null });
        setShowCallForm(false);
    };

    const handleReschedule = () => {
        onReschedule(scheduleId, rescheduleData.newDate, rescheduleData.reason);
        setRescheduleData({ newDate: '', reason: '' });
        setShowRescheduleForm(false);
    };

    const handleDelete = () => {
        const deleteMinisite = window.confirm('Also delete the minisite for this selling point?');
        const deleteSP = window.confirm('Also delete the selling point itself?');
        onDelete(scheduleId, { deleteMinisite, deleteSP, sellingPointId: schedule.sellingPointId });
        onBack();
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCallData({ ...callData, voiceNote: file.name });
        }
    };

    const handleUpdateStatus = (status) => {
        onUpdate(scheduleId, { status });
    };

    const toggleComm = (field) => {
        onUpdate(scheduleId, { [field]: !schedule[field] });
    };

    const scriptText = `Hi, I'm calling from MAKU Agency. We've built a custom demo website for ${schedule.sellingPointName} to showcase your inventory. I've sent you the link ${minisites.find(m => m.sellingPointId === schedule.sellingPointId)?.domain} and a video walkthrough.`;
    const minisiteUrl = `https://${minisites.find(m => m.sellingPointId === schedule.sellingPointId)?.domain}`;

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{viewParams?.returnTo ? 'Back Previous' : 'Back to Schedules'}</span>
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Schedule
                </button>
            </div>

            {/* Selling Point Info & Minisite Status */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{schedule.sellingPointName}</h1>
                            <button
                                onClick={() => onNavigate('selling-point-detail', { id: schedule.sellingPointId })}
                                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition-all border border-indigo-100/50"
                            >
                                <ExternalLink className="w-3 h-3" /> View Full Data
                            </button>
                            <select
                                value={schedule.status}
                                onChange={(e) => handleUpdateStatus(e.target.value)}
                                className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer outline-none ${schedule.status === 'Convinced' ? 'bg-green-100 text-green-700 border-green-200' :
                                    schedule.status === 'Not Convinced' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    }`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Convinced">Convinced</option>
                                <option value="Not Convinced">Not Convinced</option>
                            </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium text-gray-900">{new Date(schedule.date).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-500 italic">By {schedule.scheduler}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="flex flex-wrap items-center justify-end gap-2 max-w-md">
                            {[
                                { id: 'emailSent', icon: Mail, label: 'Email', color: 'blue' },
                                { id: 'whatsappSent', icon: MessageSquare, label: 'WhatsApp', color: 'green' },
                                { id: 'instagramSent', icon: Globe, label: 'Instagram', color: 'pink' },
                                { id: 'facebookSent', icon: Globe, label: 'Facebook', color: 'indigo' },
                                { id: 'tiktokSent', icon: Music, label: 'TikTok', color: 'slate' }
                            ].map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => toggleComm(channel.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${schedule[channel.id]
                                        ? `bg-${channel.color}-50 border-${channel.color}-200 text-${channel.color}-700`
                                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                    title={`Toggle ${channel.label} Status`}
                                >
                                    <channel.icon className="w-3.5 h-3.5" />
                                    {channel.label}
                                </button>
                            ))}
                        </div>
                        {hasMinisite ? (
                            <button
                                onClick={() => {
                                    // Get all minisites for this SP and pick the latest one (highest ID/Date)
                                    const spSites = minisites.filter(m => String(m.sellingPointId) === String(schedule.sellingPointId));
                                    const latestMinisite = spSites.sort((a, b) => (b.id || 0) - (a.id || 0))[0];

                                    if (latestMinisite) {
                                        const template = customTemplates.find(t => String(t.id) === String(latestMinisite.templateId));
                                        window.open(`/?view=${template?.view || 'custom-template'}&id=${latestMinisite.id}`, '_blank');
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 font-bold text-sm"
                            >
                                <Globe className="w-4 h-4" />
                                View Demo Website
                            </button>
                        ) : (
                            <button
                                onClick={() => onNavigateToMinisite(schedule.sellingPointId)}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors font-bold text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Create Minisite
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Call Log Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Call Log</h2>
                            <button
                                onClick={() => setShowCallForm(!showCallForm)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Call
                            </button>
                        </div>

                        {/* Add Call Form */}
                        {showCallForm && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-3">Log New Call</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Call Type</label>
                                        <select
                                            value={callData.callType}
                                            onChange={(e) => setCallData({ ...callData, callType: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                        >
                                            <option value="Minisite Pitch">Minisite Pitch</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Follow-up">Follow-up</option>
                                            <option value="Closing">Closing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            value={callData.duration}
                                            onChange={(e) => setCallData({ ...callData, duration: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="15"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
                                        <textarea
                                            value={callData.notes}
                                            onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="What happened during the call..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Outcome</label>
                                        <select
                                            value={callData.outcome}
                                            onChange={(e) => setCallData({ ...callData, outcome: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Convinced">Convinced</option>
                                            <option value="Not Convinced">Not Convinced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Voice Note (Optional)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="voice-upload"
                                            />
                                            <label htmlFor="voice-upload" className="cursor-pointer">
                                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    {callData.voiceNote ? callData.voiceNote : 'Click to upload or drag & drop'}
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={handleAddCall}
                                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        >
                                            Save Call
                                        </button>
                                        <button
                                            onClick={() => setShowCallForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Call List */}
                        <div className="space-y-3">
                            {schedule.calls && schedule.calls.length > 0 ? (
                                schedule.calls.map((call) => (
                                    <div key={call.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-indigo-600" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {new Date(call.time).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-600">{call.duration} min</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">{call.notes}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-1 rounded-full ${call.outcome === 'Convinced' ? 'bg-green-100 text-green-700' :
                                                call.outcome === 'Not Convinced' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {call.outcome}
                                            </span>
                                            {call.voiceNote && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Mic className="w-3 h-3" />
                                                    {call.voiceNote}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic text-center py-8">No calls logged yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Pitch Helper, Reschedule & History */}
                <div className="space-y-6">
                    {/* Pitch Helper - Context Aware */}
                    {hasMinisite && (
                        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-200 shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MessageSquare className="w-16 h-16 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 relative z-10">
                                <Lightbulb className="w-4 h-4 text-indigo-600" />
                                Pitch Helper
                            </h3>
                            <div className="space-y-4 text-sm relative z-10">
                                <p className="text-indigo-800">Your goal is to ensure they've seen the preview.</p>

                                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-indigo-100 text-gray-700 italic text-xs leading-relaxed">
                                    "{scriptText}"
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(minisiteUrl);
                                            alert('URL Copied!');
                                        }}
                                        className="flex items-center justify-center gap-1.5 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all"
                                    >
                                        <Copy className="w-3.5 h-3.5" /> Copy URL
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(scriptText);
                                            alert('Script Copied!');
                                        }}
                                        className="flex items-center justify-center gap-1.5 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all"
                                    >
                                        <FileText className="w-3.5 h-3.5" /> Copy Script
                                    </button>
                                </div>

                                <div className="h-px bg-indigo-100 my-1" />

                                <div className="space-y-2">
                                    <button
                                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(scriptText)}`, '_blank')}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 shadow-md shadow-green-100 transition-all"
                                    >
                                        <MessageSquare className="w-4 h-4" /> Send on WhatsApp
                                    </button>
                                    <button
                                        onClick={() => window.open(`mailto:?subject=Minisite Preview for ${schedule.sellingPointName}&body=${encodeURIComponent(scriptText)}`, '_blank')}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                                    >
                                        <Mail className="w-4 h-4" /> Send via Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reschedule */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Reschedule</h3>
                        {!showRescheduleForm ? (
                            <button
                                onClick={() => setShowRescheduleForm(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Edit3 className="w-4 h-4" />
                                Change Date
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={rescheduleData.newDate}
                                        onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Reason</label>
                                    <textarea
                                        value={rescheduleData.reason}
                                        onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Why reschedule?"
                                    ></textarea>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleReschedule}
                                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setShowRescheduleForm(false)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full flex items-center justify-between mb-4"
                        >
                            <h3 className="font-bold text-gray-900">Reschedule History</h3>
                            <History className="w-4 h-4 text-gray-400" />
                        </button>
                        {showHistory && (
                            <div className="space-y-2">
                                {schedule.rescheduleHistory && schedule.rescheduleHistory.length > 0 ? (
                                    schedule.rescheduleHistory.map((entry, index) => (
                                        <div key={index} className="text-xs p-2 bg-gray-50 rounded border border-gray-200">
                                            <p className="font-medium text-gray-900">
                                                {new Date(entry.oldDate).toLocaleDateString()} → {new Date(schedule.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-600">{entry.reason}</p>
                                            <p className="text-gray-500 mt-1">By: {entry.changedBy}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500 italic">No reschedule history.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleDetail;
