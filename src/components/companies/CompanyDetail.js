import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Building2, MapPin, Phone, Mail, Globe, Users, MapPinned, Plus, X } from 'lucide-react';
import { COUNTRIES } from '../../data/constants';

const CompanyDetail = ({ companyId, companies = [], sellingPoints = [], contacts = [], onBack, onEdit, onDelete, onNavigate, onUpdate, viewParams }) => {
    const company = companies.find(c => String(c.id) === String(companyId));
    const [spPage, setSpPage] = useState(1);
    const [contactsPage, setContactsPage] = useState(1);
    const [showAddSPModal, setShowAddSPModal] = useState(false);
    const [showAddContactModal, setShowAddContactModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editField, setEditField] = useState(null);
    const [formData, setFormData] = useState({});
    const itemsPerPage = 6;

    if (!company) {
        return <div className="p-8 text-center text-gray-500">Company not found.</div>;
    }

    // Get linked selling points and contacts by companyId
    const linkedSPs = sellingPoints.filter(sp => String(sp.companyId) === String(companyId));
    const linkedContacts = contacts.filter(c => String(c.companyId) === String(companyId));

    const handleEditField = (label, field, value) => {
        setEditField({ label, field, value });
        setFormData({ value });
        setShowEditModal(true);
    };

    const handleSaveField = (e) => {
        e.preventDefault();
        const updatedCompany = { ...company };

        if (editField.field.startsWith('address.')) {
            const addrField = editField.field.split('.')[1];
            updatedCompany.address = { ...updatedCompany.address, [addrField]: formData.value };
        } else {
            updatedCompany[editField.field] = formData.value;
        }

        // track modification (placeholder)
        console.log(`Updated ${editField.field} to ${formData.value}`);

        onUpdate(updatedCompany);
        setShowEditModal(false);
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

    // Pagination for selling points
    const totalSPPages = Math.ceil(linkedSPs.length / itemsPerPage);
    const paginatedSPs = linkedSPs.slice((spPage - 1) * itemsPerPage, spPage * itemsPerPage);

    // Pagination for contacts
    const totalContactPages = Math.ceil(linkedContacts.length / itemsPerPage);
    const paginatedContacts = linkedContacts.slice((contactsPage - 1) * itemsPerPage, contactsPage * itemsPerPage);

    const handleLink = (id, type) => {
        if (type === 'selling-point') {
            const sp = sellingPoints.find(p => String(p.id) === String(id));
            if (sp) onUpdateSellingPoint({ ...sp, companyId });
        } else if (type === 'contact') {
            const contact = contacts.find(c => String(c.id) === String(id));
            if (contact) onUpdateContact({ ...contact, companyId });
        }
        setShowAddSPModal(false);
        setShowAddContactModal(false);
    };

    const handleUnlink = (id, type) => {
        if (type === 'selling-point') {
            const sp = sellingPoints.find(p => String(p.id) === String(id));
            if (sp) onUpdateSellingPoint({ ...sp, companyId: null });
        } else if (type === 'contact') {
            const contact = contacts.find(c => String(c.id) === String(id));
            if (contact) onUpdateContact({ ...contact, companyId: null });
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
            onDelete(companyId);
            onBack();
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{viewParams?.returnTo ? 'Back Previous' : 'Back to Companies'}</span>
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(companyId)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-4 bg-indigo-100 rounded-xl">
                        <Building2 className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                            <span className="text-sm font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">ID: #{company.id}</span>
                        </div>
                        <p className="text-lg text-gray-600">{company.industry}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="group relative flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span>{company.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" className="w-5 h-5 rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity" title="Last modified by Admin - 1 hour ago" />
                                    <button onClick={() => handleEditField('Phone', 'phone', company.phone)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-600 overflow-hidden">
                                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <a href={`mailto:${company.email}`} className="text-indigo-600 hover:underline truncate">
                                        {company.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditField('Email', 'email', company.email)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-600 overflow-hidden">
                                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <a href={company.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate">
                                        {company.website}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditField('Website', 'website', company.website)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-indigo-50 rounded text-indigo-600 transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Address</h3>
                        <div className="space-y-3">
                            <div className="group relative flex items-center justify-between">
                                <p className="text-sm"><span className="font-semibold text-gray-500 w-24 inline-block">address 1 :</span> {company.address?.street}</p>
                                <div className="flex items-center gap-2">
                                    <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" className="w-4 h-4 rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity" title="Modified by Admin - 1 hour ago" />
                                    <button onClick={() => handleEditField('Address 1', 'address.street', company.address?.street)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-50 rounded text-indigo-600 transition-all">
                                        <Edit className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative flex items-center justify-between">
                                <p className="text-sm"><span className="font-semibold text-gray-500 w-24 inline-block">address 2 :</span> {company.address?.address2 || '-'}</p>
                                <button onClick={() => handleEditField('Address 2', 'address.address2', company.address?.address2)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-50 rounded text-indigo-600 transition-all">
                                    <Edit className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="group relative flex items-center justify-between">
                                <p className="text-sm"><span className="font-semibold text-gray-500 w-24 inline-block">city :</span> {company.address?.city}</p>
                                <div className="flex items-center gap-2">
                                    <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" className="w-4 h-4 rounded-full border border-white opacity-0 group-hover:opacity-100 transition-opacity" title="Modified by Admin - 2 days ago" />
                                    <button onClick={() => handleEditField('City', 'address.city', company.address?.city)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-50 rounded text-indigo-600 transition-all">
                                        <Edit className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="group relative flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-500 w-24 text-sm inline-block uppercase">country :</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${COUNTRIES.find(c => c.name === company.address?.country)?.color || 'bg-gray-100 text-gray-800'}`}>
                                        {COUNTRIES.find(c => c.name === company.address?.country)?.flag} {company.address?.country || '-'}
                                    </span>
                                </div>
                                <button onClick={() => handleEditField('Country', 'address.country', company.address?.country)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-50 rounded text-indigo-600 transition-all">
                                    <Edit className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && <GenericModal />}

            {/* Linked Selling Points */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MapPinned className="w-5 h-5" />
                        Selling Points ({linkedSPs.length})
                    </h2>
                    <button
                        onClick={() => setShowAddSPModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Link Selling Point
                    </button>
                </div>

                {paginatedSPs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {paginatedSPs.map(sp => (
                                <div
                                    key={sp.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group relative"
                                    onClick={() => onNavigate('selling-point-detail', { id: sp.id, returnTo: 'company-detail', returnId: company.id })}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{sp.name}</h4>
                                                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-600 px-1 py-0.5 rounded">ID: #{sp.id}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{sp.businessType}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnlink(sp.id, 'selling-point');
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-all"
                                            title="Unlink"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <p className="text-xs text-gray-500">{sp.address?.city}</p>
                                        {!sp.website && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                                                No Website
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalSPPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setSpPage(prev => Math.max(1, prev - 1))}
                                    disabled={spPage === 1}
                                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-600">
                                    {spPage} / {totalSPPages}
                                </span>
                                <button
                                    onClick={() => setSpPage(prev => Math.min(totalSPPages, prev + 1))}
                                    disabled={spPage === totalSPPages}
                                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-8">No selling points linked to this company.</p>
                )}
            </div>

            {/* Linked Contacts */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Contacts ({linkedContacts.length})
                    </h2>
                    <button
                        onClick={() => setShowAddContactModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Link Contact
                    </button>
                </div>

                {paginatedContacts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {paginatedContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group relative"
                                    onClick={() => onNavigate('contact-detail', { id: contact.id, returnTo: 'company-detail', returnId: company.id })}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                                                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1 py-0.5 rounded">ID: #{contact.id}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{contact.role}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnlink(contact.id, 'contact');
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-all"
                                            title="Unlink"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{contact.email}</p>
                                </div>
                            ))}
                        </div>
                        {totalContactPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setContactsPage(prev => Math.max(1, prev - 1))}
                                    disabled={contactsPage === 1}
                                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-600">
                                    {contactsPage} / {totalContactPages}
                                </span>
                                <button
                                    onClick={() => setContactsPage(prev => Math.min(totalContactPages, prev + 1))}
                                    disabled={contactsPage === totalContactPages}
                                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 text-center py-8">No contacts linked to this company.</p>
                )}
            </div>

            {/* Link Selling Point Modal */}
            {showAddSPModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Link Selling Point</h3>
                            <button onClick={() => setShowAddSPModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <input
                                type="text"
                                placeholder="Search selling points..."
                                className="w-full px-3 py-2 border rounded-lg mb-4"
                                onChange={(e) => {/* Implement search locally if needed based on e.target.value */ }}
                            />
                            <div className="space-y-2">
                                {sellingPoints
                                    .filter(sp => String(sp.companyId) !== String(companyId))
                                    .map(sp => (
                                        <div key={sp.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleLink(sp.id, 'selling-point')}
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">{sp.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-gray-500">{sp.businessType} • {sp.address?.city}</p>
                                                    {!sp.website && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">No Website</span>}
                                                </div>
                                            </div>
                                            <Plus className="w-4 h-4 text-indigo-600" />
                                        </div>
                                    ))}
                                {sellingPoints.filter(sp => !company.linkedSellingPoints?.includes(sp.id)).length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No available selling points to link</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Contact Modal */}
            {showAddContactModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Link Contact</h3>
                            <button onClick={() => setShowAddContactModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="w-full px-3 py-2 border rounded-lg mb-4"
                            />
                            <div className="space-y-2">
                                {contacts
                                    .filter(c => String(c.companyId) !== String(companyId))
                                    .map(contact => (
                                        <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleLink(contact.id, 'contact')}
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">{contact.name}</p>
                                                <p className="text-xs text-gray-500">{contact.role} • {contact.email}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-indigo-600" />
                                        </div>
                                    ))}
                                {contacts.filter(c => !company.linkedContacts?.includes(c.id)).length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No available contacts to link</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyDetail;
