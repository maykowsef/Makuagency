import React, { useState } from 'react';
import {
    User, Camera, Shield, Bell,
    Globe, Lock, Mail, Phone,
    CheckCircle, Save
} from 'lucide-react';

const ProfileView = ({ userData, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        ...userData,
        language: 'English',
        timezone: 'GMT+1',
        emailNotifications: true,
        pushNotifications: false
    });

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleUpdateAvatar = () => {
        const newAvatar = prompt("Enter new Avatar URL:", formData.avatar);
        if (newAvatar) {
            setFormData(prev => ({ ...prev, avatar: newAvatar }));
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateUser(formData);
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Profile & Settings</h2>
                <p className="text-gray-600">Manage your account information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Picture & Basic Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                        <div className="relative inline-block mb-4">
                            <img
                                src={formData.avatar}
                                alt={formData.name}
                                className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-inner object-cover"
                            />
                            <button
                                onClick={handleUpdateAvatar}
                                className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors border-2 border-white"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{formData.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{formData.role}</p>
                        <div className="flex justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase tracking-wider">
                                <CheckCircle className="w-3 h-3" /> Verified Agent
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-600" /> Account Security
                        </h4>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                                Change Password
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                                Two-Factor Auth
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-400 p-3 rounded-lg cursor-not-allowed font-medium"
                                />
                                <p className="text-[10px] text-gray-400 italic">Contact admin to change your name.</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    disabled
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-400 p-3 rounded-lg cursor-not-allowed font-medium"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <h4 className="text-lg font-bold text-gray-900 mt-10 mb-6 border-b pb-4">Preferences</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Language
                                </label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option>English</option>
                                    <option>French</option>
                                    <option>Spanish</option>
                                    <option>Arabic</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Timezone</label>
                                <select
                                    value={formData.timezone}
                                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                    className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option>GMT+1 (Paris)</option>
                                    <option>GMT+0 (London)</option>
                                    <option>GMT-5 (New York)</option>
                                </select>
                            </div>
                        </div>

                        <h4 className="text-lg font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-indigo-600" /> Notifications
                        </h4>
                        <div className="space-y-4 mb-10">
                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Email Notifications</p>
                                    <p className="text-xs text-gray-500">Receive summaries and important alerts via email.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.emailNotifications}
                                    onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Push Notifications</p>
                                    <p className="text-xs text-gray-500">Receive real-time alerts in your browser.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.pushNotifications}
                                    onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
                                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Save All Changes
                            </button>
                        </div>
                        {showSuccess && (
                            <p className="text-center mt-4 text-green-600 font-bold animate-bounce flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Changes saved successfully!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
