import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, Clock, Calendar, TrendingUp, Target,
    ChevronDown, ChevronRight, Plus, Search, Filter,
    FileText, AlertCircle, XCircle, Edit, Trash2,
    Save, X, BarChart3, Award, Zap, ArrowLeft,
    Download, Upload, RefreshCw, Eye, User, Globe,
    Settings, Briefcase
} from 'lucide-react';

const WorkSection = ({
    onBack,
    onNavigate,
    tasks = [],
    onAddTask,
    onUpdateTask,
    dailyWork = [],
    sellingPoints = [],
    users = [],
    currentUser
}) => {
    const [activeTab, setActiveTab] = useState('today');
    const [expandedTasks, setExpandedTasks] = useState({});
    const [showAddTask, setShowAddTask] = useState(false);
    const [showSuiviModal, setShowSuiviModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTaskForm, setNewTaskForm] = useState({
        title: '',
        description: '',
        type: 'Analysis',
        assignedTo: [currentUser?.id],
        city: '',
        targetCount: '',
        targetIds: ''
    });

    const [suiviForm, setSuiviForm] = useState({
        completed: '',
        difficulties: '',
        notes: '',
        status: 'In Progress'
    });

    const isAdmin = currentUser?.role === 'Administrator';

    const myTasks = isAdmin ? tasks : tasks.filter(t => t.assignedTo.includes(currentUser?.id));
    const faultyItems = sellingPoints.filter(sp => sp.status === 'Faulty');
    const myWorkStats = dailyWork.filter(w => w.userId === currentUser?.id);
    const todayStats = myWorkStats.find(w => w.date === new Date().toISOString().split('T')[0]) || { checks: [], creations: [], tasks: [] };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'green';
            case 'In Progress': return 'blue';
            case 'Pending': return 'gray';
            case 'Faulty': return 'red';
            default: return 'gray';
        }
    };

    const handleCreateTask = () => {
        if (!newTaskForm.title || newTaskForm.assignedTo.length === 0) {
            alert('Title and Assignment are required');
            return;
        }

        const taskData = {
            ...newTaskForm,
            targetCount: parseInt(newTaskForm.targetCount) || 0,
            targetIds: newTaskForm.targetIds ? newTaskForm.targetIds.split(',').map(id => id.trim()) : [],
            createdBy: currentUser.id
        };

        onAddTask(taskData);
        setShowAddTask(false);
        setNewTaskForm({
            title: '',
            description: '',
            type: 'Analysis',
            assignedTo: [currentUser?.id],
            city: '',
            targetCount: '',
            targetIds: ''
        });
    };

    const handleUpdateProgress = () => {
        onUpdateTask({
            ...selectedTask,
            currentCount: parseInt(suiviForm.completed),
            status: suiviForm.status,
            lastUpdate: {
                time: new Date().toISOString(),
                notes: suiviForm.notes,
                difficulties: suiviForm.difficulties
            }
        });
        setShowSuiviModal(false);
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
                                <h1 className="text-2xl font-bold text-gray-900">Work Center</h1>
                                <p className="text-sm text-gray-600">Tasks, Assignments & Quality Control</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onNavigate('pre-integration-work')}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md font-bold text-sm"
                            >
                                <FileText className="w-4 h-4" /> Pre-Integration
                            </button>

                            <button
                                onClick={() => onNavigate('employee-work-assignments')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-bold text-sm"
                            >
                                <Briefcase className="w-4 h-4" /> My Assignments
                            </button>

                            {isAdmin && (
                                <>
                                    <button
                                        onClick={() => onNavigate('admin-work-management')}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md font-bold text-sm"
                                    >
                                        <Settings className="w-4 h-4" /> Manage Work
                                    </button>
                                    <button
                                        onClick={() => setShowAddTask(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 font-bold text-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Legacy Tasks
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('today')}
                            className={`px-6 py-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'today' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                        >
                            <Calendar className="w-4 h-4" /> Assigned Tasks
                        </button>
                        <button
                            onClick={() => setActiveTab('recheck')}
                            className={`px-6 py-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'recheck' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                        >
                            <AlertCircle className="w-4 h-4" /> Recheck ({faultyItems.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-6 py-4 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'stats' ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                        >
                            <TrendingUp className="w-4 h-4" /> My Progress
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                {activeTab === 'today' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Stats Summary Column */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Daily Stat</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                                            <span className="text-sm font-medium">Checked Today</span>
                                        </div>
                                        <span className="text-xl font-bold">{todayStats.checks?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Plus className="w-4 h-4" /></div>
                                            <span className="text-sm font-medium">New Entries</span>
                                        </div>
                                        <span className="text-xl font-bold">{todayStats.creations?.length || 0}</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="text-xs text-gray-500 mb-2">Completion Rate</div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Task Cards Column */}
                        <div className="lg:col-span-3 space-y-4">
                            {myTasks.length === 0 ? (
                                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                                    <p className="text-gray-500 font-medium">No tasks assigned yet.</p>
                                </div>
                            ) : myTasks.map(task => (
                                <div key={task.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-${getStatusColor(task.status)}-100 text-${getStatusColor(task.status)}-600`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

                                            <div className="flex flex-wrap items-center gap-4">
                                                {task.city && (
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                                                        <Globe className="w-3.5 h-3.5" /> {task.city}
                                                    </div>
                                                )}
                                                {task.targetCount > 0 && (
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                                                        <Target className="w-3.5 h-3.5" /> {task.currentCount || 0} / {task.targetCount} Target
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                                    <Clock className="w-3.5 h-3.5" /> {new Date(task.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {!isAdmin && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedTask(task);
                                                        setSuiviForm({
                                                            completed: (task.currentCount || 0).toString(),
                                                            status: task.status,
                                                            notes: '',
                                                            difficulties: ''
                                                        });
                                                        setShowSuiviModal(true);
                                                    }}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 hover:scale-105 transition-transform"
                                                >
                                                    Report Progress
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (task.city) onNavigate('selling-points', { filters: { city: task.city } });
                                                    else if (task.targetIds?.length > 0) onNavigate('global-search', { initialQuery: task.targetIds[0] });
                                                    else onNavigate('selling-points');
                                                }}
                                                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50"
                                            >
                                                Go to Work
                                            </button>
                                        </div>
                                    </div>

                                    {task.targetCount > 0 && (
                                        <div className="mt-6 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-indigo-600 h-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, ((task.currentCount || 0) / task.targetCount) * 100)}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'recheck' && (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
                            <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> These items have been flagged by administrators as incorrect or needing verification.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {faultyItems.length === 0 ? (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">All Clear!</h3>
                                    <p className="text-gray-500">No faulty items found needing recheck.</p>
                                </div>
                            ) : faultyItems.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl border border-red-100 overflow-hidden hover:shadow-xl transition-all group">
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">FAULTY DATA</span>
                                            <span className="text-xs text-gray-400 font-bold"># {item.id}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mb-4">{item.city}, {item.country}</p>

                                        <div className="bg-red-50/50 p-3 rounded-xl border border-red-50 mb-4">
                                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Issue Reported:</p>
                                            <p className="text-sm font-medium text-red-700 italic">"{item.faultNote || 'Needs general verification'}"</p>
                                        </div>

                                        <button
                                            onClick={() => onNavigate('selling-point-detail', { id: item.id })}
                                            className="w-full py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl font-black text-[11px] uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all"
                                        >
                                            RE-VERIFY NOW
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="space-y-8">
                        {/* Analytics of My Work could go here */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
                                <h3 className="text-xl font-black mb-6">Historical Performance</h3>
                                <div className="space-y-6">
                                    {dailyWork.slice(0, 5).map((w, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{new Date(w.date).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                                                <p className="text-xs text-gray-400">{w.date}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-indigo-600">{(w.checks?.length || 0)} checks</p>
                                                    <p className="text-[10px] font-bold text-gray-400">Total Items</p>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                                    <Zap className="w-6 h-6 text-indigo-600" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight">Assign Work</h3>
                                <p className="text-sm text-gray-500 font-medium">Create and delegate tasks to employers</p>
                            </div>
                            <button onClick={() => setShowAddTask(false)} className="p-2 hover:bg-gray-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Task Title</label>
                                    <input
                                        type="text"
                                        value={newTaskForm.title}
                                        onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-bold"
                                        placeholder="e.g. Lyon Dealers Verification"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Assigned To</label>
                                    <div className="space-y-2">
                                        {users.map(user => (
                                            <label key={user.id} className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-50 hover:border-indigo-100 cursor-pointer transition-all">
                                                <input
                                                    type="checkbox"
                                                    checked={newTaskForm.assignedTo.includes(user.id)}
                                                    onChange={(e) => {
                                                        const ids = e.target.checked
                                                            ? [...newTaskForm.assignedTo, user.id]
                                                            : newTaskForm.assignedTo.filter(id => id !== user.id);
                                                        setNewTaskForm({ ...newTaskForm, assignedTo: ids });
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <img src={user.avatar} className="w-6 h-6 rounded-full" />
                                                    <span className="text-sm font-bold text-gray-700">{user.name}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Target Type</label>
                                        <select
                                            value={newTaskForm.type}
                                            onChange={(e) => setNewTaskForm({ ...newTaskForm, type: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-bold"
                                        >
                                            <option>Analysis</option>
                                            <option>Creation</option>
                                            <option>Recheck</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City Focus (Optional)</label>
                                        <input
                                            type="text"
                                            value={newTaskForm.city}
                                            onChange={(e) => setNewTaskForm({ ...newTaskForm, city: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-bold"
                                            placeholder="e.g. Lyon"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Target Quantity</label>
                                        <input
                                            type="number"
                                            value={newTaskForm.targetCount}
                                            onChange={(e) => setNewTaskForm({ ...newTaskForm, targetCount: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-bold"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description / Instructions</label>
                                    <textarea
                                        value={newTaskForm.description}
                                        onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-bold"
                                        rows="3"
                                        placeholder="What needs to be done?"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50 flex gap-4">
                            <button
                                onClick={() => setShowAddTask(false)}
                                className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTask}
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuiviModal && selectedTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 leading-tight">Update My Progress</h3>
                            <p className="text-sm font-bold text-indigo-500 mt-1">{selectedTask.title}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Count</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={suiviForm.completed}
                                        onChange={(e) => setSuiviForm({ ...suiviForm, completed: e.target.value })}
                                        className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 text-xl font-black"
                                    />
                                    <span className="text-lg font-bold text-gray-400">/ {selectedTask.targetCount}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Task Status</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['In Progress', 'Completed', 'Stuck'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSuiviForm({ ...suiviForm, status: s === 'Stuck' ? 'Faulty' : s })}
                                            className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${(s === 'Stuck' && suiviForm.status === 'Faulty') || suiviForm.status === s
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'border-gray-100 text-gray-400 hover:border-indigo-100'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Difficulties Faced</label>
                                <textarea
                                    value={suiviForm.difficulties}
                                    onChange={(e) => setSuiviForm({ ...suiviForm, difficulties: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 font-bold text-sm"
                                    rows="2"
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 flex gap-4">
                            <button onClick={handleUpdateProgress} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all">
                                Update Progress
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkSection;