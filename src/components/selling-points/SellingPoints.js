import React, { useState } from 'react';
import {
    Search, Filter, Grid3x3, List, ChevronLeft, ChevronRight,
    MapPin, Building2, Phone, Mail, Globe, Image as ImageIcon,
    User, CheckCircle2, Calendar, Star, TrendingUp,
    FileText, Hash, Navigation, ArrowLeft,
    Eye, Trash2, FileSpreadsheet, X, Sparkles, Target, Clock, Briefcase,
    Flag, Check, Monitor
} from 'lucide-react';
import ExcelImportModal from '../common/ExcelImportModal';

const SellingPoints = ({ sellingPoints = [], onBack, onViewDetail, onAdd, onImport, initialFilters, openImport, onDelete, minisites = [], schedules = [] }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [showImportModal, setShowImportModal] = useState(!!openImport);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

    const [filters, setFilters] = useState({
        search: initialFilters?.name || '',
        country: initialFilters?.country || 'all',
        businessType: 'all',
        priority: 'all',
        status: 'all',
        completionMin: 0,
        completionMax: 100,
        hasWebsite: 'all',
        hasContact: 'all',
        hasPublishedMinisite: 'all',
        scheduleStatus: 'all'
    });

    // Helper functions
    const getPriorityColor = (priority) => {
        const colors = {
            'High': 'from-red-500 to-orange-500',
            'Medium': 'from-yellow-500 to-amber-500',
            'Low': 'from-green-500 to-emerald-500'
        };
        return colors[priority] || 'from-gray-500 to-gray-600';
    };

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-100 text-green-700 border-green-200',
            'Inactive': 'bg-gray-100 text-gray-700 border-gray-200',
            'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'New': 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getCompletionColor = (completion) => {
        if (completion === 100) return 'from-green-500 to-emerald-500';
        if (completion >= 75) return 'from-blue-500 to-cyan-500';
        if (completion >= 50) return 'from-yellow-500 to-orange-500';
        if (completion >= 25) return 'from-orange-500 to-red-500';
        return 'from-red-500 to-pink-500';
    };

    // Check if selling point has a published minisite
    const hasPublishedMinisite = (spId) => {
        return minisites.some(m => String(m.sellingPointId) === String(spId) && m.isActive === true);
    };

    // Calculate stock progress correctly - sum all stock listings across all announcement profiles
    const calculateStockProgress = (item) => {
        const announcementProfiles = item.announcementProfiles || [];
        const totalStockListings = announcementProfiles.reduce((sum, profile) => {
            return sum + (profile.stockListings?.length || 0);
        }, 0);
        const totalTarget = announcementProfiles.reduce((sum, profile) => {
            return sum + (parseInt(profile.targetListings) || 0);
        }, 0);

        return {
            total: totalStockListings,
            target: totalTarget,
            completion: totalTarget > 0 ? Math.round((totalStockListings / totalTarget) * 100) : 0
        };
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Advanced filtering logic
    const filteredItems = sellingPoints.filter(item => {
        // Smart Search - searches across multiple fields
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = !filters.search ||
            item.name?.toLowerCase().includes(searchLower) ||
            item.companyName?.toLowerCase().includes(searchLower) ||
            String(item.id).includes(searchLower) ||
            item.businessType?.toLowerCase().includes(searchLower) ||
            item.siret?.toLowerCase().includes(searchLower) ||
            item.email?.toLowerCase().includes(searchLower) ||
            item.address?.city?.toLowerCase().includes(searchLower) ||
            item.address?.street?.toLowerCase().includes(searchLower) ||
            item.address1?.toLowerCase().includes(searchLower);

        // Country Filter
        const matchesCountry = filters.country === 'all' ||
            item.address?.country?.toLowerCase().replace(' ', '-') === filters.country ||
            item.country?.toLowerCase().replace(' ', '-') === filters.country;

        // Business Type Filter
        const matchesBusinessType = filters.businessType === 'all' ||
            item.businessType?.toLowerCase().replace(/\s+/g, '-') === filters.businessType;

        // Priority Filter
        const matchesPriority = filters.priority === 'all' ||
            item.priority?.toLowerCase() === filters.priority;

        // Status Filter
        const matchesStatus = filters.status === 'all' ||
            item.status?.toLowerCase().replace(' ', '-') === filters.status;

        // Completion Filter
        const { completion } = calculateStockProgress(item);
        const matchesCompletion = completion >= filters.completionMin && completion <= filters.completionMax;

        // Website Filter
        const hasWebsite = !!item.website;
        const matchesWebsite = filters.hasWebsite === 'all' ||
            (filters.hasWebsite === 'yes' && hasWebsite) ||
            (filters.hasWebsite === 'no' && !hasWebsite);

        // Contact Filter
        const hasContact = (item.contacts?.length || 0) > 0;
        const matchesContact = filters.hasContact === 'all' ||
            (filters.hasContact === 'yes' && hasContact) ||
            (filters.hasContact === 'no' && !hasContact);

        // Published Minisite Filter
        const hasMinisite = hasPublishedMinisite(item.id);
        const matchesMinisite = filters.hasPublishedMinisite === 'all' ||
            (filters.hasPublishedMinisite === 'yes' && hasMinisite) ||
            (filters.hasPublishedMinisite === 'no' && !hasMinisite);

        // Schedule Filter
        const schedule = schedules.find(s => String(s.sellingPointId) === String(item.id));
        const matchesSchedule = filters.scheduleStatus === 'all' ||
            (filters.scheduleStatus === 'scheduled' && !!schedule) ||
            (filters.scheduleStatus === 'not-scheduled' && !schedule) ||
            (filters.scheduleStatus === 'pending' && schedule?.status === 'Pending') ||
            (filters.scheduleStatus === 'convinced' && schedule?.status === 'Convinced') ||
            (filters.scheduleStatus === 'not-convinced' && schedule?.status === 'Not Convinced');

        return matchesSearch && matchesCountry && matchesBusinessType &&
            matchesPriority && matchesStatus && matchesCompletion &&
            matchesWebsite && matchesContact && matchesMinisite && matchesSchedule;
    });

    // Derive unique filter options from data
    const countries = ['All Countries', ...new Set(sellingPoints.map(sp => sp.address?.country || sp.country).filter(Boolean))];
    const businessTypes = ['All Types', ...new Set(sellingPoints.map(sp => sp.businessType).filter(Boolean))];
    const priorityLevels = ['All Priorities', 'High', 'Medium', 'Low'];
    const statuses = ['All Statuses', 'Active', 'Inactive', 'Pending', 'New'];

    // Pagination
    const itemsPerPage = viewMode === 'grid' ? 12 : 8;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Selection functions
    const toggleSelection = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === currentItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(currentItems.map(item => item.id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selling point(s)?`)) {
            selectedItems.forEach(id => onDelete(id));
            setSelectedItems([]);
            setSelectMode(false);
        }
    };

    const GridCard = ({ item }) => {
        const { total, target, completion } = calculateStockProgress(item);
        const isSelected = selectedItems.includes(item.id);
        const hasMinisite = hasPublishedMinisite(item.id);

        // Get full address
        const address1 = item.address?.street || item.address1 || '';
        const address2 = item.address?.address2 || item.address2 || '';
        const postalCode = item.address?.postalCode || item.postalCode || '';
        const city = item.address?.city || item.city || '';
        const country = item.address?.country || item.country || '';

        const fullAddress = [address1, address2, postalCode, city, country].filter(Boolean).join(', ') || 'No address';

        return (
            <div
                onClick={() => !selectMode && onViewDetail(item.id)}
                className={`bg-white rounded-xl border-2 shadow-sm hover:shadow-2xl transition-all duration-300 p-4 cursor-pointer group overflow-hidden relative hover:-translate-y-1 h-full flex flex-col ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-100' :
                    item.website ? 'border-red-200' : 'border-gray-200'
                    } ${(item.website || hasMinisite) ? 'pt-10' : ''}`}
            >
                {/* Selection Checkbox - Top Right */}
                {selectMode && (
                    <div className="absolute top-2 right-2 z-30">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'bg-white border-gray-300 hover:border-indigo-400'
                                }`}
                        >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                    </div>
                )}

                {/* Flags Container - Top Left */}
                {(item.website || hasMinisite) && (
                    <div className="absolute top-0 left-0 z-20 flex gap-1 p-2">
                        {item.website && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-1" title="Has Website">
                                <Flag className="w-3 h-3" />
                                <span className="text-[9px] font-bold">WEB</span>
                            </div>
                        )}
                        {hasMinisite && (
                            <div className="bg-purple-500 text-white px-2 py-1 rounded-lg shadow-lg flex items-center gap-1" title="Has Published Minisite">
                                <Monitor className="w-3 h-3" />
                                <span className="text-[9px] font-bold">MINI</span>
                            </div>
                        )}
                    </div>
                )}



                {/* Corner gradient decoration */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${getPriorityColor(item.priority)} opacity-5 group-hover:opacity-10 transition-opacity rounded-bl-full`}></div>

                {/* Header */}
                <div className="flex items-start justify-between mb-3 relative">
                    <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate flex-1">
                                {item.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                            <Building2 className="w-3 h-3" />
                            <p className="truncate">{item.companyName}</p>
                        </div>
                    </div>

                    {/* Priority Badge */}
                    <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${getPriorityColor(item.priority)} text-white text-[10px] font-bold shadow-md flex-shrink-0`}>
                        {item.priority}
                    </div>
                </div>

                {/* Status, ID & Business Type Row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusColor(item.status)}`}>
                        {item.status || 'New'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">#{item.id}</span>
                    {item.businessType && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5" />
                            {item.businessType}
                        </span>
                    )}
                    {schedules.find(s => String(s.sellingPointId) === String(item.id)) && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Convinced' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Not Convinced' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                    'bg-amber-100 text-amber-700 border-amber-200'
                            }`}>
                            <Calendar className="w-2.5 h-2.5" />
                            {schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Pending' ? 'P' :
                                schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Convinced' ? 'C' : 'NC'}
                        </span>
                    )}
                </div>

                {/* Key Info Grid */}
                <div className="space-y-2 mb-3 text-xs">
                    <div className="flex items-start gap-1.5 text-gray-600">
                        <Hash className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="font-mono text-[11px] truncate">{item.siret || 'No SIRET'}</span>
                    </div>

                    <div className="flex items-start gap-1.5 text-gray-600">
                        <Navigation className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="truncate" title={fullAddress}>{fullAddress}</span>
                    </div>

                    <div className="flex items-start gap-1.5 text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="truncate">
                            {Array.isArray(item.phone)
                                ? item.phone.length > 0 ? item.phone[0].number : 'No phone'
                                : item.phone || item.phones?.[0]?.number || 'No phone'}
                        </span>
                    </div>
                </div>

                {/* Stock Progress */}
                <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <ImageIcon className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-700">Stock Progress</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-900">
                            {total} / {target}
                        </span>
                    </div>
                    {target > 0 ? (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${getCompletionColor(completion)} transition-all duration-500`}
                                style={{ width: `${Math.min(100, completion)}%` }}
                            ></div>
                        </div>
                    ) : (
                        <p className="text-[10px] text-gray-400 italic">No target set</p>
                    )}
                </div>

                {/* Last Modified Info */}
                {item.lastModified && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span className="text-[10px] font-bold text-blue-700">Last Modified</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-600 font-medium">{item.lastModified.name || 'Unknown'}</span>
                            <span className="text-gray-500">{formatDate(item.lastModified.date)}</span>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 flex-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{item.createdBy?.name || 'Unknown'}</span>
                    </div>
                    {!selectMode && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onViewDetail(item.id); }}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-[11px] font-bold flex items-center gap-1"
                        >
                            <Eye className="w-3 h-3" />
                            View
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const ListItem = ({ item }) => {
        const { total, target, completion } = calculateStockProgress(item);
        const isSelected = selectedItems.includes(item.id);
        const hasMinisite = hasPublishedMinisite(item.id);

        // Get full address
        const address1 = item.address?.street || item.address1 || '';
        const address2 = item.address?.address2 || item.address2 || '';
        const postalCode = item.address?.postalCode || item.postalCode || '';
        const city = item.address?.city || item.city || '';
        const country = item.address?.country || item.country || '';

        const fullAddress = [address1, address2, postalCode, city, country].filter(Boolean).join(', ') || 'No address';

        return (
            <div
                onClick={() => !selectMode && onViewDetail(item.id)}
                className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-100' :
                    item.website ? 'border-red-200' : 'border-gray-200'
                    }`}
            >
                <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    {selectMode && (
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected
                                ? 'bg-indigo-600 border-indigo-600'
                                : 'bg-white border-gray-300 hover:border-indigo-400'
                                }`}
                        >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                    )}

                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0 relative">
                        <MapPin className="w-6 h-6 text-white" />
                        {item.website && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full">
                                <Flag className="w-2.5 h-2.5" />
                            </div>
                        )}
                        {hasMinisite && (
                            <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white p-0.5 rounded-full">
                                <Monitor className="w-2.5 h-2.5" />
                            </div>
                        )}
                    </div>

                    {/* Main Content Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 min-w-0">
                        {/* Column 1: Basic Info */}
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate mb-1">
                                {item.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 truncate">
                                <Building2 className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{item.companyName}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] text-gray-400 font-mono">#{item.id}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusColor(item.status)}`}>
                                    {item.status || 'New'}
                                </span>
                                {schedules.find(s => String(s.sellingPointId) === String(item.id)) && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Convinced' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                            schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Not Convinced' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                                'bg-amber-100 text-amber-700 border-amber-200'
                                        }`}>
                                        <Calendar className="w-2.5 h-2.5" />
                                        {schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Pending' ? 'P' :
                                            schedules.find(s => String(s.sellingPointId) === String(item.id)).status === 'Convinced' ? 'C' : 'NC'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Contact & Business Type */}
                        <div className="min-w-0">
                            {item.businessType && (
                                <div className="mb-1.5">
                                    <p className="text-[10px] text-gray-500 font-bold mb-0.5">BUSINESS TYPE</p>
                                    <p className="text-xs text-gray-900 font-semibold truncate">{item.businessType}</p>
                                </div>
                            )}
                            <div className="mb-1">
                                <p className="text-[10px] text-gray-500 font-bold mb-0.5">SIRET</p>
                                <p className="text-xs text-gray-900 font-mono truncate">{item.siret || 'N/A'}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 truncate">
                                <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="truncate">
                                    {Array.isArray(item.phone)
                                        ? item.phone.length > 0 ? item.phone[0].number : 'No phone'
                                        : item.phone || item.phones?.[0]?.number || 'No phone'}
                                </span>
                            </div>
                        </div>

                        {/* Column 3: Full Address */}
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 font-bold mb-1">ADDRESS</p>
                            <p className="text-xs text-gray-900" title={fullAddress}>
                                {address1 && <span className="block truncate">{address1}</span>}
                                {address2 && <span className="block truncate text-gray-600">{address2}</span>}
                                <span className="block truncate font-semibold">{[postalCode, city].filter(Boolean).join(' ')}</span>
                                <span className="block truncate text-gray-600">{country}</span>
                            </p>
                        </div>

                        {/* Column 4: Progress & Modified */}
                        <div className="min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-gray-500 font-bold">STOCK</span>
                                <span className="text-[10px] font-bold text-gray-900">
                                    {total}/{target}
                                </span>
                            </div>
                            {target > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${getCompletionColor(completion)}`}
                                        style={{ width: `${Math.min(100, completion)}%` }}
                                    ></div>
                                </div>
                            )}
                            {item.lastModified && (
                                <div className="text-[10px] text-gray-500 mt-2">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <Clock className="w-2.5 h-2.5" />
                                        <span className="font-bold">Modified by:</span>
                                    </div>
                                    <p className="truncate">{item.lastModified.name}</p>
                                    <p className="text-gray-400">{formatDate(item.lastModified.date)}</p>
                                </div>
                            )}
                        </div>

                        {/* Column 5: Priority */}
                        <div className="min-w-0 flex flex-col justify-between">
                            <div className={`px-2 py-0.5 rounded-lg bg-gradient-to-r ${getPriorityColor(item.priority)} text-white text-[10px] font-bold inline-block text-center`}>
                                {item.priority}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {!selectMode && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); onViewDetail(item.id); }}
                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                title="View Details"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this Selling Point?')) onDelete(item.id);
                                }}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 text-gray-500 hover:text-red-600 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (key === 'search') return value !== '';
        if (key === 'completionMin') return value !== 0;
        if (key === 'completionMax') return value !== 100;
        return value !== 'all';
    }).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    Selling Points
                                    <Sparkles className="w-5 h-5 text-indigo-500" />
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {filteredItems.length} of {sellingPoints.length} selling points
                                    {activeFilterCount > 0 && ` • ${activeFilterCount} filters active`}
                                    {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Selection Mode Toggle */}
                            <button
                                onClick={() => {
                                    setSelectMode(!selectMode);
                                    setSelectedItems([]);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold ${selectMode
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300'
                                    }`}
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                {selectMode ? 'Exit Select' : 'Select'}
                            </button>

                            {/* Bulk Delete - Only show in select mode */}
                            {selectMode && selectedItems.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg font-bold"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete ({selectedItems.length})
                                </button>
                            )}

                            {!selectMode && (
                                <>
                                    <button
                                        onClick={onAdd}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-bold"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                                        Add New
                                    </button>

                                    <button
                                        onClick={() => setShowImportModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg font-bold"
                                    >
                                        <FileSpreadsheet className="w-5 h-5" />
                                        Import Data
                                    </button>
                                </>
                            )}

                            {/* View Toggle */}
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                                        ? 'bg-white text-indigo-600 shadow-md scale-105'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                                        ? 'bg-white text-indigo-600 shadow-md scale-105'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Select All (only in select mode) */}
                    {selectMode && (
                        <div className="mb-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <button
                                onClick={toggleSelectAll}
                                className="flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
                            >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedItems.length === currentItems.length
                                    ? 'bg-indigo-600 border-indigo-600'
                                    : 'bg-white border-indigo-400'
                                    }`}>
                                    {selectedItems.length === currentItems.length && <Check className="w-3 h-3 text-white" />}
                                </div>
                                {selectedItems.length === currentItems.length ? 'Deselect All' : 'Select All'} on this page
                            </button>
                        </div>
                    )}

                    {/* Search & Quick Filters */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
                        {/* Search */}
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Smart search: name, company, SIRET, city..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters({ ...filters, search: '' })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Country Filter */}
                        <select
                            value={filters.country}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        >
                            {countries.map((country) => (
                                <option key={country} value={country.toLowerCase().replace(' ', '-')}>
                                    {country}
                                </option>
                            ))}
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        {/* Schedule Filter */}
                        <select
                            value={filters.scheduleStatus}
                            onChange={(e) => setFilters({ ...filters, scheduleStatus: e.target.value })}
                            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        >
                            <option value="all">All Schedules</option>
                            <option value="scheduled">Scheduled Only</option>
                            <option value="not-scheduled">Not Scheduled</option>
                            <option value="pending">Status: Pending (P)</option>
                            <option value="convinced">Status: Convinced (C)</option>
                            <option value="not-convinced">Status: Not Convinced (NC)</option>
                        </select>

                        {/* Advanced Filters Toggle */}
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-bold ${showAdvancedFilters
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            {showAdvancedFilters ? 'Hide' : 'More'} Filters
                            {activeFilterCount > 0 && (
                                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showAdvancedFilters && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 space-y-3 animate-slideDown">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {/* Business Type */}
                                <select
                                    value={filters.businessType}
                                    onChange={(e) => setFilters({ ...filters, businessType: e.target.value })}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    {businessTypes.map((type) => (
                                        <option key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                                            {type}
                                        </option>
                                    ))}
                                </select>

                                {/* Status */}
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status.toLowerCase().replace(' ', '-')}>
                                            {status}
                                        </option>
                                    ))}
                                </select>

                                {/* Has Website */}
                                <select
                                    value={filters.hasWebsite}
                                    onChange={(e) => setFilters({ ...filters, hasWebsite: e.target.value })}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="all">All Websites</option>
                                    <option value="yes">Has Website</option>
                                    <option value="no">No Website</option>
                                </select>

                                {/* Has Contact */}
                                <select
                                    value={filters.hasContact}
                                    onChange={(e) => setFilters({ ...filters, hasContact: e.target.value })}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="all">All Contacts</option>
                                    <option value="yes">Has Contact</option>
                                    <option value="no">No Contact</option>
                                </select>

                                {/* Has Published Minisite */}
                                <select
                                    value={filters.hasPublishedMinisite}
                                    onChange={(e) => setFilters({ ...filters, hasPublishedMinisite: e.target.value })}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="all">All Minisites</option>
                                    <option value="yes">Has Minisite</option>
                                    <option value="no">No Minisite</option>
                                </select>

                                {/* Clear Filters */}
                                <button
                                    onClick={() => setFilters({
                                        search: '',
                                        country: 'all',
                                        businessType: 'all',
                                        priority: 'all',
                                        status: 'all',
                                        completionMin: 0,
                                        completionMax: 100,
                                        hasWebsite: 'all',
                                        hasContact: 'all',
                                        hasPublishedMinisite: 'all'
                                    })}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <X className="w-4 h-4" />
                                        Clear All
                                    </div>
                                </button>
                            </div>

                            {/* Completion Range */}
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-indigo-600" />
                                        Stock Completion Range
                                    </label>
                                    <span className="text-sm font-bold text-indigo-600">
                                        {filters.completionMin}% - {filters.completionMax}%
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={filters.completionMin}
                                        onChange={(e) => setFilters({ ...filters, completionMin: parseInt(e.target.value) })}
                                        className="flex-1"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={filters.completionMax}
                                        onChange={(e) => setFilters({ ...filters, completionMax: parseInt(e.target.value) })}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 lg:px-8 py-6">
                {/* Results Info */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} results
                    </p>
                </div>

                {/* Empty State */}
                {currentItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500 mb-6">
                            {filters.search
                                ? `No selling points match your search "${filters.search}"`
                                : 'Try adjusting your filters'}
                        </p>
                        <button
                            onClick={() => setFilters({
                                search: '',
                                country: 'all',
                                businessType: 'all',
                                priority: 'all',
                                status: 'all',
                                completionMin: 0,
                                completionMax: 100,
                                hasWebsite: 'all',
                                hasContact: 'all',
                                hasPublishedMinisite: 'all'
                            })}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Grid or List View */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {currentItems.map((item) => (
                                    <GridCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {currentItems.map((item) => (
                                    <ListItem key={item.id} item={item} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-indigo-300"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>

                                {[...Array(totalPages)].map((_, idx) => {
                                    const pageNum = idx + 1;
                                    if (
                                        pageNum === 1 ||
                                        pageNum === totalPages ||
                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-4 py-2 rounded-lg font-bold transition-all ${currentPage === pageNum
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                        return <span key={pageNum} className="px-2 text-gray-400 font-bold">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-indigo-300"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        )}

                        {/* Page Info */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500 font-medium">
                                Page {currentPage} of {totalPages}
                            </p>
                        </div>
                    </>
                )}
            </div>

            <ExcelImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={onImport}
            />

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default SellingPoints;