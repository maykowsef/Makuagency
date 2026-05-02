import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Save, MapPin, Building2, Phone, Mail, Globe,
    Search, X, Plus, Trash2, Edit, Image as ImageIcon, ExternalLink,
    Bot, Users, FileText, CheckCircle, ChevronDown, ChevronRight, Megaphone
} from 'lucide-react';
import { safeNow } from '../../utils/dateUtils';
import {
    BUSINESS_TYPES, COUNTRIES, ANNOUNCEMENT_SITES, SOCIAL_PLATFORMS, FUEL_TYPES, VEHICLE_TYPES,
    INDUSTRY_MAP, INDUSTRY_ANNOUNCEMENT_SITES,
    PROPERTY_TYPES, PROPERTY_CONDITIONS, PROPERTY_LISTING_TYPES, PROPERTY_AMENITIES, ENERGY_RATINGS,
    CLOTHING_CATEGORIES, CLOTHING_CONDITIONS, CLOTHING_SIZES, CLOTHING_GENDERS, CLOTHING_MATERIALS, CLOTHING_BRANDS_POPULAR
} from '../../data/constants';
import CompanySearchModal from '../companies/CompanySearchModal';
import CompanyForm from '../companies/CompanyForm';
import ContactSearchModal from '../contacts/ContactSearchModal';
import ContactForm from '../contacts/ContactForm';

