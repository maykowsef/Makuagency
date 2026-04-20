import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Search, Check, X, History, Activity } from 'lucide-react';

const UserManagement = ({ users, onAddUser, onUpdateUser, onDeleteUser, activityLog }) => {

    // View State
    const [viewMode, setViewMode] = useState('list'); // 'list', 'edit', 'history'
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // History View State
    const [historyDate, setHistoryDate] = useState('');
    const [historyPage, setHistoryPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', role: 'Employer Data Specialist', status: 'Active', password: ''
    });

    const isEditing = viewMode === 'edit' && selectedUser;

    const filteredUsers = users?.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role.includes(roleFilter);
        return matchesSearch && matchesRole;
    }) || [];

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({ ...user, password: '' }); // Don't show password, leave blank implies no change
        setViewMode('edit');
    };

    const handleDeleteClick = (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            onDeleteUser(user.id);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Update
            onUpdateUser({
                ...selectedUser,
                ...formData,
                password: formData.password ? formData.password : selectedUser.password // Only update if new pass provided
            });
        } else {
            // Create
            if (!formData.password) alert('Password is required for new users');
            else onAddUser({ ...formData, avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=random` });
        }
        setViewMode('list');
        setSelectedUser(null);
        setFormData({ name: '', email: '', role: 'Employer Data Specialist', status: 'Active', password: '' });
    };

    const handleHistoryClick = (user) => {
        setSelectedUser(user);
        setViewMode('history');
        // Reset filters when opening history
        setHistoryDate('');
        setHistoryPage(1);
    };

    // Filter Activity Log for specific user with date & pagination
    const getUserHistory = () => {
        if (!selectedUser || !activityLog) return [];
        let logs = activityLog.filter(log => log.performedBy?.id === selectedUser.id || log.description.includes(selectedUser.name));

        if (historyDate) {
            logs = logs.filter(log => log.timestamp.substring(0, 10) === historyDate);
        }
        return logs;
    };

    const filteredHistory = getUserHistory();
    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = filteredHistory.slice((historyPage - 1) * ITEMS_PER_PAGE, historyPage * ITEMS_PER_PAGE);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" /> User Management
                    </h1>
                    <p className="text-gray-500 mt-1">Manage system access, roles, and view activity history</p>
                </div>
                {viewMode === 'list' && (
                    <button
                        onClick={() => { setViewMode('edit'); setSelectedUser(null); setFormData({ name: '', email: '', role: 'Employer Data Specialist', status: 'Active', password: '' }); }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Plus className="w-5 h-5" /> Add New User
                    </button>
                )}
                {viewMode !== 'list' && (
                    <button
                        onClick={() => setViewMode('list')}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        Back to List
                    </button>
                )}
            </div>

            {viewMode === 'list' && (
                <>
                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name, email or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="All">All Roles</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Sales Manager">Sales Manager</option>
                            <option value="Specialist">Data Specialist</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Login</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden">
                                                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.role === 'Administrator' && <Shield className="w-4 h-4 text-indigo-600" />}
                                                <span className={`text-sm font-medium ${user.role === 'Administrator' ? 'text-indigo-600' : 'text-gray-700'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {typeof user.lastLogin === 'string' && user.lastLogin.includes('T')
                                                ? new Date(user.lastLogin).toLocaleString()
                                                : user.lastLogin}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleHistoryClick(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View History">
                                                    <History className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEditClick(user)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit User">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {viewMode === 'edit' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-2xl mx-auto p-8">
                    <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit User' : 'Create New User'}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Role & Privileges</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="Administrator">Administrator (Full Access)</option>
                                <option value="Sales Manager">Sales Manager (Can Edit, Cannot Delete Users)</option>
                                <option value="Employer Data Specialist">Employer Data Specialist (Can View/Edit Records)</option>
                                <option value="Viewer">Viewer (Read Only)</option>
                            </select>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-2">
                            <label className="block text-sm font-bold text-gray-800 mb-2">Password</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={isEditing ? "Leave blank to keep current password" : "Enter temporary password"}
                                required={!isEditing}
                            />
                            <p className="text-xs text-gray-500 mt-2">Passwords are stored locally for this demo. In production, use secure hashing.</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t font-medium">
                            <button type="button" onClick={() => setViewMode('list')} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                {isEditing ? 'Save Changes' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {viewMode === 'history' && selectedUser && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-100 overflow-hidden shadow-sm">
                                <img src={selectedUser.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}'s Activity History</h2>
                                <p className="text-sm text-gray-500">{selectedUser.role} • {selectedUser.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="date"
                                value={historyDate}
                                onChange={(e) => { setHistoryDate(e.target.value); setHistoryPage(1); }}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            {historyDate && (
                                <button
                                    onClick={() => { setHistoryDate(''); setHistoryPage(1); }}
                                    className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg text-xs font-bold"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-0">
                        {paginatedHistory.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>{historyDate ? 'No activity found on this date.' : 'No recorded activity for this user.'}</p>
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-gray-100">
                                    {paginatedHistory.map(log => (
                                        <div key={log.id} className="p-4 hover:bg-gray-50 flex gap-4 transition-colors">
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400 ring-4 ring-indigo-50"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-bold text-gray-900">{log.type}</p>
                                                    <span className="text-xs font-mono text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-0.5">{log.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                                        <span className="text-xs text-gray-500 font-medium">Page {historyPage} of {totalPages}</span>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={historyPage === 1}
                                                onClick={() => setHistoryPage(prev => prev - 1)}
                                                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-50"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                disabled={historyPage === totalPages}
                                                onClick={() => setHistoryPage(prev => prev + 1)}
                                                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold disabled:opacity-50 hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
