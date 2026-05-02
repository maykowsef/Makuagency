import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANNOUNCEMENT_SITES, ANNOUNCEMENT_TYPES, COUNTRIES, BUSINESS_TYPES } from '../../../data/constants';
import { safeNow } from '../../../utils/dateUtils';

// Sub-components
import Header from './Header';
import BasicInfo from './BasicInfo';
import AddressInfo from './AddressInfo';
import AnnouncementProfiles from './AnnouncementProfiles';
import ContactsList from './ContactsList';
import HistoryList from './HistoryList';
import QuickActions from './QuickActions';
import LogosNotes from './LogosNotes';
import PhoneNumbers from './PhoneNumbers';
import EmailAddresses from './EmailAddresses';
import SocialMedia from './SocialMedia';
// InventoryList removed — announcement stock listings are the inventory
import { GenericModal, AIModal, DeduplicateModal, PublishModal, ScheduleModal } from './Modals';

const SellingPointDetail = ({
    onBack,
    sellingPoint,
    onUpdate,
    onNavigate,
    onDelete,
    minisites = [],
    customTemplates = [],
    onAddMinisite,
    onDeleteMinisite,
    companies = [],
    contacts = [],
    schedules = [],
    userData,
    onAddSchedule,
    viewParams,
    onCheck,
    onFlagFaulty,
    inventory = [],
    contactAssignments = [],
    onUpdateAssignments
}) => {
    const [activeHistoryPage, setActiveHistoryPage] = useState(1);
    const [activeContactsPage, setActiveContactsPage] = useState(1);
    const [activeLogosPage, setActiveLogosPage] = useState(1);
    const [activeAnnouncementsPage, setActiveAnnouncementsPage] = useState(1);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editSection, setEditSection] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [showAIModal, setShowAIModal] = useState(false);
    const [showDeduplicateModal, setShowDeduplicateModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Local state to maintain selling point data
    const [localSellingPoint, setLocalSellingPoint] = useState(sellingPoint);

    useEffect(() => {
        if (sellingPoint) {
            setLocalSellingPoint(sellingPoint);
        }
    }, [sellingPoint]);

    if (!localSellingPoint || Object.keys(localSellingPoint).length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Selling Point not found.</p>
                    <button onClick={onBack} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Go Back</button>
                </div>
            </div>
        );
    }

    // Data Normalization (Logic from original file) - COMPREHENSIVE NULL CHECKS
    if (!localSellingPoint || typeof localSellingPoint !== 'object') {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Selling Point not found or invalid data.</p>
                    <button onClick={onBack} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Go Back</button>
                </div>
            </div>
        );
    }

    const sp = {
        ...localSellingPoint,
        name: localSellingPoint.name || 'Unknown Selling Point',
        address1: localSellingPoint.address?.street || localSellingPoint.address1 || '',
        address2: localSellingPoint.address?.address2 || localSellingPoint.address2 || '',
        address3: localSellingPoint.address?.address3 || localSellingPoint.address3 || '',
        postalCode: localSellingPoint.address?.postalCode || localSellingPoint.postalCode || '',
        city: localSellingPoint.address?.city || localSellingPoint.city || '',
        country: localSellingPoint.address?.country || localSellingPoint.country || '',

        phones: (localSellingPoint.phones || (Array.isArray(localSellingPoint.phone) ? localSellingPoint.phone : [
            { id: 1, number: localSellingPoint.phone || 'No phone', type: 'Main', isPrimary: true, addedBy: { name: 'System' }, addedDate: safeNow() }
        ])).map(p => ({ ...p, modifiedBy: p.modifiedBy || [], checkedBy: p.checkedBy || [] })),

        emails: (localSellingPoint.emails || [
            { id: 1, email: localSellingPoint.email || 'No email', type: 'Main', isPrimary: true }
        ]).map(e => ({ ...e, modifiedBy: e.modifiedBy || [], checkedBy: e.checkedBy || [] })),

        email: localSellingPoint.email || (localSellingPoint.emails?.find(e => e.isPrimary)?.email) || 'No email',

        socialMedia: (localSellingPoint.socialMedia || []).map(s => ({ ...s, modifiedBy: s.modifiedBy || [], checkedBy: s.checkedBy || [] })),

        announcementProfiles: (localSellingPoint.announcementProfiles || localSellingPoint.announcementSites || []).map(s => ({
            ...s,
            id: s.id || Math.random(),
            siteId: s.siteId || s.platform || '',
            targetListings: parseInt(s.targetListings) || 0,
            platform: s.platform || (ANNOUNCEMENT_SITES.find(as => as.id === s.siteId)?.name) || 'Unknown',
            stockListings: (s.stockListings || []).map(sl => ({ ...sl, id: sl.id || Math.random() }))
        })),

        description: typeof localSellingPoint.description === 'string' ? {
            text: localSellingPoint.description,
            addedBy: localSellingPoint.createdBy || { name: 'System' },
            addedDate: localSellingPoint.createdAt || safeNow()
        } : {
            text: localSellingPoint.description?.text || 'No description',
            addedBy: localSellingPoint.description?.addedBy || { name: 'System' },
            addedDate: localSellingPoint.description?.addedDate || safeNow(),
            modifiedBy: localSellingPoint.description?.modifiedBy || []
        },

        logoHistory: (localSellingPoint.logoHistory || localSellingPoint.logos || []).map(l => ({ ...l, uploadedBy: l.uploadedBy || { name: 'System' } }))
            .sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0)),

        history: (localSellingPoint.history || []).map(h => ({ ...h, performedBy: h.performedBy || { name: 'System' } })),
        contacts: [
            ...(localSellingPoint.contacts || []),
            ...contactAssignments
                .filter(ca => String(ca.sellingPointId) === String(localSellingPoint.id))
                .map(ca => {
                    const contact = contacts.find(c => String(c.id) === String(ca.contactId));
                    return contact ? { ...contact, position: ca.role || contact.role, addedDate: ca.assignedAt } : null;
                })
                .filter(c => c !== null)
        ].map(c => ({
            ...c,
            createdBy: c.createdBy || { name: 'System' },
            isPrimary: c.isPrimary || contactAssignments.find(ca => String(ca.contactId) === String(c.id) && String(ca.sellingPointId) === String(localSellingPoint.id))?.role === 'Primary Contact'
        })),
        notes: (localSellingPoint.notes || []).map(n => ({ ...n, author: n.author || { name: 'System' } })),
        duplicateCheck: localSellingPoint.duplicateCheck || { hasPotentialDuplicates: false, duplicateChance: 0, potentialDuplicates: [] },
        currentSchedule: schedules.find(s => String(s.sellingPointId) === String(localSellingPoint.id))
    };

    // Pagination Logic
    const itemsPerPage = 5;
    const getPageItems = (items, page) => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    };

    const totalHistoryPages = Math.ceil(sp.history.length / itemsPerPage);
    const totalContactsPages = Math.ceil(sp.contacts.length / itemsPerPage);
    const totalLogosPages = Math.ceil(sp.logoHistory.length / itemsPerPage);
    const totalAnnouncementsPages = Math.ceil(sp.announcementProfiles.length / itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getPriorityColor = (priority) => {
        const colors = { 'High': 'bg-red-100 text-red-800', 'Medium': 'bg-yellow-100 text-yellow-800', 'Low': 'bg-green-100 text-green-800' };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const Pagination = ({ currentPage, totalPages, onPageChange }) => (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 px-4">Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    );

    // Handlers
    const addHistoryEntry = (action, field, details, changes = null) => {
        return {
            id: Date.now() + Math.random(),
            date: safeNow(),
            action, field, details, changes,
            performedBy: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=000&color=fff' }
        };
    };

    const handleUpdateSP = (updatedSP) => {
        updatedSP.lastModified = { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=000&color=fff', date: safeNow() };
        if (onUpdate) {
            onUpdate(updatedSP);
            setLocalSellingPoint(updatedSP);
        }
    };

    const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

    const handleSaveItem = async (data) => {
        const updatedSP = { ...sp };
        if (!updatedSP.history) updatedSP.history = [];
        let historyEntry = null;

        if (editSection === 'stockListing') {
            // Use dedicated stock listing endpoint for persistence
            const profileId = data.profileId;
            const profiles = updatedSP.announcementProfiles || [];
            const profile = profiles.find(p => String(p.id) === String(profileId));
            if (profile) {
                if (!profile.stockListings) profile.stockListings = [];
                try {
                    if (data.id && !String(data.id).startsWith('temp_')) {
                        // Update existing stock listing via API
                        const res = await fetch(`${API_BASE}/api/stock-listings/${data.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        const updated = await res.json();
                        const idx = profile.stockListings.findIndex(l => String(l.id) === String(data.id));
                        if (idx !== -1) profile.stockListings[idx] = { ...profile.stockListings[idx], ...updated };
                        historyEntry = addHistoryEntry('Modified', 'Stock Listing', `Updated listing: ${data.name || 'Unnamed'}`);
                    } else {
                        // Create new stock listing via API
                        const res = await fetch(`${API_BASE}/api/announcement-profiles/${profileId}/stock-listings`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        const newListing = await res.json();
                        profile.stockListings.push(newListing);
                        historyEntry = addHistoryEntry('Created', 'Stock Listing', `Added new listing: ${data.name || 'Unnamed'}`);
                    }
                } catch (err) {
                    console.error('Failed to save stock listing:', err);
                    // Fallback: update local state only
                    if (data.id) {
                        const idx = profile.stockListings.findIndex(l => String(l.id) === String(data.id));
                        if (idx !== -1) profile.stockListings[idx] = { ...profile.stockListings[idx], ...data };
                    } else {
                        profile.stockListings.push({ ...data, id: 'temp_' + Date.now() });
                    }
                    historyEntry = addHistoryEntry('Modified', 'Stock Listing', `Updated listing: ${data.name || 'Unnamed'}`);
                }
            } else {
                console.warn('Profile not found for stock listing addition:', profileId);
            }
        } else if (editSection === 'announcements') {
            // Use dedicated announcement profile endpoint
            try {
                if (data.id && !String(data.id).startsWith('temp_')) {
                    // Update existing profile via API
                    const res = await fetch(`${API_BASE}/api/announcement-profiles/${data.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const updated = await res.json();
                    let items = [...(updatedSP.announcementProfiles || [])];
                    const idx = items.findIndex(i => String(i.id) === String(data.id));
                    if (idx !== -1) items[idx] = { ...items[idx], ...updated };
                    updatedSP.announcementProfiles = items;
                    historyEntry = addHistoryEntry('Modified', 'Announcement Profile', `Updated: ${data.platform || data.siteId}`);
                } else {
                    // Create new profile via API
                    const res = await fetch(`${API_BASE}/api/selling-points/${sp.id}/announcement-profiles`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const newProfile = await res.json();
                    const site = ANNOUNCEMENT_SITES.find(s => s.id === data.siteId);
                    updatedSP.announcementProfiles = [
                        ...(updatedSP.announcementProfiles || []),
                        { ...newProfile, platform: newProfile.platform || site?.name || data.siteId, icon: site?.icon, stockListings: [] }
                    ];
                    historyEntry = addHistoryEntry('Created', 'Announcement Profile', `Added: ${newProfile.platform}`);
                }
            } catch (err) {
                console.error('Failed to save announcement profile:', err);
                // Fallback: mutate local state
                let items = [...(updatedSP.announcementProfiles || [])];
                if (data.id) {
                    const idx = items.findIndex(i => i.id === data.id);
                    if (idx !== -1) items[idx] = { ...items[idx], ...data };
                } else {
                    const site = ANNOUNCEMENT_SITES.find(s => s.id === data.siteId);
                    items.push({ ...data, id: 'temp_' + Date.now(), platform: site?.name || data.siteId, icon: site?.icon, stockListings: [] });
                }
                updatedSP.announcementProfiles = items;
                historyEntry = addHistoryEntry('Created', 'Announcement Profile', `Added: ${data.siteId}`);
            }
        } else if (editSection === 'description') {
            const oldText = updatedSP.description.text;
            updatedSP.description = { ...updatedSP.description, text: data.text };
            historyEntry = addHistoryEntry('Modified', 'Description', 'Updated description', { field: 'description', oldValue: oldText.substring(0, 30) + '...', newValue: data.text.substring(0, 30) + '...' });
        } else if (editSection === 'basic') {
            Object.assign(updatedSP, data);
            historyEntry = addHistoryEntry('Modified', 'Basic Information', 'Updated core details');
        } else if (editSection === 'address') {
            Object.assign(updatedSP, data);
            historyEntry = addHistoryEntry('Modified', 'Address', `Updated to: ${data.address1}, ${data.city}`);
        } else if (editSection === 'note') {
            if (!updatedSP.notes) updatedSP.notes = [];
            if (data.id) {
                const idx = updatedSP.notes.findIndex(n => n.id === data.id);
                if (idx !== -1) updatedSP.notes[idx] = { ...updatedSP.notes[idx], text: data.text };
                historyEntry = addHistoryEntry('Modified', 'Note', 'Updated note');
            } else {
                updatedSP.notes.push({ id: Date.now(), text: data.text, author: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me' }, date: new Date().toISOString() });
                historyEntry = addHistoryEntry('Created', 'Note', 'Added note');
            }
        } else if (editSection === 'single_field') {
            if (data.field === 'company') {
                updatedSP.companyName = data.companyName;
                updatedSP.companyId = data.companyId;
                historyEntry = addHistoryEntry('Modified', 'Company', `Changed to ${data.companyName}`);
            } else if (data.field) {
                updatedSP[data.field] = data.value;
                historyEntry = addHistoryEntry('Modified', data.label || data.field, `Changed to ${data.value}`);
            }
        } else if (editSection === 'logoHistory') {
            if (!updatedSP.logoHistory) updatedSP.logoHistory = [];
            if (data.isCurrent) updatedSP.logoHistory = updatedSP.logoHistory.map(l => ({ ...l, isCurrent: false }));
            if (data.id) {
                const idx = updatedSP.logoHistory.findIndex(l => l.id === data.id);
                if (idx !== -1) updatedSP.logoHistory[idx] = { ...updatedSP.logoHistory[idx], ...data };
                historyEntry = addHistoryEntry('Modified', 'Logo', 'Updated logo');
            } else {
                updatedSP.logoHistory.push({ ...data, id: Date.now(), uploadDate: new Date().toISOString(), uploadedBy: { name: 'Me' } });
                historyEntry = addHistoryEntry('Created', 'Logo', 'Added logo');
            }
        } else {
            // Arrays: phones, emails, social, contacts
            let propName = editSection;
            if (editSection === 'social') propName = 'socialMedia';

            if (['phones', 'emails', 'socialMedia', 'contacts'].includes(propName)) {
                let items = [...(updatedSP[propName] || [])];
                if (data.isPrimary) items = items.map(i => ({ ...i, isPrimary: false }));

                if (data.id) {
                    const idx = items.findIndex(i => i.id === data.id);
                    if (idx !== -1) items[idx] = { ...items[idx], ...data };
                    historyEntry = addHistoryEntry('Modified', editSection, `Updated ${editSection}`);
                } else {
                    const newItem = { ...data, id: Date.now(), addedDate: safeNow(), addedBy: { name: 'Me' } };
                    items.push(newItem);
                    historyEntry = addHistoryEntry('Created', editSection, `Added ${editSection}`);
                }
                updatedSP[propName] = items;
            }
        }

        if (historyEntry) updatedSP.history.unshift(historyEntry);
        handleUpdateSP(updatedSP);
        setShowEditModal(false);
    };

    const handleDeleteItem = async (section, itemId) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        const updatedSP = { ...sp };
        let propName = section;
        if (section === 'social') propName = 'socialMedia';
        if (section === 'announcements') propName = 'announcementProfiles';

        // Use dedicated API for announcement profiles
        if (section === 'announcements' && itemId && !String(itemId).startsWith('temp_')) {
            try {
                await fetch(`${API_BASE}/api/announcement-profiles/${itemId}`, { method: 'DELETE' });
            } catch (err) {
                console.error('Failed to delete announcement profile:', err);
            }
        }

        if (propName === 'note') updatedSP.notes = updatedSP.notes.filter(n => n.id !== itemId);
        else if (updatedSP[propName]) updatedSP[propName] = updatedSP[propName].filter(i => i.id !== itemId);

        updatedSP.history.unshift(addHistoryEntry('Deleted', section, `Deleted ${section}`));
        handleUpdateSP(updatedSP);
    };

    const handlePublish = (template) => {
        if (!template) return;
        onAddMinisite({
            sellingPointId: sp.id,
            templateId: template.id,
            domain: `${sp.name.toLowerCase().replace(/\s+/g, '-')}.minisite.io`,
            overrides: {},
            businessType: sp.businessType || 'General',
            publishedAt: new Date().toISOString(),
            isActive: true
        });
        setShowPublishModal(false);
    };

    const handleUnpublish = () => {
        const existing = minisites.find(m => String(m.sellingPointId) === String(sp.id));
        if (existing && window.confirm("Unpublish minisite?")) onDeleteMinisite(existing.id);
    };

    const handleLinkContact = (contact) => {
        const updatedSP = { ...sp };

        // 1. Create a new assignment for the central system
        const newAssignment = {
            id: Date.now(),
            contactId: contact.id,
            sellingPointId: sp.id,
            role: 'Contact',
            assignedAt: new Date().toISOString()
        };

        if (onUpdateAssignments) {
            onUpdateAssignments([...contactAssignments, newAssignment]);
        }

        // 2. Add the contact to the selling point for legacy display (simplified version)
        if (!updatedSP.contacts) updatedSP.contacts = [];
        updatedSP.contacts.push({
            id: contact.id,
            name: contact.name,
            firstName: contact.firstName,
            lastName: contact.lastName,
            position: contact.role || contact.position || 'Contact',
            email: contact.email,
            phone: contact.phone,
            isPrimary: updatedSP.contacts.length === 0,
            createdBy: { name: 'Me', avatar: 'https://ui-avatars.com/api/?name=Me&background=000&color=fff' },
            addedDate: safeNow()
        });

        updatedSP.history.unshift(addHistoryEntry('Linked', 'Contact', `Linked contact: ${contact.name}`));
        handleUpdateSP(updatedSP);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                sp={sp} onBack={onBack} onDelete={onDelete} onCheck={() => onCheck(sp.id)}
                onFlagFaulty={onFlagFaulty}
                onShowDeduplicate={() => setShowDeduplicateModal(true)}
                setEditSection={setEditSection} setEditingItem={setEditingItem} setShowEditModal={setShowEditModal}
                getPriorityColor={getPriorityColor}
                viewParams={viewParams}
                userData={userData}
            />

            <div className="px-4 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <BasicInfo
                            sp={sp} onEdit={(section) => { setEditSection(section); setEditingItem(section === 'basic' ? sp : {}); setShowEditModal(true); }}
                            onNavigate={onNavigate} companies={companies}
                            setEditSection={setEditSection} setEditingItem={setEditingItem} setShowEditModal={setShowEditModal}
                        />
                        <AddressInfo
                            sp={sp}
                            onEdit={(section) => { setEditSection(section); setEditingItem(sp); setShowEditModal(true); }}
                            setEditSection={setEditSection}
                            setEditingItem={setEditingItem}
                            setShowEditModal={setShowEditModal}
                        />
                        <PhoneNumbers
                            sp={sp}
                            onAdd={(section) => { setEditSection(section); setEditingItem({}); setShowEditModal(true); }}
                            onEdit={(section, item) => { setEditSection(section); setEditingItem(item); setShowEditModal(true); }}
                            onDelete={handleDeleteItem}
                        />
                        <EmailAddresses
                            sp={sp}
                            onAdd={(section) => { setEditSection(section); setEditingItem({}); setShowEditModal(true); }}
                            onEdit={(section, item) => { setEditSection(section); setEditingItem(item); setShowEditModal(true); }}
                            onDelete={handleDeleteItem}
                        />
                        <SocialMedia
                            sp={sp}
                            onAdd={(section) => { setEditSection(section); setEditingItem({}); setShowEditModal(true); }}
                            onEdit={(section, item) => { setEditSection(section); setEditingItem(item); setShowEditModal(true); }}
                            onDelete={handleDeleteItem}
                        />
                        <AnnouncementProfiles
                            sp={sp} activeAnnouncementsPage={activeAnnouncementsPage} setActiveAnnouncementsPage={setActiveAnnouncementsPage}
                            onAdd={(section) => { setEditSection(section); setEditingItem({}); setShowEditModal(true); }}
                            onEdit={(section, item) => { setEditSection(section); setEditingItem(item); setShowEditModal(true); }}
                            onDelete={handleDeleteItem}
                            onAddStock={(profileId) => { setEditSection('stockListing'); setEditingItem({ profileId }); setShowEditModal(true); }}
                            onEditStock={(profileId, listing) => { setEditSection('stockListing'); setEditingItem({ ...listing, profileId }); setShowEditModal(true); }}
                            onDeleteStock={async (profileId, listingId) => {
                                // Delete from DB first (if real ID, not temp)
                                if (listingId && !String(listingId).startsWith('temp_')) {
                                    try {
                                        await fetch(`${API_BASE}/api/stock-listings/${listingId}`, { method: 'DELETE' });
                                    } catch (err) {
                                        console.error('Failed to delete stock listing:', err);
                                    }
                                }
                                const updatedSP = { ...sp };
                                const p = updatedSP.announcementProfiles.find(ap => ap.id === profileId);
                                if (p) { p.stockListings = p.stockListings.filter(l => l.id !== listingId); handleUpdateSP(updatedSP); }
                            }}
                            currentAnnouncementsItems={getPageItems(sp.announcementProfiles, activeAnnouncementsPage)}
                            totalAnnouncementsPages={totalAnnouncementsPages}
                            Pagination={Pagination}
                            ANNOUNCEMENT_SITES={ANNOUNCEMENT_SITES}
                        />
                        {/* Physical inventory removed — use Announcement Profiles stock listings above */}
                        <ContactsList
                            sp={sp} activeContactsPage={activeContactsPage} setActiveContactsPage={setActiveContactsPage}
                            onAdd={(section) => { setEditSection(section); setEditingItem({}); setShowEditModal(true); }}
                            onEdit={(section, item) => { setEditSection(section); setEditingItem(item); setShowEditModal(true); }}
                            onDelete={handleDeleteItem}
                            onNavigate={onNavigate}
                            onLinkContact={handleLinkContact}
                            allContacts={contacts}
                            currentContactsItems={getPageItems(sp.contacts, activeContactsPage)}
                            totalContactsPages={totalContactsPages}
                            Pagination={Pagination}
                            formatDate={formatDate}
                        />
                        <HistoryList
                            sp={sp} activeHistoryPage={activeHistoryPage} setActiveHistoryPage={setActiveHistoryPage}
                            currentHistoryItems={getPageItems(sp.history, activeHistoryPage)}
                            totalHistoryPages={totalHistoryPages}
                            Pagination={Pagination}
                            formatDate={formatDate}
                        />
                    </div>

                    <div className="space-y-6">
                        <QuickActions
                            sp={sp} onShowAI={() => setShowAIModal(true)} onShowPublish={() => setShowPublishModal(true)}
                            onUnpublish={handleUnpublish} existingMinisite={minisites.filter(m => String(m.sellingPointId) === String(sp.id)).sort((a, b) => (b.id || 0) - (a.id || 0))[0]}
                            customTemplates={customTemplates}
                            onScheduleCall={() => setShowScheduleModal(true)}
                            currentSchedule={schedules.find(s => String(s.sellingPointId) === String(sp.id))}
                            onExportExcel={() => alert('Export')}
                            onSearchInternet={() => window.open(`https://google.com/search?q=${sp.name}`)}
                            onFlagHasWebsite={() => {
                                const updatedSP = { ...sp, website: !sp.website };
                                if (!updatedSP.history) updatedSP.history = [];
                                updatedSP.history.unshift(addHistoryEntry('Modified', 'Website', updatedSP.website ? 'Marked as having website' : 'Unmarked website'));
                                handleUpdateSP(updatedSP);
                            }}
                            onEditMinisite={() => {
                                const site = minisites.filter(m => String(m.sellingPointId) === String(sp.id)).sort((a, b) => (b.id || 0) - (a.id || 0))[0];
                                if (site) {
                                    onNavigate('minisite-dashboard', { editId: site.id });
                                }
                            }}
                        />
                        <LogosNotes
                            sp={sp} activeLogosPage={activeLogosPage} setActiveLogosPage={setActiveLogosPage}
                            onAddLogo={() => { setEditSection('logoHistory'); setEditingItem({}); setShowEditModal(true); }}
                            onDeleteLogo={handleDeleteItem}
                            onSetCurrentLogo={(logoId) => {
                                const updatedSP = { ...sp };
                                updatedSP.logoHistory = updatedSP.logoHistory.map(l => ({ ...l, isCurrent: l.id === logoId }));
                                handleUpdateSP(updatedSP);
                            }}
                            onAddNote={() => { setEditSection('note'); setEditingItem({}); setShowEditModal(true); }}
                            onEditNote={(note) => { setEditSection('note'); setEditingItem(note); setShowEditModal(true); }}
                            onDeleteNote={handleDeleteItem}
                            currentLogosItems={getPageItems(sp.logoHistory, activeLogosPage)}
                            totalLogosPages={totalLogosPages}
                            Pagination={Pagination}
                            formatDate={formatDate}
                        />
                    </div>
                </div>
            </div>

            <AIModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} sp={sp} />
            <DeduplicateModal isOpen={showDeduplicateModal} onClose={() => setShowDeduplicateModal(false)} sp={sp} />
            <PublishModal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)} customTemplates={customTemplates} localSellingPoint={sp} onPublish={handlePublish} />
            <ScheduleModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} sp={sp} onSchedule={onAddSchedule} userData={userData} />
            <GenericModal
                isOpen={showEditModal} onClose={() => setShowEditModal(false)}
                title={editingItem?.id ? `Edit ${editSection}` : `Add ${editSection}`}
                type={editSection} data={editingItem} onSave={handleSaveItem} companies={companies}
                sp={sp}
            />
        </div>
    );
};

export default SellingPointDetail;