const SellingPointForm = ({
    onSave,
    onCancel,
    initialData = null,
    availableCompanies = [],
    onAddCompany,
    availableContacts = [],
    onAddContact
}) => {

    const [formData, setFormData] = useState({
        name: '',
        companyId: null,
        companyName: '',
        siret: '',
        businessType: '',
        address: { street: '', address2: '', city: '', country: '', postalCode: '' },
        description: '',
        phones: [{ id: Date.now(), number: '', type: 'Work', isPrimary: true }],
        email: '',
        socialMedia: [],
        announcementProfiles: [], // Will now contain nested stockListings
        contacts: [],
        logoHistory: [],
        notes: [],
        priority: 'Medium',
        status: 'Active'
    });

    const [showCompanySearch, setShowCompanySearch] = useState(false);
    const [showCreateCompany, setShowCreateCompany] = useState(false);
    const [showContactSearch, setShowContactSearch] = useState(false);
    const [showCreateContact, setShowCreateContact] = useState(false);
    const [expandedProfiles, setExpandedProfiles] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                address: initialData.address || { street: '', address2: '', city: '', country: '', postalCode: '' },
                phones: initialData.phones || (initialData.phone ? (Array.isArray(initialData.phone) ? initialData.phone : [{ id: 1, number: initialData.phone, type: 'Work', isPrimary: true }]) : []),
                socialMedia: initialData.socialMedia || [],
                announcementProfiles: initialData.announcementProfiles || [],
                contacts: initialData.contacts || [],
                logoHistory: initialData.logoHistory || initialData.logos || [],
                notes: initialData.notes || []
            });
        }
    }, [initialData]);

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    // Phone Handlers
    const handleAddPhone = () => {
        setFormData(prev => ({
            ...prev,
            phones: [...prev.phones, { id: Date.now(), number: '', type: 'Work', isPrimary: prev.phones.length === 0 }]
        }));
    };

    const handlePhoneChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            phones: prev.phones.map(p => {
                if (p.id === id) {
                    return { ...p, [field]: value };
                }
                if (field === 'isPrimary' && value === true) {
                    return { ...p, isPrimary: false };
                }
                return p;
            })
        }));
    };

    const handleDeletePhone = (id) => {
        setFormData(prev => ({
            ...prev,
            phones: prev.phones.filter(p => p.id !== id)
        }));
    };

    // Social Media Handlers
    const handleAddSocial = () => {
        setFormData(prev => ({
            ...prev,
            socialMedia: [...prev.socialMedia, {
                id: Date.now(),
                platform: 'facebook',
                url: '',
                followers: '',
                lastUploadDate: '',
                isPrimary: prev.socialMedia.length === 0
            }]
        }));
    };

    const handleSocialChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: prev.socialMedia.map(s => {
                if (s.id === id) {
                    return { ...s, [field]: value };
                }
                if (field === 'isPrimary' && value === true) return { ...s, isPrimary: false };
                return s;
            })
        }));
    };

    const handleDeleteSocial = (id) => {
        setFormData(prev => ({
            ...prev,
            socialMedia: prev.socialMedia.filter(s => s.id !== id)
        }));
    };

    // Announcement Profile Handlers
    const handleAddAnnouncementProfile = () => {
        const newId = Date.now();
        setFormData(prev => ({
            ...prev,
            announcementProfiles: [
                ...prev.announcementProfiles,
                { id: newId, siteId: '', url: '', targetListings: '', stockListings: [] }
            ]
        }));
        setExpandedProfiles(prev => ({ ...prev, [newId]: true }));
    };

    const handleAnnouncementProfileChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            announcementProfiles: prev.announcementProfiles.map(a => a.id === id ? { ...a, [field]: value } : a)
        }));
    };

    const handleDeleteAnnouncementProfile = (id) => {
        setFormData(prev => ({
            ...prev,
            announcementProfiles: prev.announcementProfiles.filter(a => a.id !== id)
        }));
    };

    const toggleProfileExpand = (id) => {
        setExpandedProfiles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Nested Stock Listing Handlers (within a Profile)
    const handleAddStockListing = (profileId) => {
        setFormData(prev => ({
            ...prev,
            announcementProfiles: prev.announcementProfiles.map(p => {
                if (p.id === profileId) {
                    return {
                        ...p,
                        stockListings: [...(p.stockListings || []), { id: Date.now(), url: '', imageUrls: [] }]
                    };
                }
                return p;
            })
        }));
    };

    const handleStockListingChange = (profileId, listingId, field, value) => {
        setFormData(prev => ({
            ...prev,
            announcementProfiles: prev.announcementProfiles.map(p => {
                if (p.id === profileId) {
                    return {
                        ...p,
                        stockListings: p.stockListings.map(s => s.id === listingId ? { ...s, [field]: value } : s)
                    };
                }
                return p;
            })
        }));
    };

    const handleDeleteStockListing = (profileId, listingId) => {
        setFormData(prev => ({
            ...prev,
            announcementProfiles: prev.announcementProfiles.map(p => {
                if (p.id === profileId) {
                    return {
                        ...p,
                        stockListings: p.stockListings.filter(s => s.id !== listingId)
                    };
                }
                return p;
            })
        }));
    };



    // Company Handlers
    const handleCompanySelect = (company) => {
        setFormData(prev => ({
            ...prev,
            companyId: company.id,
            companyName: company.name,
            siret: company.siret || prev.siret,
            address: {
                ...prev.address,
                street: company.address?.street || prev.address.street,
                city: company.address?.city || prev.address.city,
                country: company.address?.country || prev.address.country,
                postalCode: company.address?.postalCode || prev.address.postalCode
            }
        }));
        setShowCompanySearch(false);
    };

    // Contact Handlers
    const handleContactSelect = (contact) => {
        if (!formData.contacts.find(c => c.id === contact.id)) {
            setFormData(prev => ({
                ...prev,
                contacts: [...prev.contacts, contact]
            }));
        }
        setShowContactSearch(false);
    };

    const handleDeleteContact = (id) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter(c => c.id !== id)
        }));
    };

    // Logo Handlers
    const handleAddLogo = () => {
        const url = prompt("Enter Logo URL:");
        if (url) {
            setFormData(prev => ({
                ...prev,
                logoHistory: [...prev.logoHistory, {
                    id: Date.now(),
                    imageUrl: url,
                    version: 'Logo ' + (prev.logoHistory.length + 1),
                    isCurrent: prev.logoHistory.length === 0,
                    uploadDate: safeNow(),
                    uploadedBy: { name: 'Me', avatar: '' },
                    status: 'Active'
                }]
            }));
        }
    };

    const handleEditLogo = (id) => {
        const logo = formData.logoHistory.find(l => l.id === id);
        if (!logo) return;
        const newUrl = prompt("Enter new Logo URL:", logo.imageUrl);
        if (newUrl) {
            setFormData(prev => ({
                ...prev,
                logoHistory: prev.logoHistory.map(l => l.id === id ? { ...l, imageUrl: newUrl } : l)
            }));
        }
    };

    const handleDeleteLogo = (id) => {
        setFormData(prev => ({
            ...prev,
            logoHistory: prev.logoHistory.filter(l => l.id !== id)
        }));
    };

    const handleSetCurrentLogo = (id) => {
        setFormData(prev => ({
            ...prev,
            logoHistory: prev.logoHistory.map(l => ({
                ...l,
                isCurrent: l.id === id,
                status: l.id === id ? 'Active' : 'Inactive'
            }))
        }));
    };

    // Note Handlers
    const handleAddNote = () => {
        const text = prompt("Enter Note:");
        if (text) {
            setFormData(prev => ({
                ...prev,
                notes: [...prev.notes, { id: Date.now(), text, date: safeNow(), author: { name: 'Me', avatar: '' } }]
            }));
        }
    };

    const handleDeleteNote = (id) => {
        setFormData(prev => ({
            ...prev,
            notes: prev.notes.filter(n => n.id !== id)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto pb-24">
            {/* Modals unchanged */}
            <CompanySearchModal isOpen={showCompanySearch} onClose={() => setShowCompanySearch(false)} onSelect={handleCompanySelect} onCreateNew={() => { setShowCompanySearch(false); setShowCreateCompany(true); }} companies={availableCompanies} />
            {showCreateCompany && (<div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"> <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"> <CompanyForm onSave={(c) => { const company = onAddCompany ? onAddCompany(c) : { ...c, id: Date.now() }; handleCompanySelect(company); setShowCreateCompany(false); }} onCancel={() => setShowCreateCompany(false)} /> </div> </div>)}
            <ContactSearchModal isOpen={showContactSearch} onClose={() => setShowContactSearch(false)} onSelect={handleContactSelect} onCreateNew={() => { setShowContactSearch(false); setShowCreateContact(true); }} contacts={availableContacts} />
            {showCreateContact && (<div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"> <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"> <ContactForm onSave={(c) => { const contact = onAddContact ? onAddContact(c) : { ...c, id: Date.now() }; handleContactSelect(contact); setShowCreateContact(false); }} onCancel={() => setShowCreateContact(false)} /> </div> </div>)}

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {initialData ? 'Edit Selling Point' : 'Create Selling Point'}
                    </h2>
                    <p className="text-gray-500">Add profiles, target listings, and then feed stock listings</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Basic Information */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Business Name <span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Bistro Le Paris" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Company</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input type="text" value={formData.companyName} readOnly placeholder="Search Company" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 cursor-pointer outline-none pl-10" onClick={() => setShowCompanySearch(true)} />
                                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                                </div>
                                <button type="button" onClick={() => setShowCreateCompany(true)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">SIRET Number</label>
                            <input type="text" name="siret" value={formData.siret} onChange={handleChange} placeholder="14-digit SIRET" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Business Type</label>
                            <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="">Select Type...</option>
                                {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none capitalize">
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="Low">Low Priority</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none capitalize">
                                <option value="Active">Active</option>
                                <option value="Permanently Closed">Permanently Closed</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Brief description of the business..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                        </div>
                    </div>
                </section>

                {/* 2. Contact Details (Phone & Email) */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-indigo-600" /> Contact Details
                    </h3>
                    <div className="space-y-6">
                        {/* Phones */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Numbers</label>
                                <button type="button" onClick={handleAddPhone} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Phone</button>
                            </div>
                            <div className="space-y-3">
                                {formData.phones.map((phone, idx) => (
                                    <div key={phone.id} className="flex flex-wrap md:flex-nowrap gap-3 items-start">
                                        <input
                                            type="tel"
                                            value={phone.number}
                                            onChange={(e) => handlePhoneChange(phone.id, 'number', e.target.value)}
                                            placeholder={`Phone ${idx + 1}`}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl outline-none"
                                        />
                                        <select
                                            value={phone.type}
                                            onChange={(e) => handlePhoneChange(phone.id, 'type', e.target.value)}
                                            className="w-32 px-3 py-2 border border-gray-300 rounded-xl outline-none"
                                        >
                                            <option value="Work">Work</option>
                                            <option value="Mobile">Mobile</option>
                                            <option value="Fax">Fax</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handlePhoneChange(phone.id, 'isPrimary', !phone.isPrimary)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${phone.isPrimary ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            {phone.isPrimary ? 'Primary' : 'Set Primary'}
                                        </button>
                                        <button type="button" onClick={() => handleDeletePhone(phone.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                    </div>
                </section>

                {/* 3. Address */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-600" /> Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                            <input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} placeholder="123 Main St" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address Line 2</label>
                            <input type="text" name="address2" value={formData.address.address2} onChange={handleAddressChange} placeholder="Suite, Unit, Building, etc." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                            <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} placeholder="City" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Postal Code</label>
                            <input type="text" name="postalCode" value={formData.address.postalCode} onChange={handleAddressChange} placeholder="Postal Code" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
                            <select name="country" value={formData.address.country} onChange={handleAddressChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" >
                                <option value="">Select Country...</option>
                                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* 4. Social Media */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-indigo-600" /> Social Media
                        </h3>
                        <button type="button" onClick={handleAddSocial} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Profile</button>
                    </div>
                    <div className="space-y-4">
                        {formData.socialMedia.map((social) => (
                            <div key={social.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <select
                                        value={social.platform}
                                        onChange={(e) => handleSocialChange(social.id, 'platform', e.target.value)}
                                        className="w-40 px-3 py-2 border border-gray-300 rounded-xl outline-none capitalize"
                                    >
                                        {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <input
                                        type="url"
                                        value={social.url}
                                        onChange={(e) => handleSocialChange(social.id, 'url', e.target.value)}
                                        placeholder="Profile URL"
                                        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-xl outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={social.followers}
                                        onChange={(e) => handleSocialChange(social.id, 'followers', e.target.value)}
                                        placeholder="Followers (e.g. 1.2k)"
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-xl outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleSocialChange(social.id, 'isPrimary', !social.isPrimary)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${social.isPrimary ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {social.isPrimary ? 'Primary' : 'Set Primary'}
                                    </button>
                                    <button type="button" onClick={() => handleDeleteSocial(social.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))}
                        {formData.socialMedia.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No social media profiles added.</p>}
                    </div>
                </section>

                {/* 5. Contacts (People) */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" /> Contacts
                        </h3>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setShowContactSearch(true)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100">Search Existing</button>
                            <button type="button" onClick={() => setShowCreateContact(true)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">Create New</button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {formData.contacts.map(contact => (
                            <div key={contact.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{contact.firstName} {contact.lastName}</p>
                                        <p className="text-xs text-gray-500">{contact.email} • {contact.role}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => handleDeleteContact(contact.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        ))}
                        {formData.contacts.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No contacts linked.</p>}
                    </div>
                </section>

                {/* 6. Announcement Sites & Stock Listings */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-indigo-600" /> Announcement Profiles & Stock
                        </h3>
                        <button type="button" onClick={handleAddAnnouncementProfile} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm">
                            <Plus className="w-4 h-4" /> Add Profile
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.announcementProfiles.map((ap) => (
                            <div key={ap.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                {/* Profile Header/Settings */}
                                <div className={`p-4 flex flex-wrap items-center gap-4 transition-colors ${expandedProfiles[ap.id] ? 'bg-indigo-50/30 border-b border-gray-100' : 'bg-white'}`}>
                                    <button type="button" onClick={() => toggleProfileExpand(ap.id)} className="p-1 hover:bg-gray-200 rounded-lg text-gray-500">
                                        {expandedProfiles[ap.id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                    </button>

                                    <div className="flex-1 min-w-[200px]">
                                        <div className="flex gap-2">
                                            <select
                                                value={ap.siteId} onChange={(e) => handleAnnouncementProfileChange(ap.id, 'siteId', e.target.value)}
                                                className="w-1/3 px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                                            >
                                                <option value="">Select Site...</option>
                                                {ANNOUNCEMENT_SITES.map(as => <option key={as.id} value={as.id}>{as.icon} {as.name}</option>)}
                                            </select>
                                            <input
                                                type="url" value={ap.url} onChange={(e) => handleAnnouncementProfileChange(ap.id, 'url', e.target.value)}
                                                placeholder="Profile URL"
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Listings:</label>
                                        <input
                                            type="number" value={ap.targetListings} onChange={(e) => handleAnnouncementProfileChange(ap.id, 'targetListings', e.target.value)}
                                            placeholder="50" className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <button type="button" onClick={() => handleDeleteAnnouncementProfile(ap.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Nested Stock Listings */}
                                {expandedProfiles[ap.id] && (
                                    <div className="p-6 bg-white space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Stock Listings for this Profile</h4>
                                                <p className="text-[10px] text-gray-500 mt-1">Add individual ads/listings found on this profile.</p>
                                            </div>
                                            <button type="button" onClick={() => handleAddStockListing(ap.id)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                                                + Add Stock Listing
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {ap.stockListings?.map((sl, idx) => {
                                                const currentIndustry = INDUSTRY_MAP[formData.businessType] || null;
                                                return (
                                                <div key={sl.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group/listing">
                                                    <button type="button" onClick={() => handleDeleteStockListing(ap.id, sl.id)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/listing:opacity-100 transition-opacity">
                                                        <X className="w-4 h-4" />
                                                    </button>

                                                    {/* Industry badge */}
                                                    <div className="mb-3">
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                            currentIndustry === 'automotive' ? 'bg-blue-100 text-blue-700' :
                                                            currentIndustry === 'real-estate' ? 'bg-emerald-100 text-emerald-700' :
                                                            currentIndustry === 'clothing' ? 'bg-pink-100 text-pink-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {currentIndustry === 'automotive' ? '🚗 Automotive' :
                                                             currentIndustry === 'real-estate' ? '🏠 Real Estate' :
                                                             currentIndustry === 'clothing' ? '👕 Clothing' : '📦 General'}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3 mb-3">
                                                        {/* Common: Reference */}
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Stock / Listing Ref</label>
                                                            <input
                                                                type="text" value={sl.reference || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'reference', e.target.value)}
                                                                placeholder="#REF-123" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 font-mono"
                                                            />
                                                        </div>

                                                        {/* ═══ AUTOMOTIVE FIELDS ═══ */}
                                                        {currentIndustry === 'automotive' && (
                                                            <>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Listing Name / Vehicle</label>
                                                                        <input type="text" value={sl.name || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'name', e.target.value)}
                                                                            placeholder="e.g. BMW M4 Competition" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Vehicle Category</label>
                                                                        <select value={sl.vehicleType || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'vehicleType', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {VEHICLE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Price (€)</label>
                                                                        <input type="number" value={sl.price || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'price', e.target.value)}
                                                                            placeholder="0" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Year</label>
                                                                        <input type="number" value={sl.year || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'year', e.target.value)}
                                                                            placeholder="2024" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Mileage (km)</label>
                                                                        <input type="number" value={sl.mileage || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'mileage', e.target.value)}
                                                                            placeholder="50000" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Fuel Type</label>
                                                                        <select value={sl.fuelType || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'fuelType', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {FUEL_TYPES.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* ═══ REAL ESTATE FIELDS ═══ */}
                                                        {currentIndustry === 'real-estate' && (
                                                            <>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Property Title</label>
                                                                        <input type="text" value={sl.name || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'name', e.target.value)}
                                                                            placeholder="e.g. 3-Bed Apartment Paris 16th" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Property Type</label>
                                                                        <select value={sl.propertyType || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'propertyType', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {PROPERTY_TYPES.map(pt => <option key={pt.id} value={pt.id}>{pt.label}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Listing Type</label>
                                                                        <select value={sl.listingType || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'listingType', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {PROPERTY_LISTING_TYPES.map(lt => <option key={lt.id} value={lt.id}>{lt.label}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Condition</label>
                                                                        <select value={sl.propertyCondition || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'propertyCondition', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {PROPERTY_CONDITIONS.map(pc => <option key={pc} value={pc}>{pc}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Price (€)</label>
                                                                        <input type="number" value={sl.price || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'price', e.target.value)}
                                                                            placeholder="350000" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Surface (m²)</label>
                                                                        <input type="number" value={sl.surface || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'surface', e.target.value)}
                                                                            placeholder="85" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Year Built</label>
                                                                        <input type="number" value={sl.yearBuilt || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'yearBuilt', e.target.value)}
                                                                            placeholder="2020" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Bedrooms</label>
                                                                        <input type="number" value={sl.bedrooms || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'bedrooms', e.target.value)}
                                                                            placeholder="3" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Bathrooms</label>
                                                                        <input type="number" value={sl.bathrooms || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'bathrooms', e.target.value)}
                                                                            placeholder="2" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Floor</label>
                                                                        <input type="number" value={sl.floor || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'floor', e.target.value)}
                                                                            placeholder="3" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Energy Rating</label>
                                                                        <select value={sl.energyRating || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'energyRating', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {ENERGY_RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Property Address</label>
                                                                        <input type="text" value={sl.propertyAddress || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'propertyAddress', e.target.value)}
                                                                            placeholder="123 Rue de la Paix, Paris" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Amenities</label>
                                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                                        {PROPERTY_AMENITIES.map(amenity => {
                                                                            const selected = (sl.amenities || []).includes(amenity);
                                                                            return (
                                                                                <button key={amenity} type="button"
                                                                                    onClick={() => {
                                                                                        const current = sl.amenities || [];
                                                                                        const updated = selected ? current.filter(a => a !== amenity) : [...current, amenity];
                                                                                        handleStockListingChange(ap.id, sl.id, 'amenities', updated);
                                                                                    }}
                                                                                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold border transition-all ${selected ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'}`}
                                                                                >
                                                                                    {amenity}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* ═══ CLOTHING FIELDS ═══ */}
                                                        {currentIndustry === 'clothing' && (
                                                            <>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Item Name</label>
                                                                        <input type="text" value={sl.name || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'name', e.target.value)}
                                                                            placeholder="e.g. Nike Air Max 90 White" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Category</label>
                                                                        <select value={sl.clothingCategory || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'clothingCategory', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {CLOTHING_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Brand</label>
                                                                        <select value={sl.brand || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'brand', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {CLOTHING_BRANDS_POPULAR.map(b => <option key={b} value={b}>{b}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Condition</label>
                                                                        <select value={sl.clothingCondition || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'clothingCondition', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {CLOTHING_CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Size</label>
                                                                        <select value={sl.size || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'size', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {CLOTHING_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Gender</label>
                                                                        <select value={sl.gender || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'gender', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {CLOTHING_GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Price (€)</label>
                                                                        <input type="number" value={sl.price || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'price', e.target.value)}
                                                                            placeholder="49.99" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Material</label>
                                                                        <select value={sl.material || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'material', e.target.value)}
                                                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 bg-white">
                                                                            <option value="">Select...</option>
                                                                            {CLOTHING_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Color</label>
                                                                        <input type="text" value={sl.color || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'color', e.target.value)}
                                                                            placeholder="e.g. Black, White" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Original Price (€) <span className="text-gray-300 normal-case">(optional, for comparison)</span></label>
                                                                    <input type="number" value={sl.originalPrice || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'originalPrice', e.target.value)}
                                                                        placeholder="99.99" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* ═══ GENERIC / NO INDUSTRY FIELDS ═══ */}
                                                        {!currentIndustry && (
                                                            <>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Listing Name</label>
                                                                        <input type="text" value={sl.name || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'name', e.target.value)}
                                                                            placeholder="Item name" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Price (€)</label>
                                                                        <input type="number" value={sl.price || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'price', e.target.value)}
                                                                            placeholder="0" className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
                                                                    </div>
                                                                </div>
                                                                <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                                                                    <p className="text-[9px] text-amber-700 font-bold">💡 Select a Business Type (Automotive, Real Estate, or Clothing) above to get industry-specific fields.</p>
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* Common fields: URL, Description */}
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Listing URL</label>
                                                            <input
                                                                type="url" value={sl.url} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'url', e.target.value)}
                                                                placeholder="https://..." className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Ad Description</label>
                                                            <textarea
                                                                value={sl.description || ''} onChange={(e) => handleStockListingChange(ap.id, sl.id, 'description', e.target.value)}
                                                                placeholder="Describe the listing..." className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500 h-20 resize-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-[9px] font-bold text-gray-400 uppercase">Image URLs (one per line)</label>
                                                        <textarea
                                                            value={Array.isArray(sl.imageUrls) ? sl.imageUrls.join('\n') : ''}
                                                            onChange={(e) => handleStockListingChange(ap.id, sl.id, 'imageUrls', e.target.value.split('\n'))}
                                                            placeholder="Paste multiple URLs here..."
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[10px] outline-none focus:border-indigo-500 font-mono h-24 resize-none bg-white"
                                                        />
                                                    </div>
                                                </div>
                                                );
                                            })}

                                            {(!ap.stockListings || ap.stockListings.length === 0) && (
                                                <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                    <p className="text-xs text-gray-400">Click "+ Add Stock Listing" to begin feeding data for this profile.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {formData.announcementProfiles.length === 0 && (
                            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Megaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">No announcement profiles added.</p>
                                <button type="button" onClick={handleAddAnnouncementProfile} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Add your first profile now</button>
                            </div>
                        )}
                    </div>
                </section>

                {/* 7. Extras: Logos & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logos */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-indigo-600" /> Logos
                            </h3>
                            <button type="button" onClick={handleAddLogo} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Logo</button>
                        </div>
                        <div className="space-y-3">
                            {formData.logoHistory.map((logo) => (
                                <div key={logo.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl group/logo">
                                    <img src={logo.imageUrl} alt="Logo" className="w-12 h-12 object-contain bg-white rounded border border-gray-100" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{logo.version || logo.name}</p>
                                        <button type="button" onClick={() => handleSetCurrentLogo(logo.id)} className={`text-xs ${logo.isCurrent ? 'text-green-600 font-bold' : 'text-gray-400 hover:text-indigo-600'}`}>
                                            {logo.isCurrent ? 'Current Logo' : 'Set as Current'}
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => handleEditLogo(logo.id)} className="p-2 text-gray-400 hover:text-indigo-600"><Edit className="w-5 h-5" /></button>
                                        <button type="button" onClick={() => handleDeleteLogo(logo.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                            {formData.logoHistory.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No logos uploaded.</p>}
                        </div>
                    </section>

                    {/* Notes */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> Notes
                            </h3>
                            <button type="button" onClick={handleAddNote} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Note</button>
                        </div>
                        <div className="space-y-3">
                            {formData.notes.map((note) => (
                                <div key={note.id} className="p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start justify-between">
                                    <p className="text-sm text-yellow-900">{note.text}</p>
                                    <button type="button" onClick={() => handleDeleteNote(note.id)} className="p-1 text-yellow-400 hover:text-yellow-700"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                            {formData.notes.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No notes added.</p>}
                        </div>
                    </section>
                </div>

                {/* Footer Buttons */}
                <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-200 p-4 shadow-2xl z-40">
                    <div className="max-w-5xl mx-auto flex gap-4">
                        <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">
                            <Save className="w-6 h-6" /> {initialData ? 'Update Record' : 'Create Record'}
                        </button>
                        <button type="button" onClick={onCancel} className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SellingPointForm;
