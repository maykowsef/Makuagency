import React, { useState, useEffect } from 'react';
import {
    X, Bot, Sparkles, GitMerge, AlertTriangle, Eye, Globe,
    Building2, Search, AlertCircle, Calendar, Clock
} from 'lucide-react';
import { 
    ANNOUNCEMENT_SITES, ANNOUNCEMENT_TYPES, COUNTRIES, BUSINESS_TYPES, FUEL_TYPES, VEHICLE_TYPES, INDUSTRY_MAP,
    PROPERTY_TYPES, PROPERTY_CONDITIONS, PROPERTY_LISTING_TYPES, PROPERTY_AMENITIES, ENERGY_RATINGS,
    CLOTHING_CATEGORIES, CLOTHING_CONDITIONS, CLOTHING_SIZES, CLOTHING_GENDERS, CLOTHING_MATERIALS, CLOTHING_BRANDS_POPULAR
} from '../../../data/constants';
import CompanySelector from './CompanySelector';

export const AIModal = ({ isOpen, onClose, sp }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Bot className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
                                <p className="text-sm text-gray-500">Suggest changes and confirm</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-2">AI Suggestions</h3>
                                    <div className="space-y-3">
                                        <div className="bg-white border border-purple-200 rounded p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Phone Number Format</span>
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Low Priority</span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Current: <span className="font-mono text-red-600">+33 1 42 86 82 00</span></p>
                                                <p>Suggested: <span className="font-mono text-green-600">+33 (1) 42 86 82 00</span></p>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <button className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">Apply</button>
                                                <button className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Dismiss</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Apply All & Close</button>
                            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DeduplicateModal = ({ isOpen, onClose, sp }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <GitMerge className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Potential Duplicates Found</h2>
                                <p className="text-sm text-gray-500">Review and merge duplicates</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-orange-900">{sp.duplicateCheck.duplicateChance}% chance of duplicates detected</p>
                                <p className="text-xs text-orange-700 mt-1">AI found {sp.duplicateCheck.potentialDuplicates?.length || 0} potential duplicates</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {sp.duplicateCheck.potentialDuplicates?.map((duplicate) => (
                            <div key={duplicate.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{duplicate.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${duplicate.similarity >= 80 ? 'bg-red-100 text-red-800' : duplicate.similarity >= 60 ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>{duplicate.similarity}% Match</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {duplicate.matchingFields?.map((field, idx) => (
                                                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{field}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">ID: #{duplicate.id}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Current Selling Point</p>
                                        <div className="text-sm space-y-1">
                                            <p><strong>Name:</strong> {sp.name}</p>
                                            <p><strong>Address:</strong> {sp.address1}</p>
                                            <p><strong>Phone:</strong> {sp.phones?.[0]?.number}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">Potential Duplicate</p>
                                        <div className="text-sm space-y-1">
                                            <p><strong>Name:</strong> {duplicate.name}</p>
                                            <p><strong>Address:</strong> {duplicate.address || 'N/A'}</p>
                                            <p><strong>Phone:</strong> {duplicate.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm flex items-center justify-center gap-2">
                                        <GitMerge className="w-4 h-4" />Merge with This
                                    </button>
                                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Not a Duplicate</button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"><Eye className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Done Reviewing</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Mark All as Not Duplicates</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PublishModal = ({ isOpen, onClose, customTemplates, localSellingPoint, onPublish }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    if (!isOpen) return null;

    let industry = localSellingPoint ? (INDUSTRY_MAP[localSellingPoint.businessType] || localSellingPoint.industry) : null;
    
    // Robust fallback regex heuristic if it's unmapped or slightly mistyped
    if (!industry && localSellingPoint) {
        const text = `${localSellingPoint.name} ${localSellingPoint.businessType || ''}`.toLowerCase();
        if (text.includes('car') || text.includes('auto') || text.includes('motor')) industry = 'automotive';
        else if (text.includes('real estate') || text.includes('property') || text.includes('apart')) industry = 'real-estate';
        else if (text.includes('cloth') || text.includes('fashion') || text.includes('boutique')) industry = 'clothing';
    }

    const availableTemplates = customTemplates.filter(t => {
        if (!industry) return true;
        if (industry === 'automotive' && t.id.startsWith('car-dealer-')) return true;
        if (industry === 'real-estate' && t.id.startsWith('real-estate-')) return true;
        if (industry === 'clothing' && t.id.startsWith('clothing-')) return true;
        return false;
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Publish as Minisite</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-600 mb-6">Choose a template to publish website for <strong>{localSellingPoint.name}</strong>:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {availableTemplates.map(template => (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedTemplate?.id === template.id
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-gray-100 hover:border-indigo-200'
                                    }`}
                            >
                                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 mb-3 flex items-center justify-center">
                                    <Globe className={`w-8 h-8 ${selectedTemplate?.id === template.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">{template.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium">Cancel</button>
                    <button
                        onClick={() => onPublish(selectedTemplate)}
                        disabled={!selectedTemplate}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Publish Website
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GenericModal = ({ isOpen, onClose, title, data, type, onSave, companies, sp }) => {
    const [formData, setFormData] = useState(data || {});
    const currentIndustry = sp ? (INDUSTRY_MAP[sp.businessType] || sp.industry) : null;

    useEffect(() => {
        const initialData = data || {};
        if (type === 'stockListing') {
            if (!Array.isArray(initialData.imageUrls)) {
                initialData.imageUrls = initialData.imageUrls ? [initialData.imageUrls] : [];
            }
            if (typeof initialData.description === 'object') {
                initialData.description = initialData.description.text || '';
            }
        }
        setFormData(initialData);
    }, [data, isOpen, type]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanData = { ...formData };
        if (type === 'stockListing' && Array.isArray(cleanData.imageUrls)) {
            cleanData.imageUrls = cleanData.imageUrls.filter(u => u.trim() !== '');
        }
        onSave(cleanData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose}><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {type === 'description' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="text"
                                value={formData.text || ''}
                                onChange={handleChange}
                                className="w-full border p-2 rounded min-h-[150px]"
                                required
                            />
                        </div>
                    )}

                    {type === 'basic' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Business Name <span className="text-red-500">*</span></label>
                                    <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                                <div className="col-span-2">
                                    <CompanySelector
                                        value={formData.companyName}
                                        companyId={formData.companyId}
                                        onChange={({ companyId, companyName }) => setFormData(prev => ({ ...prev, companyId, companyName }))}
                                        companies={companies}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SIRET Number</label>
                                    <input name="siret" value={formData.siret || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Business Type <span className="text-red-500">*</span></label>
                                    <select name="businessType" value={formData.businessType || ''} onChange={handleChange} className="w-full border p-2 rounded" required>
                                        <option value="">Select Type</option>
                                        {BUSINESS_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Employees</label>
                                    <input name="employees" value={formData.employees || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Founded</label>
                                    <input name="founded" value={formData.founded || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select name="status" value={formData.status || 'Active'} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Permanently Closed">Permanently Closed</option>
                                </select>
                            </div>
                        </>
                    )}

                    {type === 'address' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                                <input name="address1" value={formData.address1 || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                                <input name="address2" value={formData.address2 || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address Line 3</label>
                                <input name="address3" value={formData.address3 || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                                    <input name="postalCode" value={formData.postalCode || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input name="city" value={formData.city || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Region</label>
                                    <input name="region" value={formData.region || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Country</label>
                                    <select name="country" value={formData.country || ''} onChange={handleChange} className="w-full border p-2 rounded" required>
                                        <option value="">Select Country</option>
                                        {COUNTRIES.map(country => (
                                            <option key={country.code} value={country.name}>{country.flag} {country.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {type === 'note' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Note</label>
                            <textarea
                                name="text"
                                value={formData.text || ''}
                                onChange={handleChange}
                                className="w-full border p-2 rounded min-h-[100px]"
                                required
                            />
                        </div>
                    )}

                    {type === 'phones' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <input name="number" value={formData.number || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select name="type" value={formData.type || 'Main'} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="Main">Main</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Fax">Fax</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isPrimary" checked={formData.isPrimary || false} onChange={handleChange} />
                                <label className="text-sm">Primary Number</label>
                            </div>
                        </>
                    )}

                    {type === 'emails' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select name="type" value={formData.type || 'Main'} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="Main">Main</option>
                                    <option value="Support">Support</option>
                                    <option value="Billing">Billing</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isPrimary" checked={formData.isPrimary || false} onChange={handleChange} />
                                <label className="text-sm">Primary Email</label>
                            </div>
                        </>
                    )}

                    {type === 'social' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Platform</label>
                                <select name="platform" value={formData.platform || 'Facebook'} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="Facebook">Facebook</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="YouTube">YouTube</option>
                                    <option value="Website">Website</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL</label>
                                <input type="url" name="url" value={formData.url || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Followers (approx)</label>
                                <input type="text" name="followers" value={formData.followers || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isPrimary" checked={formData.isPrimary || false} onChange={handleChange} />
                                <label className="text-sm">Primary Profile</label>
                            </div>
                        </>
                    )}

                    {type === 'announcements' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Announcement Site <span className="text-red-500">*</span></label>
                                <select name="siteId" value={formData.siteId || ''} onChange={handleChange} className="w-full border p-2 rounded" required>
                                    <option value="">Select Site</option>
                                    {ANNOUNCEMENT_SITES.map(site => (
                                        <option key={site.id} value={site.id}>{site.icon} {site.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Profile URL <span className="text-red-500">*</span></label>
                                <input type="url" name="url" value={formData.url || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://..." required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select name="type" value={formData.type || 'Listing'} onChange={handleChange} className="w-full border p-2 rounded">
                                        {ANNOUNCEMENT_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Target Listings <span className="text-red-500">*</span></label>
                                    <input type="number" name="targetListings" value={formData.targetListings || ''} onChange={handleChange} className="w-full border p-2 rounded" min="0" placeholder="50" required />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <input type="checkbox" name="isPrimary" checked={formData.isPrimary || false} onChange={handleChange} className="w-4 h-4" />
                                <label className="text-sm font-medium text-indigo-900">Set as Primary Announcement Profile</label>
                            </div>
                        </>
                    )}

                    {type === 'stockListing' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Stock / Listing Ref</label>
                                <input name="reference" value={formData.reference || ''} onChange={handleChange} className="w-full border p-2 rounded font-mono" placeholder="#REF-123" />
                            </div>

                            {/* ═══ AUTOMOTIVE FIELDS ═══ */}
                            {currentIndustry === 'automotive' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Vehicle Name</label>
                                            <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Vehicle Category</label>
                                            <select name="vehicleType" value={formData.vehicleType || ''} onChange={handleChange} className="w-full border p-2 rounded" required>
                                                <option value="">Select Category</option>
                                                {VEHICLE_TYPES.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Price (€)</label>
                                            <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Year</label>
                                            <input name="year" type="number" value={formData.year || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                                            <input name="mileage" type="number" value={formData.mileage || ''} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g. 50000" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Fuel Type</label>
                                            <select name="fuelType" value={formData.fuelType || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select Fuel</option>
                                                {FUEL_TYPES.map(fuel => (
                                                    <option key={fuel} value={fuel}>{fuel}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ═══ REAL ESTATE FIELDS ═══ */}
                            {currentIndustry === 'real-estate' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Property Title</label>
                                            <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Property Type</label>
                                            <select name="propertyType" value={formData.propertyType || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {PROPERTY_TYPES.map(pt => <option key={pt.id} value={pt.id}>{pt.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Listing Type</label>
                                            <select name="listingType" value={formData.listingType || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {PROPERTY_LISTING_TYPES.map(lt => <option key={lt.id} value={lt.id}>{lt.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Condition</label>
                                            <select name="propertyCondition" value={formData.propertyCondition || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {PROPERTY_CONDITIONS.map(pc => <option key={pc} value={pc}>{pc}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Price (€)</label>
                                            <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Surface (m²)</label>
                                            <input name="surface" type="number" value={formData.surface || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Year Built</label>
                                            <input name="yearBuilt" type="number" value={formData.yearBuilt || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Bedrooms</label>
                                            <input name="bedrooms" type="number" value={formData.bedrooms || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Bathrooms</label>
                                            <input name="bathrooms" type="number" value={formData.bathrooms || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Floor</label>
                                            <input name="floor" type="number" value={formData.floor || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Energy Rating</label>
                                            <select name="energyRating" value={formData.energyRating || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {ENERGY_RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Property Address</label>
                                            <input name="propertyAddress" value={formData.propertyAddress || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 mt-4">
                                        <label className="block text-sm font-medium mb-2">Amenities</label>
                                        <div className="flex flex-wrap gap-2">
                                            {PROPERTY_AMENITIES.map(amenity => {
                                                const selected = (formData.amenities || []).includes(amenity);
                                                return (
                                                    <button key={amenity} type="button"
                                                        onClick={() => {
                                                            const current = formData.amenities || [];
                                                            const updated = selected ? current.filter(a => a !== amenity) : [...current, amenity];
                                                            setFormData(prev => ({ ...prev, amenities: updated }));
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selected ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-emerald-300'}`}
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Item Name</label>
                                            <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Category</label>
                                            <select name="clothingCategory" value={formData.clothingCategory || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {CLOTHING_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Brand</label>
                                            <select name="brand" value={formData.brand || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {CLOTHING_BRANDS_POPULAR.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Condition</label>
                                            <select name="clothingCondition" value={formData.clothingCondition || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {CLOTHING_CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Size</label>
                                            <select name="size" value={formData.size || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {CLOTHING_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Gender</label>
                                            <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {CLOTHING_GENDERS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Price (€)</label>
                                            <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Material</label>
                                            <select name="material" value={formData.material || ''} onChange={handleChange} className="w-full border p-2 rounded">
                                                <option value="">Select...</option>
                                                {CLOTHING_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Color</label>
                                            <input name="color" value={formData.color || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium mb-1">Original Price (€) <span className="text-gray-400 font-normal">(optional)</span></label>
                                        <input name="originalPrice" type="number" value={formData.originalPrice || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                    </div>
                                </>
                            )}

                            {/* ═══ GENERIC FIELDS ═══ */}
                            {!currentIndustry && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Listing Name</label>
                                        <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price (€)</label>
                                        <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Ad URL</label>
                                <input name="url" type="url" value={formData.url || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Ad Description</label>
                                <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full border p-2 rounded h-24" placeholder="Describe the item..." />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Image URLs (one per line)</label>
                                <textarea
                                    name="imageUrls"
                                    value={Array.isArray(formData.imageUrls) ? formData.imageUrls.join('\n') : ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrls: e.target.value.split('\n') }))}
                                    className="w-full border p-2 rounded h-20 text-xs font-mono"
                                />
                            </div>
                        </>
                    )}

                    {type === 'logoHistory' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Logo URL</label>
                                <input name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="isCurrent" checked={formData.isCurrent || false} onChange={handleChange} />
                                <label className="text-sm">Set as current logo</label>
                            </div>
                        </>
                    )}

                    {type === 'single_field' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">{formData.label}</label>
                            {formData.field === 'status' ? (
                                <select name="value" value={formData.value || 'Active'} onChange={handleChange} className="w-full border p-2 rounded" autoFocus>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Permanently Closed">Permanently Closed</option>
                                </select>
                            ) : formData.field === 'businessType' ? (
                                <select name="value" value={formData.value || ''} onChange={handleChange} className="w-full border p-2 rounded" autoFocus required>
                                    <option value="">Select Business Type</option>
                                    {BUSINESS_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            ) : formData.field === 'priority' ? (
                                <select name="value" value={formData.value || 'Medium'} onChange={handleChange} className="w-full border p-2 rounded" autoFocus>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            ) : formData.field === 'company' ? (
                                <CompanySelector
                                    value={formData.companyName}
                                    companyId={formData.companyId}
                                    onChange={({ companyId, companyName }) => setFormData(prev => ({ ...prev, companyId, companyName }))}
                                    companies={companies}
                                />
                            ) : (
                                <input name="value" value={formData.value || ''} onChange={handleChange} className="w-full border p-2 rounded" autoFocus required />
                            )}
                        </div>
                    )}

                    {type === 'contacts' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">First Name</label>
                                    <input name="firstName" value={formData.firstName || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name</label>
                                    <input name="lastName" value={formData.lastName || ''} onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Position</label>
                                <input name="position" value={formData.position || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border p-2 rounded" />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ScheduleModal = ({ isOpen, onClose, sp, onSchedule, userData }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSchedule({
            date: `${date}T${time}:00`,
            sellingPointId: sp.id,
            sellingPointName: sp.name,
            scheduler: userData?.name || 'Unknown',
            schedulerId: userData?.id || 1,
            status: 'Pending',
            calls: [],
            rescheduleHistory: []
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Schedule Callback</h2>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Target Client</p>
                        <h3 className="font-bold text-indigo-900 text-lg">#{sp.id} - {sp.name}</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                Appointment Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                Appointment Time
                            </label>
                            <input
                                type="time"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                        >
                            Set Schedule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
