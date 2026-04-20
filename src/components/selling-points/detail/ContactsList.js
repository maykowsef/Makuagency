import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Mail, Phone, ExternalLink, Link as LinkIcon } from 'lucide-react';
import ContactLinkModal from './ContactLinkModal';

const ContactsList = ({
    sp,
    activeContactsPage,
    setActiveContactsPage,
    onAdd,
    onEdit,
    onDelete,
    onNavigate,
    onLinkContact,
    currentContactsItems,
    totalContactsPages,
    Pagination,
    formatDate,
    allContacts = []
}) => {
    const [showLinkModal, setShowLinkModal] = useState(false);

    const handleLinkExisting = (contact) => {
        if (onLinkContact) {
            onLinkContact(contact);
        }
        setShowLinkModal(false);
    };

    const handleCreateNew = () => {
        setShowLinkModal(false);
        onNavigate('contact-form', { returnTo: 'selling-point-detail', returnId: sp.id, sellingPointId: sp.id });
    };

    const linkedContactIds = (sp.contacts || []).map(c => c.id);

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Associated Contacts</h3>
                            <p className="text-sm text-gray-500">{sp.contacts?.length || 0} contacts linked</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowLinkModal(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <LinkIcon className="w-4 h-4" />
                        LINK CONTACT
                    </button>
                </div>

                {currentContactsItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentContactsItems.map((contact) => (
                            <div key={contact.id} className="group p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 relative overflow-hidden">
                                {/* Decorative gradient */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-md text-indigo-700 font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                                            {(contact.firstName?.[0] || contact.name?.[0] || '?').toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900">
                                                    {contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.name}
                                                </h4>
                                                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1 py-0.5 rounded">ID: #{contact.id}</span>
                                                {contact.isPrimary && <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">PRIMARY</span>}
                                            </div>
                                            <p className="text-xs text-indigo-600 font-medium">{contact.position || 'No Position'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button onClick={() => onEdit('contacts', contact)} className="p-1.5 bg-white shadow-sm border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => onDelete('contacts', contact.id)} className="p-1.5 bg-white shadow-sm border border-gray-200 rounded-lg text-gray-400 hover:text-red-600 hover:border-red-300 transition-all duration-200">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => onNavigate('contact-detail', { id: contact.id, returnTo: 'selling-point-detail', returnId: sp.id })} className="p-1.5 bg-white shadow-sm border border-gray-200 rounded-lg text-gray-400 hover:text-indigo-600 hover:border-indigo-300 transition-all duration-200">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {contact.email && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="truncate">{contact.email}</span>
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                                            <Phone className="w-3.5 h-3.5 text-gray-400" /> {contact.phone}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                                    <span>Added {formatDate(contact.addedDate || new Date().toISOString())}</span>
                                    <span>By {contact.createdBy?.name || 'System'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium mb-2">No contacts linked yet</p>
                        <p className="text-sm text-gray-400 mb-4">Link existing contacts or create new ones</p>
                        <button
                            onClick={() => setShowLinkModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Link First Contact
                        </button>
                    </div>
                )}

                {totalContactsPages > 1 && (
                    <Pagination
                        currentPage={activeContactsPage}
                        totalPages={totalContactsPages}
                        onPageChange={setActiveContactsPage}
                    />
                )}
            </div>

            <ContactLinkModal
                isOpen={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onLinkExisting={handleLinkExisting}
                onCreateNew={handleCreateNew}
                contacts={allContacts}
                linkedContactIds={linkedContactIds}
            />
        </>
    );
};

export default ContactsList;
