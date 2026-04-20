import React, { useState, useEffect } from 'react';
import {
    Search, Trash2, ExternalLink, Eye, Globe,
    Settings, X, Palette, Type, Layout, Save,
    Building2, MapPin, Phone, EyeOff, Link, Trash, Calendar
} from 'lucide-react';
import { INDUSTRY_MAP } from '../../data/constants';

const SettingsModal = ({ editingSite, setEditingSite, customTemplates, sellingPoints, overrides, setOverrides, handlePublish, handleUnpublish, handleDelete, handleSaveSettings }) => {
    if (!editingSite) return null;
    const template = customTemplates.find(t => String(t.id) === String(editingSite.templateId));
    const sp = sellingPoints.find(p => String(p.id) === String(editingSite.sellingPointId));

    let industry = sp ? (INDUSTRY_MAP[sp.businessType] || sp.industry) : null;
    
    // Robust fallback heuristic
    if (!industry && sp) {
        const text = `${sp.name} ${sp.businessType || ''}`.toLowerCase();
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Website Settings</h2>
                        <p className="text-sm text-gray-500">{sp?.name || 'Unknown'}</p>
                    </div>
                    <button onClick={() => setEditingSite(null)} className="p-2 hover:bg-white rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Status & Template Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                            <div className="flex items-center gap-3">
                                <Layout className="w-5 h-5 text-indigo-600" />
                                <div>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Active Template</p>
                                    <p className="text-sm font-semibold text-gray-900">{template?.name || 'Custom'}</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase">Published</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Change Template</label>
                            <div className="grid grid-cols-2 gap-3">
                                {availableTemplates.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setEditingSite({ ...editingSite, templateId: t.id })}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${editingSite.templateId === t.id
                                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <p className={`text-xs font-bold ${editingSite.templateId === t.id ? 'text-indigo-600' : 'text-gray-900'}`}>{t.name}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{t.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hero Section Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Hero Configuration
                        </h3>
                        <div className="grid grid-cols-1 gap-4 bg-gray-50/80 p-5 rounded-xl border border-gray-100">
                            {/* Hero Title */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Hero Title</label>
                                <input
                                    type="text"
                                    value={overrides.heroTitle || ''}
                                    onChange={(e) => setOverrides({ ...overrides, heroTitle: e.target.value })}
                                    placeholder="e.g. Premium Used Cars"
                                    className="w-full mt-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors font-medium"
                                />
                            </div>
                            {/* Hero Subtitle */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Hero Subtitle</label>
                                <input
                                    type="text"
                                    value={overrides.heroSubtitle || ''}
                                    onChange={(e) => setOverrides({ ...overrides, heroSubtitle: e.target.value })}
                                    placeholder="e.g. Best deals in town"
                                    className="w-full mt-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                                />
                            </div>
                            {/* Hero Description */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Hero Description</label>
                                <textarea
                                    value={overrides.heroDescription || ''}
                                    onChange={(e) => setOverrides({ ...overrides, heroDescription: e.target.value })}
                                    placeholder="Detailed description..."
                                    className="w-full mt-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors min-h-[80px]"
                                />
                            </div>
                            {/* Hero Image */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 ml-1 uppercase">Hero Image</label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={overrides.heroImage || ''}
                                        onChange={(e) => setOverrides({ ...overrides, heroImage: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                                    />
                                    <button className="px-4 py-2 bg-gray-100 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-200 hover:border-gray-300 transition-all text-xs uppercase">
                                        Upload
                                    </button>
                                </div>
                                {overrides.heroImage && (
                                    <div className="mt-3 h-40 w-full rounded-xl bg-gray-100 overflow-hidden border-2 border-gray-200 relative group shadow-sm">
                                        <img src={overrides.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-bold text-xs uppercase">Preview</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Type className="w-4 h-4" /> Content Customization
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            {template?.variables?.map(variable => (
                                <div key={variable.key} className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 ml-1">{variable.label}</label>
                                    {variable.type === 'color' ? (
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                className="w-12 h-10 rounded-lg cursor-pointer border-0 p-0"
                                                value={overrides[variable.key] || variable.default}
                                                onChange={(e) => setOverrides({ ...overrides, [variable.key]: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
                                                value={overrides[variable.key] || variable.default}
                                                onChange={(e) => setOverrides({ ...overrides, [variable.key]: e.target.value })}
                                            />
                                        </div>
                                    ) : variable.type === 'textarea' ? (
                                        <textarea
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            placeholder={variable.default}
                                            value={overrides[variable.key] || ''}
                                            onChange={(e) => setOverrides({ ...overrides, [variable.key]: e.target.value })}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            placeholder={variable.default}
                                            value={overrides[variable.key] || ''}
                                            onChange={(e) => setOverrides({ ...overrides, [variable.key]: e.target.value })}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions in Modal */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                        {editingSite.isActive !== false ? (
                            <button
                                onClick={() => window.open(`/?view=${template?.view || 'custom-template'}&id=${editingSite.id}`, '_blank')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200"
                            >
                                <Eye className="w-5 h-5" /> Live Minisite Demo
                            </button>
                        ) : (
                            <button
                                onClick={() => handlePublish(editingSite)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
                            >
                                <Globe className="w-5 h-5" /> Re-publish Site
                            </button>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleUnpublish(editingSite)}
                                disabled={editingSite.isActive === false}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-bold hover:bg-orange-100 transition-all disabled:opacity-50"
                            >
                                <EyeOff className="w-4 h-4" /> {editingSite.isActive === false ? 'Already Private' : 'Unpublish'}
                            </button>
                            <button
                                onClick={() => { handleDelete(editingSite.id); setEditingSite(null); }}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                            >
                                <Trash className="w-4 h-4" /> Wipe Entirely
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={() => setEditingSite(null)} className="px-6 py-2.5 text-gray-600 font-bold hover:text-gray-900 transition-colors">Discard</button>
                    <button
                        onClick={handleSaveSettings}
                        className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-100"
                    >
                        <Save className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const MinisiteDashboard = ({
    minisites = [],
    onNavigate,
    onDelete,
    onUpdate,
    customTemplates = [],
    sellingPoints = [],
    viewParams = {}
}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [editingSite, setEditingSite] = useState(null);
    const [overrides, setOverrides] = useState({});

    useEffect(() => {
        if (viewParams.editId && minisites.length > 0) {
            const site = minisites.find(m => String(m.id) === String(viewParams.editId));
            if (site) {
                setEditingSite(site);
                setOverrides(site.overrides || {});
            }
        }
    }, [viewParams.editId, minisites]);

    // Filtering & Sorting
    const filteredSites = minisites
        .filter(site => {
            const sp = sellingPoints.find(p => String(p.id) === String(site.sellingPointId));
            const nameMatch = sp?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const domainMatch = site.domain.toLowerCase().includes(searchTerm.toLowerCase());

            const isActive = site.isActive !== false;
            const statusMatch = statusFilter === 'all' ||
                (statusFilter === 'live' && isActive) ||
                (statusFilter === 'offline' && !isActive);

            return (nameMatch || domainMatch) && statusMatch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.publishedAt || 0);
            const dateB = new Date(b.publishedAt || 0);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    const handleOpenSettings = (site) => {
        setEditingSite(site);
        setOverrides(site.overrides || {});
    };

    const handleSaveSettings = () => {
        onUpdate({ ...editingSite, overrides });
        setEditingSite(null);
    };

    const handleUnpublish = (site) => {
        if (window.confirm("Are you sure you want to unpublish? The site will no longer be accessible but settings will be saved.")) {
            onUpdate({ ...site, isActive: false });
        }
    };

    const handlePublish = (site) => {
        onUpdate({ ...site, isActive: true });
    };

    const handleDelete = (id) => {
        if (window.confirm("CRITICAL: Delete this minisite permanently? This wipes all custom settings for this website.")) {
            onDelete(id);
        }
    };



    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
            <SettingsModal
                editingSite={editingSite}
                setEditingSite={setEditingSite}
                customTemplates={customTemplates}
                sellingPoints={sellingPoints}
                overrides={overrides}
                setOverrides={setOverrides}
                handlePublish={handlePublish}
                handleUnpublish={handleUnpublish}
                handleDelete={handleDelete}
                handleSaveSettings={handleSaveSettings}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Published Minisites</h2>
                    <p className="text-gray-500 mt-2 font-medium">Manage your active websites and their custom content</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="flex-1 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center pr-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by business name or domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:ring-0 text-lg font-medium placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center px-4 gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-transparent border-0 focus:ring-0 text-sm font-bold text-gray-700 cursor-pointer"
                    >
                        <option value="all">All Sites</option>
                        <option value="live">Live Only</option>
                        <option value="offline">Offline Only</option>
                    </select>
                </div>

                {/* Date Sort */}
                <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center px-4 gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Sort by:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-transparent border-0 focus:ring-0 text-sm font-bold text-gray-700 cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSites.length > 0 ? (
                    filteredSites.map((site) => {
                        const template = customTemplates.find(t => String(t.id) === String(site.templateId));
                        const sp = sellingPoints.find(p => String(p.id) === String(site.sellingPointId));

                        const isActive = site.isActive !== false;

                        return (
                            <div key={site.id} className={`group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all overflow-hidden flex flex-col ${!isActive ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                                {/* Card Body */}
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'} rounded-xl flex items-center justify-center`}>
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        {isActive ? (
                                            <div className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-200">
                                                LIVE
                                            </div>
                                        ) : (
                                            <div className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200">
                                                OFFLINE
                                            </div>
                                        )}
                                    </div>

                                    <h3 className={`font-bold text-gray-900 text-xl mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate ${!isActive ? 'text-gray-500' : ''}`}>
                                        {sp?.name || 'Unknown Business'}
                                    </h3>
                                    <a
                                        href={`/?view=${template?.view || 'custom-template'}&id=${site.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-600 text-xs font-mono truncate mb-2 flex items-center gap-1 group/link"
                                    >
                                        <Link className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                                        {template?.view}

                                    </a>

                                    <div className="flex flex-col gap-1 mb-4">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Added: {new Date(site.createdAt || site.id).toLocaleDateString()}
                                        </p>
                                        {site.publishedAt && (
                                            <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Published: {new Date(site.publishedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Building2 className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{sp?.businessType || 'Website'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Layout className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{template?.name || 'Custom Template'}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100 mt-2 grid grid-cols-2 gap-2">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Minisite ID: <span className="text-gray-900">#{site.id}</span></div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">SellingPt ID: <span className="text-gray-900">#{site.sellingPointId}</span></div>
                                        </div>
                                        <button
                                            onClick={() => onNavigate('selling-point-detail', { id: site.sellingPointId })}
                                            className="w-full mt-2 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                                        >
                                            <Link className="w-3 h-3" /> View Selling Point Data
                                        </button>
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleOpenSettings(site)}
                                        className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                                    >
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>
                                    <button
                                        onClick={() => window.open(`/?view=${template?.view || 'custom-template'}&id=${site.id}`, '_blank')}
                                        className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" /> View Site
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Globe className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 italic">No published minisites found</h3>
                        <p className="text-gray-400 mt-2">Publish a minisite from the Selling Point detail view to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MinisiteDashboard;
