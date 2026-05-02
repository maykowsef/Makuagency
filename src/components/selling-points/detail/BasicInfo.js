import React from 'react';
import { Building2, Edit, User, Mail, Globe, Hash, Clock, Phone, ExternalLink, MessageSquare, Music, Calendar } from 'lucide-react';

const BasicInfo = ({ sp, onEdit, onNavigate, companies, setEditSection, setEditingItem, setShowEditModal }) => {
    // COMPREHENSIVE NULL CHECKS
    if (!sp || typeof sp !== 'object') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />Basic Information
                    </h3>
                </div>
                <p className="text-gray-500">Selling point data not available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />Basic Information
                </h3>
                <button onClick={() => onEdit('basic')} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    <Edit className="w-4 h-4" />Edit
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">


                <div className="group relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Business Name</p>
                            <p className="text-sm font-bold text-gray-900">{sp.name}</p>
                        </div>
                        <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Business Name', field: 'name', value: sp.name }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <div className="group relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Business Type</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{sp.businessType || 'Not specified'}</p>
                        <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Business Type', field: 'businessType', value: sp.businessType }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                <div className="group relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Company</p>
                    <div className="flex items-center gap-2">
                        {sp.companyId ? (
                            <button
                                onClick={() => onNavigate('company-detail', { id: sp.companyId, returnTo: 'selling-point-detail', returnId: sp.id })}
                                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                            >
                                <Building2 className="w-4 h-4" />
                                {sp.companyName || companies.find(c => String(c.id) === String(sp.companyId))?.name || 'View Company'}
                                <span className="text-gray-400 font-mono text-xs">(#{sp.companyId})</span>
                            </button>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No associated company</p>
                        )}
                        <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Company', field: 'company', companyId: sp.companyId, companyName: sp.companyName }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>



                <div className="group relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">SIRET Number</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900 font-mono">{sp.siret || 'Not specified'}</p>
                        <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'SIRET Number', field: 'siret', value: sp.siret }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>



                <div className="group relative">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sp.status === 'Active' ? 'bg-green-100 text-green-700' : sp.status === 'Inactive' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                            {sp.status || 'Active'}
                        </span>
                        <button onClick={() => { setEditSection('single_field'); setEditingItem({ label: 'Status', field: 'status', value: sp.status || 'Active' }); setShowEditModal(true); }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {sp.currentSchedule && (
                    <div className="group relative md:col-span-2 mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-orange-100">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Scheduled In :</p>
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${sp.currentSchedule.status === 'Convinced' ? 'bg-green-100 text-green-700 border-green-200' :
                                        sp.currentSchedule.status === 'Not Convinced' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-orange-100 text-orange-700 border-orange-200'
                                        }`}>
                                        {sp.currentSchedule.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-orange-900">
                                    {new Date(sp.currentSchedule.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-[11px] text-orange-600 font-medium flex items-center gap-1">
                                        <User className="w-3 h-3" /> {sp.currentSchedule.scheduler}
                                    </p>
                                    <div className="h-3 w-px bg-orange-200" />
                                    <div className="flex items-center gap-2">
                                        <Mail className={`w-3 h-3 ${sp.currentSchedule.emailSent ? 'text-blue-500' : 'text-gray-300'}`} />
                                        <MessageSquare className={`w-3 h-3 ${sp.currentSchedule.whatsappSent ? 'text-green-500' : 'text-gray-300'}`} />
                                        <Globe className={`w-3 h-3 ${sp.currentSchedule.instagramSent ? 'text-pink-500' : 'text-gray-300'}`} />
                                        <Globe className={`w-3 h-3 ${sp.currentSchedule.facebookSent ? 'text-indigo-500' : 'text-gray-300'}`} />
                                        <Music className={`w-3 h-3 ${sp.currentSchedule.tiktokSent ? 'text-slate-900' : 'text-gray-300'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate('schedule-detail', { id: sp.currentSchedule.id })}
                            className="px-5 py-2.5 bg-white border border-orange-200 text-orange-700 rounded-xl text-xs font-bold hover:bg-orange-100 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            Manage Appointment <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Description</h4>
                    <button onClick={() => onEdit('description')} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold"><Edit className="w-3 h-3" />EDIT</button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 relative group">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{sp.description?.text || 'No description provided.'}</p>
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
