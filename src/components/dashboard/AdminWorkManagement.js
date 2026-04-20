import React, { useState, useRef } from 'react';
import {
    Upload, Users, CheckCircle2, Plus, Search, Filter,
    Calendar, ArrowLeft, Target, Clock, AlertCircle,
    Eye, Trash2, ChevronLeft, ChevronRight, DownloadCloud,
    Database, Briefcase, BarChart3, RefreshCw, Package,
    Phone, XCircle, CheckSquare, Edit3, List, History,
    ChevronDown, User, TrendingUp, Ban
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const statusColors = {
    Pending: { bg: '#fefce8', text: '#ca8a04', border: '#fde68a' },
    Assigned: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    Reviewed: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    Integrated: { bg: '#ecfdf5', text: '#059669', border: '#6ee7b7' },
    Rejected: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    Completed: { bg: '#ecfdf5', text: '#059669', border: '#6ee7b7' },
    'In Progress': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    Cancelled: { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' },
};

const Badge = ({ status }) => {
    const c = statusColors[status] || statusColors['Pending'];
    return (
        <span style={{
            background: c.bg, color: c.text, border: `1px solid ${c.border}`,
            borderRadius: '100px', padding: '2px 10px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap'
        }}>{status}</span>
    );
};

const workTypeOptions = [
    { value: 'recheck', label: 'Recheck (Faults)', icon: RefreshCw, color: '#dc2626' },
    { value: 'complete', label: 'Complete Data', icon: CheckSquare, color: '#2563eb' },
    { value: 'add_stock', label: 'Add Stock', icon: Package, color: '#d97706' },
    { value: 'pre_integration', label: 'Pre-Integration Review', icon: Database, color: '#7c3aed' },
];

const AdminWorkManagement = ({
    preIntegrationPoints = [],
    workAssignments = [],
    sellingPoints = [],
    users = [],
    onBulkUploadPreIntegration,
    onAssignPreIntegration,
    onCreateWorkAssignment,
    onUpdateWorkAssignment,
    onBack,
    currentUser
}) => {
    const [activeTab, setActiveTab] = useState('pre-integration');
    const [page, setPage] = useState(1);
    const [workPage, setWorkPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showWorkModal, setShowWorkModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedSPs, setSelectedSPs] = useState([]);
    const [spIdInput, setSpIdInput] = useState('');
    const [notification, setNotification] = useState(null);
    const [modalSpSearch, setModalSpSearch] = useState('');
    const [modalPreSearch, setModalPreSearch] = useState('');
    const fileRef = useRef();

    // History filters
    const [histEmp, setHistEmp] = useState('all');
    const [histStatus, setHistStatus] = useState('all');
    const [histType, setHistType] = useState('all');
    const [histDate, setHistDate] = useState('');
    const [histView, setHistView] = useState('list'); // 'list' | 'by-employee'
    const [histPage, setHistPage] = useState(1);
    const [expandedHistWork, setExpandedHistWork] = useState(null);
    const HIST_PER_PAGE = 15;

    const [workForm, setWorkForm] = useState({
        type: 'recheck',
        assignedTo: '',
        priority: 'Medium',
        instructions: '',
        dueDate: '',
        idMode: 'select', // 'select' | 'manual'
        manualIds: '',
        preIntegrationIds: [],
    });

    const showNotif = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ─── FILE UPLOAD ────────────────────────────────────────────────────────────
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const text = ev.target.result;
                const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

                const items = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    const row = {};
                    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
                    items.push({
                        id: `PRE-${Date.now()}-${i}`,
                        businessName: row.business_name || row.name || row.businessname || `Business ${i}`,
                        address: row.address || '',
                        phone: row.phone || row.tel || '',
                        businessType: row.business_type || row.type || 'Unknown',
                        city: row.city || '',
                        source: 'Excel/CSV Import',
                        scrapedData: {
                            website: row.website || null,
                            socialMedia: row.social_media ? [row.social_media] : [],
                            email: row.email || null,
                        },
                        assignedTo: null,
                        assignedAt: null,
                        status: 'Pending',
                        employeeDecision: null,
                        employeeNotes: '',
                        integratedAsId: null,
                        createdAt: new Date().toISOString(),
                    });
                }
                onBulkUploadPreIntegration(items);
                showNotif(`✅ Successfully imported ${items.length} items from ${file.name}`);
                if (fileRef.current) fileRef.current.value = '';
            } catch (err) {
                showNotif('❌ Error parsing file. Check format: Name, Address, Phone, Type, City, Website', 'error');
            }
        };
        reader.readAsText(file);
    };

    // ─── FILTERED PRE-INTEGRATION ─────────────────────────────────────────────
    const filteredPre = preIntegrationPoints.filter(p => {
        const matchSearch = !searchQuery ||
            p.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.address?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredPre.length / ITEMS_PER_PAGE);
    const pagedPre = filteredPre.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // ─── WORK ASSIGNMENTS FILTERED (Assign Work tab) ─────────────────────────
    const filteredWork = workAssignments;
    const workTotalPages = Math.ceil(filteredWork.length / ITEMS_PER_PAGE);
    const pagedWork = filteredWork.slice((workPage - 1) * ITEMS_PER_PAGE, workPage * ITEMS_PER_PAGE);

    // ─── HISTORY FILTERS ──────────────────────────────────────────────────────
    const filteredHistory = workAssignments.filter(w => {
        const matchEmp = histEmp === 'all' || String(w.assignedTo) === histEmp;
        const matchStatus = histStatus === 'all' || w.status === histStatus;
        const matchType = histType === 'all' || w.type === histType;
        const matchDate = !histDate || new Date(w.assignedAt).toISOString().split('T')[0] === histDate;
        return matchEmp && matchStatus && matchType && matchDate;
    }).sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));

    const histTotalPages = Math.ceil(filteredHistory.length / HIST_PER_PAGE);
    const pagedHistory = filteredHistory.slice((histPage - 1) * HIST_PER_PAGE, histPage * HIST_PER_PAGE);

    // Group history by employee for by-employee view
    const histByEmployee = users.filter(u => u.role !== 'Administrator').map(u => {
        const empWork = filteredHistory.filter(w => w.assignedTo === u.id);
        const total = empWork.length;
        const completed = empWork.filter(w => w.status === 'Completed').length;
        const inProgress = empWork.filter(w => w.status === 'In Progress').length;
        const pending = empWork.filter(w => w.status === 'Pending').length;
        // Group by day
        const byDay = {};
        empWork.forEach(w => {
            const day = new Date(w.assignedAt).toISOString().split('T')[0];
            if (!byDay[day]) byDay[day] = [];
            byDay[day].push(w);
        });
        return { user: u, total, completed, inProgress, pending, byDay };
    }).filter(e => e.total > 0);

    // ─── STATS ────────────────────────────────────────────────────────────────
    const preStats = {
        total: preIntegrationPoints.length,
        pending: preIntegrationPoints.filter(p => p.status === 'Pending').length,
        assigned: preIntegrationPoints.filter(p => p.status === 'Assigned').length,
        integrated: preIntegrationPoints.filter(p => p.status === 'Integrated').length,
        rejected: preIntegrationPoints.filter(p => p.status === 'Rejected').length,
    };
    const workStats = {
        total: workAssignments.length,
        pending: workAssignments.filter(w => w.status === 'Pending').length,
        inProgress: workAssignments.filter(w => w.status === 'In Progress').length,
        completed: workAssignments.filter(w => w.status === 'Completed').length,
    };

    // ─── CREATE WORK ──────────────────────────────────────────────────────────
    const handleCreateWork = () => {
        if (!workForm.assignedTo) { showNotif('❌ Please select an employee', 'error'); return; }

        let ids = [];
        if (workForm.type === 'pre_integration') {
            ids = workForm.preIntegrationIds;
            if (ids.length === 0) { showNotif('❌ Select pre-integration items', 'error'); return; }
        } else if (workForm.idMode === 'select') {
            ids = selectedSPs;
            if (ids.length === 0) { showNotif('❌ Select selling points', 'error'); return; }
        } else {
            ids = workForm.manualIds.split(',').map(s => s.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n));
            if (ids.length === 0) { showNotif('❌ Enter valid IDs', 'error'); return; }
        }

        const newWork = {
            id: `WORK-${Date.now()}`,
            type: workForm.type,
            sellingPointIds: workForm.type === 'pre_integration' ? [] : ids,
            preIntegrationIds: workForm.type === 'pre_integration' ? ids : [],
            assignedTo: parseInt(workForm.assignedTo),
            assignedBy: currentUser?.id,
            assignedAt: new Date().toISOString(),
            dueDate: workForm.dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
            status: 'Pending',
            priority: workForm.priority,
            instructions: workForm.instructions,
            completedAt: null,
            completedItems: [],
            notes: '',
            followUpCreated: false,
        };

        // If pre_integration type, also assign those items
        if (workForm.type === 'pre_integration') {
            ids.forEach(itemId => {
                const item = preIntegrationPoints.find(p => p.id === itemId);
                if (item) onAssignPreIntegration({ ...item, assignedTo: parseInt(workForm.assignedTo), assignedAt: new Date().toISOString(), status: 'Assigned' });
            });
        }

        onCreateWorkAssignment(newWork);
        setShowWorkModal(false);
        setSelectedSPs([]);
        setWorkForm({ type: 'recheck', assignedTo: '', priority: 'Medium', instructions: '', dueDate: '', idMode: 'select', manualIds: '', preIntegrationIds: [] });
        showNotif('✅ Work assignment created successfully');
    };

    const tabs = [
        { id: 'pre-integration', label: 'Pre-Integration Data', icon: Database, count: preStats.total },
        { id: 'assign-work', label: 'Assign Work', icon: Briefcase, count: workStats.total },
        { id: 'history', label: 'History & Progress', icon: History, count: null },
    ];

    const inputStyle = {
        width: '100%', background: '#f9fafb', border: '2px solid #e5e7eb',
        borderRadius: '12px', padding: '10px 14px', fontSize: '14px', outline: 'none',
        fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s'
    };
    const labelStyle = { fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' };
    const btnPrimary = {
        background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px',
        padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8faff' }}>

            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed', top: '80px', right: '24px', zIndex: 999,
                    background: notification.type === 'error' ? '#fef2f2' : '#f0fdf4',
                    border: `1px solid ${notification.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                    color: notification.type === 'error' ? '#dc2626' : '#16a34a',
                    borderRadius: '12px', padding: '14px 20px', fontWeight: 600, fontSize: '14px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }}>{notification.msg}</div>
            )}

            {/* Header */}
            <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 30, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
                        <button onClick={onBack} style={{ padding: '8px', borderRadius: '10px', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex' }}>
                            <ArrowLeft size={18} color="#374151" />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>Work Management</h1>
                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Admin control panel — upload data, assign work, track progress</p>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
                                borderBottom: `3px solid ${activeTab === tab.id ? '#4f46e5' : 'transparent'}`,
                                color: activeTab === tab.id ? '#4f46e5' : '#6b7280',
                                transition: 'all 0.2s'
                            }}>
                                <tab.icon size={15} />
                                {tab.label}
                                {tab.count !== null && (
                                    <span style={{ background: activeTab === tab.id ? '#4f46e5' : '#e5e7eb', color: activeTab === tab.id ? 'white' : '#374151', borderRadius: '100px', padding: '1px 8px', fontSize: '11px' }}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

                {/* ── TAB: PRE-INTEGRATION ── */}
                {activeTab === 'pre-integration' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                            {[
                                { label: 'Total', value: preStats.total, color: '#374151', bg: 'white' },
                                { label: 'Pending', value: preStats.pending, color: '#ca8a04', bg: '#fefce8' },
                                { label: 'Assigned', value: preStats.assigned, color: '#2563eb', bg: '#eff6ff' },
                                { label: 'Integrated', value: preStats.integrated, color: '#059669', bg: '#ecfdf5' },
                                { label: 'Rejected', value: preStats.rejected, color: '#dc2626', bg: '#fef2f2' },
                            ].map((s, i) => (
                                <div key={i} style={{ background: s.bg, borderRadius: '14px', padding: '16px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                                    <p style={{ fontSize: '28px', fontWeight: 900, color: s.color }}>{s.value}</p>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Upload Section */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #c7d2fe', padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, color: '#1e1b4b', margin: '0 0 4px' }}>📤 Import Pre-Integration Data</h3>
                                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                                        CSV format: <code style={{ background: '#f3f4f6', padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>Business Name, Address, Phone, Type, City, Website, Email</code>
                                    </p>
                                </div>
                                <label style={{ cursor: 'pointer' }}>
                                    <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} style={{ display: 'none' }} />
                                    <div style={{ ...btnPrimary, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                                        <Upload size={16} />
                                        Upload CSV / Excel
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Search & Filter */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                                    placeholder="Search by name, ID, or address..."
                                    style={{ ...inputStyle, paddingLeft: '38px' }}
                                />
                            </div>
                            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                                style={{ ...inputStyle, width: 'auto', padding: '10px 14px' }}>
                                <option value="all">All Status</option>
                                {['Pending', 'Assigned', 'Integrated', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {selectedItems.length > 0 && (
                                <button onClick={() => {
                                    const emp = prompt('Enter employee ID to assign:');
                                    if (!emp) return;
                                    selectedItems.forEach(id => {
                                        const item = preIntegrationPoints.find(p => p.id === id);
                                        if (item) onAssignPreIntegration({ ...item, assignedTo: parseInt(emp), assignedAt: new Date().toISOString(), status: 'Assigned' });
                                    });
                                    setSelectedItems([]);
                                    showNotif(`✅ Assigned ${selectedItems.length} items`);
                                }} style={{ ...btnPrimary, background: '#059669' }}>
                                    <Users size={15} />
                                    Assign ({selectedItems.length})
                                </button>
                            )}
                        </div>

                        {/* Data Table */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left' }}>
                                                <input type="checkbox"
                                                    checked={selectedItems.length === pagedPre.length && pagedPre.length > 0}
                                                    onChange={e => setSelectedItems(e.target.checked ? pagedPre.map(p => p.id) : [])}
                                                />
                                            </th>
                                            {['ID', 'Business Name', 'Business Type', 'Address / City', 'Phone', 'Website', 'Status', 'Assigned To', 'Added'].map(col => (
                                                <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagedPre.length === 0 ? (
                                            <tr><td colSpan={10} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
                                                <Database size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                                                <p>No pre-integration data found</p>
                                            </td></tr>
                                        ) : pagedPre.map((item, idx) => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', background: selectedItems.includes(item.id) ? '#eff6ff' : idx % 2 === 0 ? 'white' : '#fafafe' }}>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <input type="checkbox" checked={selectedItems.includes(item.id)}
                                                        onChange={e => setSelectedItems(e.target.checked ? [...selectedItems, item.id] : selectedItems.filter(id => id !== item.id))}
                                                    />
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ fontFamily: 'monospace', fontSize: '11px', background: '#f3f4f6', padding: '2px 8px', borderRadius: '6px', color: '#4f46e5', fontWeight: 700 }}>{item.id}</span>
                                                </td>
                                                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{item.businessName}</td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{item.businessType}</td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.address}{item.city ? `, ${item.city}` : ''}
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280', fontFamily: 'monospace', fontSize: '12px' }}>{item.phone || '—'}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    {item.scrapedData?.website
                                                        ? <a href={`https://${item.scrapedData.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '12px' }}>🔗 {item.scrapedData.website.slice(0, 20)}</a>
                                                        : <span style={{ color: '#d1d5db', fontSize: '12px' }}>—</span>}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}><Badge status={item.status} /></td>
                                                <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px' }}>
                                                    {item.assignedTo ? (users.find(u => u.id === item.assignedTo)?.name || `User ${item.assignedTo}`) : '—'}
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #f3f4f6' }}>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                        Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredPre.length)} of {filteredPre.length} items
                                    </span>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px', borderRadius: '8px', border: '1px solid #e5e7eb', background: page === 1 ? '#f9fafb' : 'white', cursor: page === 1 ? 'default' : 'pointer' }}>
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const p = i + 1;
                                            return (
                                                <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid', borderColor: page === p ? '#4f46e5' : '#e5e7eb', background: page === p ? '#4f46e5' : 'white', color: page === p ? 'white' : '#374151', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>{p}</button>
                                            );
                                        })}
                                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px', borderRadius: '8px', border: '1px solid #e5e7eb', background: page === totalPages ? '#f9fafb' : 'white', cursor: page === totalPages ? 'default' : 'pointer' }}>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── TAB: ASSIGN WORK ── */}
                {activeTab === 'assign-work' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Work Types Guide */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                            {workTypeOptions.map(wt => (
                                <div key={wt.value} style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #e5e7eb', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ padding: '8px', background: wt.color + '18', borderRadius: '10px', flexShrink: 0 }}>
                                        <wt.icon size={18} color={wt.color} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '13px', color: '#111827', margin: '0 0 2px' }}>{wt.label}</p>
                                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                                            {wt.value === 'recheck' ? 'IDs with faults/errors to verify' :
                                                wt.value === 'complete' ? 'IDs needing complete data entry' :
                                                    wt.value === 'add_stock' ? 'IDs needing stock inventory added' : 'Review pre-integration entries'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setShowWorkModal(true)} style={{ ...btnPrimary, alignSelf: 'flex-start', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                            <Plus size={18} /> Create New Work Assignment
                        </button>

                        {/* Recent assignments */}
                        {workAssignments.length === 0 && (
                            <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '48px', textAlign: 'center' }}>
                                <Briefcase size={40} style={{ margin: '0 auto 12px', color: '#d1d5db' }} />
                                <p style={{ color: '#6b7280', fontWeight: 600 }}>No work assignments yet</p>
                                <p style={{ color: '#9ca3af', fontSize: '13px' }}>Create your first assignment above</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {pagedWork.map(work => {
                                const assignedUser = users.find(u => u.id === work.assignedTo);
                                const totalItems = (work.sellingPointIds?.length || 0) + (work.preIntegrationIds?.length || 0);
                                const progress = totalItems > 0 ? Math.round((work.completedItems?.length || 0) / totalItems * 100) : 0;
                                const wt = workTypeOptions.find(w => w.value === work.type) || workTypeOptions[0];
                                return (
                                    <div key={work.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ padding: '8px', background: wt.color + '18', borderRadius: '10px' }}>
                                                    <wt.icon size={18} color={wt.color} />
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ca3af' }}>{work.id}</span>
                                                        <span style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{wt.label}</span>
                                                        <Badge status={work.status} />
                                                        <span style={{ ...statusColors[work.priority] ? { background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' } : {}, borderRadius: '100px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>{work.priority}</span>
                                                    </div>
                                                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0' }}>{work.instructions}</p>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
                                                <div style={{ fontWeight: 600, color: '#374151' }}>{assignedUser?.name || `User ${work.assignedTo}`}</div>
                                                <div>Due: {new Date(work.dueDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        {/* Progress */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
                                                <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#10b981' : '#4f46e5', borderRadius: '100px', transition: 'width 0.5s ease' }} />
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: progress === 100 ? '#059669' : '#4f46e5', minWidth: '36px' }}>{progress}%</span>
                                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{work.completedItems?.length || 0}/{totalItems}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {workTotalPages > 1 && (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button onClick={() => setWorkPage(p => Math.max(1, p - 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                                {Array.from({ length: workTotalPages }, (_, i) => (
                                    <button key={i} onClick={() => setWorkPage(i + 1)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid', borderColor: workPage === i + 1 ? '#4f46e5' : '#e5e7eb', background: workPage === i + 1 ? '#4f46e5' : 'white', color: workPage === i + 1 ? 'white' : '#374151', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>{i + 1}</button>
                                ))}
                                <button onClick={() => setWorkPage(p => Math.min(workTotalPages, p + 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB: HISTORY & PROGRESS ── */}
                {activeTab === 'history' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Global Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            {[
                                { label: 'Total Assignments', value: workStats.total, color: '#374151', bg: 'white' },
                                { label: 'Pending', value: workStats.pending, color: '#ca8a04', bg: '#fefce8' },
                                { label: 'In Progress', value: workStats.inProgress, color: '#2563eb', bg: '#eff6ff' },
                                { label: 'Completed', value: workStats.completed, color: '#059669', bg: '#ecfdf5' },
                            ].map((s, i) => (
                                <div key={i} style={{ background: s.bg, borderRadius: '14px', padding: '20px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                                    <p style={{ fontSize: '32px', fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filters Row */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Filter size={16} color="#4f46e5" />
                                <h3 style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '15px' }}>Filters & View</h3>
                                {(histEmp !== 'all' || histStatus !== 'all' || histType !== 'all' || histDate) && (
                                    <button onClick={() => { setHistEmp('all'); setHistStatus('all'); setHistType('all'); setHistDate(''); setHistPage(1); }}
                                        style={{ marginLeft: 'auto', fontSize: '11px', color: '#dc2626', fontWeight: 700, background: '#fef2f2', border: 'none', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer' }}>
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
                                {/* Employee filter */}
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }}>Employee</label>
                                    <select value={histEmp} onChange={e => { setHistEmp(e.target.value); setHistPage(1); }}
                                        style={{ width: '100%', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}>
                                        <option value="all">All Employees</option>
                                        {users.filter(u => u.role !== 'Administrator').map(u => (
                                            <option key={u.id} value={String(u.id)}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Status filter */}
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }}>Status</label>
                                    <select value={histStatus} onChange={e => { setHistStatus(e.target.value); setHistPage(1); }}
                                        style={{ width: '100%', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}>
                                        <option value="all">All Status</option>
                                        {['Pending', 'In Progress', 'Completed', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                {/* Type filter */}
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }}>Work Type</label>
                                    <select value={histType} onChange={e => { setHistType(e.target.value); setHistPage(1); }}
                                        style={{ width: '100%', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}>
                                        <option value="all">All Types</option>
                                        {workTypeOptions.map(wt => <option key={wt.value} value={wt.value}>{wt.label}</option>)}
                                    </select>
                                </div>
                                {/* Date filter */}
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }}>Assigned Date</label>
                                    <input type="date" value={histDate} onChange={e => { setHistDate(e.target.value); setHistPage(1); }}
                                        style={{ width: '100%', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                                </div>
                                {/* View toggle */}
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', display: 'block' }}>View Mode</label>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {[{ v: 'list', label: '≡ List' }, { v: 'by-employee', label: '👤 By Employee' }].map(({ v, label }) => (
                                            <button key={v} onClick={() => setHistView(v)} style={{
                                                flex: 1, padding: '8px', borderRadius: '10px', border: `2px solid ${histView === v ? '#4f46e5' : '#e5e7eb'}`,
                                                background: histView === v ? '#eef2ff' : 'white', color: histView === v ? '#4f46e5' : '#6b7280',
                                                fontWeight: 700, fontSize: '11px', cursor: 'pointer'
                                            }}>{label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                                Showing <strong style={{ color: '#4f46e5' }}>{filteredHistory.length}</strong> of <strong>{workAssignments.length}</strong> assignments
                                {histEmp !== 'all' && <span style={{ marginLeft: '8px', background: '#eef2ff', color: '#4f46e5', borderRadius: '100px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>
                                    {users.find(u => String(u.id) === histEmp)?.name}
                                </span>}
                            </div>
                        </div>

                        {/* ── LIST VIEW ── */}
                        {histView === 'list' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {filteredHistory.length === 0 ? (
                                    <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '48px', textAlign: 'center' }}>
                                        <History size={40} style={{ color: '#e5e7eb', margin: '0 auto 12px' }} />
                                        <p style={{ color: '#374151', fontWeight: 600 }}>No assignments match your filters</p>
                                    </div>
                                ) : pagedHistory.map(work => {
                                    const assignedUser = users.find(u => u.id === work.assignedTo);
                                    const totalItems = (work.sellingPointIds?.length || 0) + (work.preIntegrationIds?.length || 0);
                                    const completedCount = work.completedItems?.length || 0;
                                    const progress = totalItems > 0 ? Math.round(completedCount / totalItems * 100) : 0;
                                    const wt = workTypeOptions.find(w => w.value === work.type) || workTypeOptions[0];
                                    const isExpanded = expandedHistWork === work.id;

                                    return (
                                        <div key={work.id} style={{ background: 'white', borderRadius: '14px', border: `1px solid ${work.status === 'Completed' ? '#bbf7d0' : work.status === 'Cancelled' ? '#e5e7eb' : '#e5e7eb'}`, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                            {/* Header Row - clickable to expand */}
                                            <div onClick={() => setExpandedHistWork(isExpanded ? null : work.id)}
                                                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                <div style={{ padding: '8px', background: wt.color + '15', borderRadius: '10px', flexShrink: 0 }}>
                                                    <wt.icon size={18} color={wt.color} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: '200px' }}>
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2px' }}>
                                                        <span style={{ fontWeight: 800, color: '#111827', fontSize: '14px' }}>{wt.label}</span>
                                                        <Badge status={work.status} />
                                                        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9ca3af' }}>{work.id}</span>
                                                    </div>
                                                    {work.instructions && <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{work.instructions}</p>}
                                                </div>
                                                {/* Employee pill */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f3f4f6', borderRadius: '100px', padding: '4px 12px', flexShrink: 0 }}>
                                                    <User size={13} color="#6b7280" />
                                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>{assignedUser?.name || `User ${work.assignedTo}`}</span>
                                                </div>
                                                {/* Progress */}
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <div style={{ fontSize: '20px', fontWeight: 900, color: progress === 100 ? '#059669' : '#4f46e5' }}>{progress}%</div>
                                                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>{completedCount}/{totalItems}</div>
                                                </div>
                                                {/* Date */}
                                                <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right', flexShrink: 0 }}>
                                                    <div>Assigned</div>
                                                    <div style={{ fontWeight: 600, color: '#6b7280' }}>{new Date(work.assignedAt).toLocaleDateString()}</div>
                                                    {work.dueDate && <div>Due {new Date(work.dueDate).toLocaleDateString()}</div>}
                                                </div>
                                                <ChevronDown size={16} color="#9ca3af" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
                                            </div>

                                            {/* Mini progress bar */}
                                            <div style={{ height: '4px', background: '#f3f4f6' }}>
                                                <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#10b981' : '#4f46e5', transition: 'width 0.5s' }} />
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', background: '#fafafe' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                                                        {[
                                                            { label: 'Priority', value: work.priority, color: work.priority === 'Urgent' ? '#dc2626' : work.priority === 'High' ? '#ea580c' : '#6b7280' },
                                                            { label: 'SP / Pre-Int. IDs', value: totalItems + ' items', color: '#374151' },
                                                            { label: 'Completed', value: completedCount + ' items', color: '#059669' },
                                                            { label: 'Assigned At', value: new Date(work.assignedAt).toLocaleString(), color: '#374151' },
                                                            { label: 'Completed At', value: work.completedAt ? new Date(work.completedAt).toLocaleString() : '—', color: '#374151' },
                                                        ].map((info, i) => (
                                                            <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '12px', border: '1px solid #f3f4f6' }}>
                                                                <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{info.label}</p>
                                                                <p style={{ fontWeight: 700, color: info.color, fontSize: '13px', margin: 0 }}>{info.value}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* IDs list */}
                                                    {(work.sellingPointIds?.length > 0 || work.preIntegrationIds?.length > 0) && (
                                                        <div style={{ background: 'white', borderRadius: '10px', padding: '12px', border: '1px solid #f3f4f6', marginBottom: '12px' }}>
                                                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                                                                Selling Point IDs ({work.sellingPointIds?.length || 0})
                                                            </p>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                                {(work.sellingPointIds || []).map(id => {
                                                                    const isDone = (work.completedItems || []).includes(id);
                                                                    const sp = sellingPoints.find(s => String(s.id) === String(id));
                                                                    return (
                                                                        <span key={id} style={{ background: isDone ? '#ecfdf5' : '#f3f4f6', color: isDone ? '#059669' : '#374151', border: `1px solid ${isDone ? '#bbf7d0' : '#e5e7eb'}`, borderRadius: '8px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
                                                                            {isDone ? '✓ ' : ''}{sp ? sp.name : `#${id}`}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Notes */}
                                                    {work.notes && (
                                                        <div style={{ background: '#f0f9ff', borderRadius: '10px', padding: '12px', border: '1px solid #bae6fd', marginBottom: '12px' }}>
                                                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', margin: '0 0 4px', textTransform: 'uppercase' }}>Employee Notes</p>
                                                            <p style={{ fontSize: '12px', color: '#0c4a6e', margin: 0, whiteSpace: 'pre-line' }}>{work.notes}</p>
                                                        </div>
                                                    )}

                                                    {/* Admin Actions */}
                                                    {work.status !== 'Completed' && work.status !== 'Cancelled' && (
                                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                            <button onClick={() => { onUpdateWorkAssignment({ ...work, status: 'Completed', completedAt: new Date().toISOString() }); showNotif('✅ Work marked as completed'); setExpandedHistWork(null); }}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#ecfdf5', color: '#059669', border: '1px solid #bbf7d0', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                                                                <CheckCircle2 size={14} /> Force Complete
                                                            </button>
                                                            <button onClick={() => { onUpdateWorkAssignment({ ...work, status: 'Cancelled' }); showNotif('Work cancelled'); setExpandedHistWork(null); }}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                                                                <Ban size={14} /> Cancel Work
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                {histTotalPages > 1 && (
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', marginTop: '8px' }}>
                                        <button onClick={() => setHistPage(p => Math.max(1, p - 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                                        {Array.from({ length: Math.min(histTotalPages, 7) }, (_, i) => (
                                            <button key={i} onClick={() => setHistPage(i + 1)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid', borderColor: histPage === i + 1 ? '#4f46e5' : '#e5e7eb', background: histPage === i + 1 ? '#4f46e5' : 'white', color: histPage === i + 1 ? 'white' : '#374151', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>{i + 1}</button>
                                        ))}
                                        <button onClick={() => setHistPage(p => Math.min(histTotalPages, p + 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── BY EMPLOYEE VIEW ── */}
                        {histView === 'by-employee' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {histByEmployee.length === 0 ? (
                                    <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '48px', textAlign: 'center' }}>
                                        <Users size={40} style={{ color: '#e5e7eb', margin: '0 auto 12px' }} />
                                        <p style={{ color: '#374151', fontWeight: 600 }}>No data for selected filters</p>
                                    </div>
                                ) : histByEmployee.map(({ user: emp, total, completed, inProgress, pending, byDay }) => {
                                    const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
                                    const isEmpExpanded = expandedHistWork === `emp-${emp.id}`;
                                    return (
                                        <div key={emp.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                            {/* Employee Header */}
                                            <div onClick={() => setExpandedHistWork(isEmpExpanded ? null : `emp-${emp.id}`)}
                                                style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                                {/* Avatar */}
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '18px', flexShrink: 0 }}>
                                                    {emp.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 800, color: '#111827', margin: '0 0 2px', fontSize: '16px' }}>{emp.name}</p>
                                                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{emp.role} · {Object.keys(byDay).length} active day{Object.keys(byDay).length !== 1 ? 's' : ''}</p>
                                                </div>
                                                {/* Mini stats */}
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                    {[
                                                        { label: 'Total', value: total, color: '#374151', bg: '#f3f4f6' },
                                                        { label: 'Pending', value: pending, color: '#ca8a04', bg: '#fefce8' },
                                                        { label: 'In Progress', value: inProgress, color: '#2563eb', bg: '#eff6ff' },
                                                        { label: 'Done', value: completed, color: '#059669', bg: '#ecfdf5' },
                                                    ].map((s, i) => (
                                                        <div key={i} style={{ textAlign: 'center', padding: '6px 14px', background: s.bg, borderRadius: '10px' }}>
                                                            <div style={{ fontWeight: 900, fontSize: '18px', color: s.color }}>{s.value}</div>
                                                            <div style={{ fontSize: '10px', color: s.color, fontWeight: 600 }}>{s.label}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Completion rate */}
                                                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                                    <div style={{ fontSize: '24px', fontWeight: 900, color: completionRate === 100 ? '#059669' : '#4f46e5' }}>{completionRate}%</div>
                                                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>completion</div>
                                                </div>
                                                <ChevronDown size={18} color="#9ca3af" style={{ transform: isEmpExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                                            </div>

                                            {/* Employee overall progress bar */}
                                            <div style={{ height: '6px', background: '#f3f4f6', margin: '0 24px', borderRadius: '100px', overflow: 'hidden', marginBottom: '0' }}>
                                                <div style={{ width: `${completionRate}%`, height: '100%', background: completionRate === 100 ? '#10b981' : 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: '100px', transition: 'width 0.6s' }} />
                                            </div>

                                            {/* Expanded: grouped by day */}
                                            {isEmpExpanded && (
                                                <div style={{ padding: '16px 24px 20px', borderTop: '1px solid #f3f4f6', background: '#fafafe' }}>
                                                    {Object.entries(byDay)
                                                        .sort(([a], [b]) => new Date(b) - new Date(a))
                                                        .map(([day, dayWorks]) => {
                                                            const dayTotal = dayWorks.reduce((acc, w) => acc + (w.sellingPointIds?.length || 0) + (w.preIntegrationIds?.length || 0), 0);
                                                            const dayCompleted = dayWorks.reduce((acc, w) => acc + (w.completedItems?.length || 0), 0);
                                                            const dayProgress = dayTotal > 0 ? Math.round(dayCompleted / dayTotal * 100) : 0;

                                                            return (
                                                                <div key={day} style={{ marginBottom: '16px' }}>
                                                                    {/* Day header */}
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#eef2ff', borderRadius: '8px', padding: '4px 12px' }}>
                                                                            <Calendar size={13} color="#4f46e5" />
                                                                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>
                                                                                {new Date(day).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                                                                            </span>
                                                                        </div>
                                                                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{dayWorks.length} assignment{dayWorks.length !== 1 ? 's' : ''}</span>
                                                                        <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700, color: dayProgress === 100 ? '#059669' : '#4f46e5' }}>{dayProgress}% done for day</span>
                                                                    </div>

                                                                    {/* Day's work list */}
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '8px', borderLeft: '2px solid #e5e7eb', paddingLeft: '16px' }}>
                                                                        {dayWorks.map(work => {
                                                                            const totalItems = (work.sellingPointIds?.length || 0) + (work.preIntegrationIds?.length || 0);
                                                                            const completedCount = work.completedItems?.length || 0;
                                                                            const prog = totalItems > 0 ? Math.round(completedCount / totalItems * 100) : 0;
                                                                            const wt = workTypeOptions.find(w => w.value === work.type) || workTypeOptions[0];

                                                                            return (
                                                                                <div key={work.id} style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                                                                    <div style={{ padding: '6px', background: wt.color + '15', borderRadius: '8px', flexShrink: 0 }}>
                                                                                        <wt.icon size={14} color={wt.color} />
                                                                                    </div>
                                                                                    <div style={{ flex: 1 }}>
                                                                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                                                            <span style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{wt.label}</span>
                                                                                            <Badge status={work.status} />
                                                                                            <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#d1d5db' }}>{work.id}</span>
                                                                                        </div>
                                                                                        {work.instructions && <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0' }}>{work.instructions}</p>}
                                                                                    </div>
                                                                                    {/* Progress */}
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                                                                        <div style={{ width: '80px', height: '6px', background: '#f3f4f6', borderRadius: '100px', overflow: 'hidden' }}>
                                                                                            <div style={{ width: `${prog}%`, height: '100%', background: prog === 100 ? '#10b981' : '#4f46e5', borderRadius: '100px' }} />
                                                                                        </div>
                                                                                        <span style={{ fontSize: '11px', fontWeight: 700, color: prog === 100 ? '#059669' : '#4f46e5', minWidth: '32px' }}>{prog}%</span>
                                                                                    </div>
                                                                                    {/* Admin quick actions */}
                                                                                    {work.status !== 'Completed' && work.status !== 'Cancelled' && (
                                                                                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                                                                            <button onClick={() => { onUpdateWorkAssignment({ ...work, status: 'Completed', completedAt: new Date().toISOString() }); showNotif('✅ Marked complete'); }}
                                                                                                style={{ padding: '5px 10px', background: '#ecfdf5', color: '#059669', border: '1px solid #bbf7d0', borderRadius: '8px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>
                                                                                                ✓ Done
                                                                                            </button>
                                                                                            <button onClick={() => { onUpdateWorkAssignment({ ...work, status: 'Cancelled' }); showNotif('Work cancelled'); }}
                                                                                                style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>
                                                                                                ✗ Cancel
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                )}

            </div>

            {/* ── WORK MODAL ── */}
            {showWorkModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                            <h2 style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: '20px' }}>Create Work Assignment</h2>
                            <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 0' }}>Assign work to your team members</p>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={labelStyle}>Work Type</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {workTypeOptions.map(wt => (
                                        <button key={wt.value} onClick={() => setWorkForm(f => ({ ...f, type: wt.value }))} style={{
                                            padding: '12px', borderRadius: '12px', border: `2px solid ${workForm.type === wt.value ? wt.color : '#e5e7eb'}`,
                                            background: workForm.type === wt.value ? wt.color + '12' : 'white', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s'
                                        }}>
                                            <wt.icon size={16} color={workForm.type === wt.value ? wt.color : '#9ca3af'} />
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: workForm.type === wt.value ? wt.color : '#374151' }}>{wt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {workForm.type === 'pre_integration' ? (
                                <div>
                                    <label style={labelStyle}>Select Pre-Integration Items ({workForm.preIntegrationIds.length} selected)</label>
                                    <div style={{ position: 'relative', marginBottom: '8px' }}>
                                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            value={modalPreSearch}
                                            onChange={e => setModalPreSearch(e.target.value)}
                                            placeholder="Search by name or ID..."
                                            style={{ ...inputStyle, paddingLeft: '32px', width: '100%', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div style={{ maxHeight: '160px', overflowY: 'auto', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '8px' }}>
                                        {preIntegrationPoints
                                            .filter(p => p.status === 'Pending' && (!modalPreSearch || p.businessName?.toLowerCase().includes(modalPreSearch.toLowerCase()) || p.id?.toLowerCase().includes(modalPreSearch.toLowerCase())))
                                            .map(item => (
                                                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={workForm.preIntegrationIds.includes(item.id)}
                                                        onChange={e => setWorkForm(f => ({ ...f, preIntegrationIds: e.target.checked ? [...f.preIntegrationIds, item.id] : f.preIntegrationIds.filter(id => id !== item.id) }))}
                                                    />
                                                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#4f46e5' }}>{item.id}</span>
                                                    <span style={{ fontSize: '13px', color: '#374151' }}>{item.businessName}</span>
                                                </label>
                                            ))}
                                        {preIntegrationPoints.filter(p => p.status === 'Pending').length === 0 && (
                                            <p style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No pending items</p>
                                        )}
                                        {preIntegrationPoints.filter(p => p.status === 'Pending' && (!modalPreSearch || p.businessName?.toLowerCase().includes(modalPreSearch.toLowerCase()) || p.id?.toLowerCase().includes(modalPreSearch.toLowerCase()))).length === 0 && preIntegrationPoints.filter(p => p.status === 'Pending').length > 0 && (
                                            <p style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No results for "{modalPreSearch}"</p>
                                        )}
                                    </div>
                                    {workForm.preIntegrationIds.length > 0 && <p style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, marginTop: '4px' }}>{workForm.preIntegrationIds.length} items selected</p>}
                                </div>
                            ) : (
                                <div>
                                    <label style={labelStyle}>Selling Point IDs</label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        {['select', 'manual'].map(mode => (
                                            <button key={mode} onClick={() => setWorkForm(f => ({ ...f, idMode: mode }))}
                                                style={{ padding: '6px 14px', borderRadius: '8px', border: `2px solid ${workForm.idMode === mode ? '#4f46e5' : '#e5e7eb'}`, background: workForm.idMode === mode ? '#eef2ff' : 'white', color: workForm.idMode === mode ? '#4f46e5' : '#6b7280', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                                                {mode === 'select' ? 'Select from list' : 'Enter IDs manually'}
                                            </button>
                                        ))}
                                    </div>
                                    {workForm.idMode === 'manual' ? (
                                        <input value={workForm.manualIds} onChange={e => setWorkForm(f => ({ ...f, manualIds: e.target.value }))}
                                            placeholder="Enter IDs separated by commas: 100, 105, 210..."
                                            style={inputStyle} />
                                    ) : (
                                        <div>
                                            <div style={{ position: 'relative', marginBottom: '8px' }}>
                                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                                <input
                                                    value={modalSpSearch}
                                                    onChange={e => setModalSpSearch(e.target.value)}
                                                    placeholder="Search selling point by name or ID..."
                                                    style={{ ...inputStyle, paddingLeft: '32px', width: '100%', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                            <div style={{ maxHeight: '140px', overflowY: 'auto', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '8px' }}>
                                                {sellingPoints
                                                    .filter(sp => !modalSpSearch || sp.name?.toLowerCase().includes(modalSpSearch.toLowerCase()) || String(sp.id).includes(modalSpSearch))
                                                    .slice(0, 100)
                                                    .map(sp => (
                                                        <label key={sp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', borderRadius: '8px', cursor: 'pointer' }}>
                                                            <input type="checkbox" checked={selectedSPs.includes(sp.id)}
                                                                onChange={e => setSelectedSPs(e.target.checked ? [...selectedSPs, sp.id] : selectedSPs.filter(id => id !== sp.id))} />
                                                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4f46e5' }}>#{sp.id}</span>
                                                            <span style={{ fontSize: '13px', color: '#374151' }}>{sp.name}</span>
                                                        </label>
                                                    ))}
                                                {sellingPoints.filter(sp => !modalSpSearch || sp.name?.toLowerCase().includes(modalSpSearch.toLowerCase()) || String(sp.id).includes(modalSpSearch)).length === 0 && (
                                                    <p style={{ padding: '12px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No selling points found</p>
                                                )}
                                            </div>
                                            {selectedSPs.length > 0 && <p style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 700, marginTop: '4px' }}>{selectedSPs.length} selected</p>}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label style={labelStyle}>Assign To</label>
                                <select value={workForm.assignedTo} onChange={e => setWorkForm(f => ({ ...f, assignedTo: e.target.value }))} style={inputStyle}>
                                    <option value="">Select employee...</option>
                                    {users.filter(u => u.role !== 'Administrator').map(u => (
                                        <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Priority</label>
                                    <select value={workForm.priority} onChange={e => setWorkForm(f => ({ ...f, priority: e.target.value }))} style={inputStyle}>
                                        {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Due Date</label>
                                    <input type="date" value={workForm.dueDate} onChange={e => setWorkForm(f => ({ ...f, dueDate: e.target.value }))} style={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Instructions</label>
                                <textarea value={workForm.instructions} onChange={e => setWorkForm(f => ({ ...f, instructions: e.target.value }))}
                                    rows={3} placeholder="Provide detailed instructions..." style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                        </div>

                        <div style={{ padding: '20px 28px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowWorkModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleCreateWork} style={{ flex: 2, ...btnPrimary, justifyContent: 'center', padding: '12px', borderRadius: '12px', fontSize: '14px', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
                                <Plus size={16} /> Create Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWorkManagement;
