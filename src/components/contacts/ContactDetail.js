import React, { useState } from 'react';
import {
    ArrowLeft, Mail, Phone, MapPin, Linkedin, Facebook, Instagram,
    Building2, Map, Tag, Circle, User, Edit, Trash2, Brain, X, Copy, Eye, Plus
} from 'lucide-react';
import { COUNTRIES } from '../../data/constants';

const ContactDetail = ({
    onBack,
    contactId,
    contacts = [],
    onEdit,
    onDelete,
    onUpdate,
    onNavigate,
    viewParams,
    sellingPoints = [],
    companies = [],
    contactAssignments = [],
    onUpdateAssignments
}) => {

    // Find contact from props
    const contact = contacts.find(c => c.id === contactId);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showLinkSPModal, setShowLinkSPModal] = useState(false);
    const [showChangeCompanyModal, setShowChangeCompanyModal] = useState(false);
    const [editField, setEditField] = useState(null);
    const [formData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    if (!contact) {
        return <div className="p-8 text-center text-gray-500">Contact not found.</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            onDelete(contact.id);
            onBack();
        }
    };

    const handleEditField = (label, field, value) => {
        setEditField({ label, field, value });
        setFormData({ value });
        setShowEditModal(true);
    };

    const handleSaveField = (e) => {
        e.preventDefault();
        const updatedContact = { ...contact };

        if (editField.field.startsWith('address.')) {
            const addrField = editField.field.split('.')[1];
            updatedContact.address = { ...updatedContact.address, [addrField]: formData.value };
        } else {
            updatedContact[editField.field] = formData.value;
        }

        onUpdate(updatedContact);
        setShowEditModal(false);
    };

    const handleLinkSP = (spId) => {
        const newAssignment = {
            id: Date.now(),
            contactId: contact.id,
            sellingPointId: spId,
            role: 'Associated Contact',
            assignedAt: new Date().toISOString()
        };
        if (onUpdateAssignments) {
            onUpdateAssignments([...contactAssignments, newAssignment]);
        }
        setShowLinkSPModal(false);
    };

    const handleLinkCompany = (compId) => {
        // If no primary company, set as primary
        if (!contact.companyId) {
            onUpdate({ ...contact, companyId: compId });
            setShowChangeCompanyModal(false);
            return;
        }

        // Otherwise add as secondary link
        const newAssignment = {
            id: Date.now(),
            contactId: contact.id,
            companyId: compId,
            role: 'Affiliated Company',
            assignedAt: new Date().toISOString()
        };
        if (onUpdateAssignments) {
            onUpdateAssignments([...contactAssignments, newAssignment]);
        }
        setShowChangeCompanyModal(false);
    };

    const handleUnlink = (assignmentId) => {
        if (window.confirm('Are you sure you want to remove this link?')) {
            const updated = contactAssignments.filter(ca => ca.id !== assignmentId);
            onUpdateAssignments(updated);
        }
    };

    const handleRemovePrimaryCompany = () => {
        if (window.confirm('Remove primary company link?')) {
            onUpdate({ ...contact, companyId: null });
        }
    };

    const GenericModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Edit {editField?.label}</h3>
                    <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSaveField}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{editField?.label}</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.value || ''}
                            onChange={(e) => setFormData({ value: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="p-4 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{viewParams?.returnTo ? 'Back Previous' : 'Back to Contacts'}</span>
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(contact.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Full Profile
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md ring-1 ring-gray-100">
                            <User className="w-12 h-12 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
                        <p className="text-indigo-600 font-semibold mb-4">{contact.position}</p>
                        <div className="text-xs text-gray-400 font-mono mb-4 bg-gray-50 inline-block px-2 py-1 rounded">ID: #{contact.id}</div>
                        <div className="flex justify-center gap-2">
                            {contact.social?.linkedin && (
                                <a href={contact.social.linkedin} target="_blank" rel="noreferrer" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {contact.social?.facebook && (
                                <a href={contact.social.facebook} target="_blank" rel="noreferrer" className="p-2.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {contact.social?.instagram && (
                                <a href={contact.social.instagram} target="_blank" rel="noreferrer" className="p-2.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all border border-transparent hover:border-pink-100">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Information</h3>
                        <div className="space-y-5">
                            <div className="group relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email Address</label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-900 overflow-hidden">
                                        <Mail className="w-4 h-4 text-indigo-500" />
                                        <a href={`mailto:${contact.email}`} className="text-sm font-medium hover:text-indigo-600 truncate">{contact.email}</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" className="w-4 h-4 rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity" title="Last modified by Admin - 45 min ago" />
                                        <button onClick={() => handleEditField('Email', 'email', contact.email)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-50 rounded text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone Number</label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Phone className="w-4 h-4 text-indigo-500" />
                                        <span className="text-sm font-medium">{contact.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" className="w-4 h-4 rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity" title="Last modified by Admin - 2 hours ago" />
                                        <button onClick={() => handleEditField('Phone', 'phone', contact.phone)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-50 rounded text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="group relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Location Details</label>
                                <div className="space-y-3 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-center text-sm group/field">
                                        <p className="flex items-center gap-2"><span className="font-bold text-gray-400 w-20 text-[10px] uppercase">address 1:</span> <span className="font-medium text-gray-700">{contact.address?.street}</span></p>
                                        <button onClick={() => handleEditField('Address 1', 'address.street', contact.address?.street)} className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-white rounded text-indigo-600 transition-all shadow-sm">
                                            <Edit className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-sm group/field text-gray-900">
                                        <p className="flex items-center gap-2"><span className="font-bold text-gray-400 w-20 text-[10px] uppercase">address 2:</span> <span className="font-medium text-gray-700">{contact.address?.address2 || '-'}</span></p>
                                        <div className="flex items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=System&background=10B981&color=fff" className="w-4 h-4 rounded-full border border-white opacity-0 group-hover/field:opacity-100 transition-opacity" title="Last modified by System - Yesterday" />
                                            <button onClick={() => handleEditField('Address 2', 'address.address2', contact.address?.address2)} className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-white rounded text-indigo-600 transition-all shadow-sm">
                                                <Edit className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm group/field">
                                        <p className="flex items-center gap-2"><span className="font-bold text-gray-400 w-20 text-[10px] uppercase">city :</span> <span className="font-medium text-gray-700">{contact.address?.city}</span></p>
                                        <button onClick={() => handleEditField('City', 'address.city', contact.address?.city)} className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-white rounded text-indigo-600 transition-all shadow-sm">
                                            <Edit className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center group/field">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-400 w-20 text-[10px] uppercase">country :</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${COUNTRIES.find(c => c.name === contact.address?.country)?.color || 'bg-gray-100 text-gray-800'}`}>
                                                {COUNTRIES.find(c => c.name === contact.address?.country)?.flag} {contact.address?.country || '-'}
                                            </span>
                                        </div>
                                        <button onClick={() => handleEditField('Country', 'address.country', contact.address?.country)} className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-white rounded text-indigo-600 transition-all shadow-sm">
                                            <Edit className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Linked Entities & AI */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Linked Entities */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-sm">
                        <div className="flex items-center justify-between mb-4 border-b pb-2">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-600" /> Linked Entities
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowLinkSPModal(true)}
                                    className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                                >
                                    + LINK SELLING POINT
                                </button>
                                <button
                                    onClick={() => setShowChangeCompanyModal(true)}
                                    className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                                >
                                    + LINK COMPANY
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {/* Associated Company (Primary) */}
                            {contact.companyId && (() => {
                                const company = companies.find(c => String(c.id) === String(contact.companyId));
                                return company ? (
                                    <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 shadow-sm">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-900 uppercase tracking-tight">{company.name}</p>
                                                    <span className="text-[10px] font-mono bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded">ID: #{company.id}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Primary Company</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onNavigate('company-detail', { id: company.id, returnTo: 'contact-detail', returnId: contact.id })}
                                                className="text-xs font-bold text-indigo-600 hover:text-white px-3 py-2 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-600 transition-all shadow-sm"
                                            >
                                                VIEW
                                            </button>
                                            <button
                                                onClick={handleRemovePrimaryCompany}
                                                className="text-xs font-bold text-red-600 hover:text-white px-3 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-600 transition-all shadow-sm"
                                                title="Unlink Primary Company"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            {/* Additional Linked Companies */}
                            {contactAssignments
                                .filter(ca => String(ca.contactId) === String(contact.id) && ca.companyId)
                                .map(ca => {
                                    const company = companies.find(c => String(c.id) === String(ca.companyId));
                                    if (!company) return null;
                                    return (
                                        <div key={ca.id} className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 shadow-sm">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900 uppercase tracking-tight">{company.name}</p>
                                                        <span className="text-[10px] font-mono bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">ID: #{company.id}</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{ca.role || 'Affiliated Company'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onNavigate('company-detail', { id: company.id, returnTo: 'contact-detail', returnId: contact.id })}
                                                    className="text-xs font-bold text-blue-600 hover:text-white px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-600 transition-all shadow-sm"
                                                >
                                                    VIEW
                                                </button>
                                                <button
                                                    onClick={() => handleUnlink(ca.id)}
                                                    className="text-xs font-bold text-red-600 hover:text-white px-3 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-600 transition-all shadow-sm"
                                                    title="Unlink Company"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                            {/* Linked Selling Points via Assignments */}
                            {contactAssignments
                                .filter(ca => String(ca.contactId) === String(contact.id) && ca.sellingPointId)
                                .map(ca => {
                                    const sp = sellingPoints.find(p => String(p.id) === String(ca.sellingPointId));
                                    if (!sp) return null;
                                    return (
                                        <div key={ca.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900 uppercase tracking-tight">{sp.name}</p>
                                                        <span className="text-[10px] font-mono bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">ID: #{sp.id}</span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{ca.role || 'Assigned Link'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onNavigate('selling-point-detail', { id: sp.id, returnTo: 'contact-detail', returnId: contact.id })}
                                                    className="text-xs font-bold text-emerald-600 hover:text-white px-3 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-600 transition-all shadow-sm"
                                                >
                                                    VIEW
                                                </button>
                                                <button
                                                    onClick={() => handleUnlink(ca.id)}
                                                    className="text-xs font-bold text-red-600 hover:text-white px-3 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-600 transition-all shadow-sm"
                                                    title="Unlink Selling Point"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                            {/* Fallback for old data if any */}
                            {!contact.companyId && contactAssignments.filter(ca => String(ca.contactId) === String(contact.id)).length === 0 && (
                                <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">No linked entities found.</p>
                            )}
                        </div>
                    </div>

                    {/* AI Insights Card */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Brain className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight">Predictive Insights</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
                                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Likelihood of Success</p>
                                    <p className="text-sm font-medium">Based on recent company activity, this contact might be interested in the new partnership proposal.</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
                                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Communication Strategy</p>
                                    <p className="text-sm font-bold">Best time to contact: <span className="text-yellow-300">Tue, 2:30 PM</span></p>
                                    <p className="text-[10px] text-indigo-200 mt-1 italic">Prefered channel: Direct Email</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && <GenericModal />}

            {/* Link Selling Point Modal */}
            {showLinkSPModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Link Selling Point</h3>
                            <button onClick={() => setShowLinkSPModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            <input
                                type="text"
                                placeholder="Search selling points..."
                                className="w-full px-3 py-2 border rounded-lg mb-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="space-y-2">
                                {sellingPoints
                                    .filter(sp => !contactAssignments.some(ca => String(ca.sellingPointId) === String(sp.id) && String(ca.contactId) === String(contact.id)))
                                    .filter(sp => sp.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(sp => (
                                        <div key={sp.id} onClick={() => handleLinkSP(sp.id)} className="p-3 border rounded-lg hover:bg-indigo-50 cursor-pointer flex justify-between items-center group transition-all">
                                            <div>
                                                <p className="font-bold text-gray-900">{sp.name}</p>
                                                <p className="text-xs text-gray-500">{sp.address?.city} • ID: #{sp.id}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100" />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change/Link Company Modal */}
            {showChangeCompanyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Link Company</h3>
                            <button onClick={() => setShowChangeCompanyModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            <input
                                type="text"
                                placeholder="Search companies..."
                                className="w-full px-3 py-2 border rounded-lg mb-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="space-y-2">
                                {companies
                                    .filter(c => String(c.id) !== String(contact.companyId))
                                    .filter(c => !contactAssignments.some(ca => String(ca.companyId) === String(c.id) && String(ca.contactId) === String(contact.id)))
                                    .filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(c => (
                                        <div key={c.id} onClick={() => handleLinkCompany(c.id)} className="p-3 border rounded-lg hover:bg-emerald-50 cursor-pointer flex justify-between items-center group transition-all">
                                            <div>
                                                <p className="font-bold text-gray-900">{c.name}</p>
                                                <p className="text-xs text-gray-500">{c.industry} • ID: #{c.id}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100" />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactDetail;
