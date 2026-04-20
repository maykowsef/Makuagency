import React, { useState } from 'react';
import {
    CheckCircle2, Clock, Calendar, Target, ArrowLeft,
    Phone, Eye, Package, Briefcase, AlertCircle,
    Filter, CheckSquare, RefreshCw, Database, Search,
    ChevronLeft, ChevronRight, ExternalLink, XCircle,
    MapPin, Globe, MessageSquare, Send, BarChart3
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const workTypeConfig = {
    recheck: { label: 'Recheck (Faults)', icon: RefreshCw, color: '#dc2626', bg: '#fef2f2' },
    complete: { label: 'Complete Data', icon: CheckSquare, color: '#2563eb', bg: '#eff6ff' },
    add_stock: { label: 'Add Stock', icon: Package, color: '#d97706', bg: '#fffbeb' },
    pre_integration: { label: 'Pre-Integration', icon: Database, color: '#7c3aed', bg: '#f5f3ff' },
    schedule_call: { label: 'Schedule Call', icon: Phone, color: '#059669', bg: '#ecfdf5' },
    check: { label: 'Check / Verify', icon: Eye, color: '#0284c7', bg: '#f0f9ff' },
    full_work: { label: 'Full Work', icon: Briefcase, color: '#374151', bg: '#f9fafb' },
};

const Badge = ({ status }) => {
    const colors = {
        Pending: { bg: '#fefce8', text: '#ca8a04', border: '#fde68a' },
        'In Progress': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
        Completed: { bg: '#ecfdf5', text: '#059669', border: '#6ee7b7' },
        Cancelled: { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' },
    };
    const c = colors[status] || colors['Pending'];
    return <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: '100px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>{status}</span>;
};

const EmployeeWorkAssignments = ({
    workAssignments = [],
    preIntegrationPoints = [],
    sellingPoints = [],
    onUpdateWorkAssignment,
    onUpdatePreIntegration,
    onIntegrateAsSellingPoint,
    onNavigate,
    currentUser,
    onBack
}) => {
    const [activeTab, setActiveTab] = useState('my-work');
    const [filterStatus, setFilterStatus] = useState('all');
    const [preFilter, setPreFilter] = useState('all');
    const [workSearch, setWorkSearch] = useState('');
    const [preSearch, setPreSearch] = useState('');
    const [workPage, setWorkPage] = useState(1);
    const [prePage, setPrePage] = useState(1);
    const [expandedWork, setExpandedWork] = useState(null);
    const [completionModal, setCompletionModal] = useState(null); // { work, spId }
    const [completionNote, setCompletionNote] = useState('');
    const [preDecisionModal, setPreDecisionModal] = useState(null); // pre-integration item
    const [preNote, setPreNote] = useState('');
    const [notification, setNotification] = useState(null);

    const showNotif = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ─── MY WORK ─────────────────────────────────────────────────────────────
    const myWork = workAssignments.filter(w => w.assignedTo === currentUser?.id);

    const filteredWork = myWork.filter(w => {
        const matchStatus = filterStatus === 'all' || w.status.toLowerCase().replace(' ', '_') === filterStatus;
        const matchSearch = !workSearch || w.type?.includes(workSearch.toLowerCase()) || w.instructions?.toLowerCase().includes(workSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const workTotalPages = Math.ceil(filteredWork.length / ITEMS_PER_PAGE);
    const pagedWork = filteredWork.slice((workPage - 1) * ITEMS_PER_PAGE, workPage * ITEMS_PER_PAGE);

    // ─── PRE-INTEGRATION DATA ─────────────────────────────────────────────────
    const myPreItems = preIntegrationPoints.filter(p => p.assignedTo === currentUser?.id);
    const filteredPre = myPreItems.filter(p => {
        const matchStatus = preFilter === 'all' || p.status === preFilter;
        const matchSearch = !preSearch ||
            p.businessName?.toLowerCase().includes(preSearch.toLowerCase()) ||
            p.id?.toLowerCase().includes(preSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const preTotalPages = Math.ceil(filteredPre.length / ITEMS_PER_PAGE);
    const pagedPre = filteredPre.slice((prePage - 1) * ITEMS_PER_PAGE, prePage * ITEMS_PER_PAGE);

    // ─── STATS ────────────────────────────────────────────────────────────────
    const stats = {
        total: myWork.length,
        pending: myWork.filter(w => w.status === 'Pending').length,
        inProgress: myWork.filter(w => w.status === 'In Progress').length,
        completed: myWork.filter(w => w.status === 'Completed').length,
        preTotal: myPreItems.length,
        prePending: myPreItems.filter(p => p.status === 'Assigned').length,
        preReviewed: myPreItems.filter(p => p.status === 'Reviewed' || p.status === 'Integrated' || p.status === 'Rejected').length,
    };

    // ─── HANDLERS ─────────────────────────────────────────────────────────────
    const handleCompleteItem = (work, spId, note) => {
        const already = work.completedItems || [];
        if (already.includes(spId)) return;
        const updatedWork = {
            ...work,
            completedItems: [...already, spId],
            notes: note ? (work.notes ? `${work.notes}\n${new Date().toLocaleTimeString()}: ${note}` : `${new Date().toLocaleTimeString()}: ${note}`) : work.notes,
        };
        const totalItems = (updatedWork.sellingPointIds?.length || 0) + (updatedWork.preIntegrationIds?.length || 0);
        if (updatedWork.completedItems.length >= totalItems) {
            updatedWork.status = 'Completed';
            updatedWork.completedAt = new Date().toISOString();
        } else {
            updatedWork.status = 'In Progress';
        }
        onUpdateWorkAssignment(updatedWork);
        setCompletionModal(null);
        setCompletionNote('');
        showNotif('✅ Item marked as completed!');
    };

    const handlePreDecision = (item, decision) => {
        const updatedItem = {
            ...item,
            employeeDecision: decision,
            employeeNotes: preNote,
            status: decision === 'integrate' ? 'Reviewed' : 'Rejected',
            reviewedAt: new Date().toISOString(),
            reviewedBy: currentUser?.id,
        };
        if (decision === 'integrate') {
            onIntegrateAsSellingPoint(updatedItem);
            showNotif(`✅ "${item.businessName}" has been integrated as a selling point!`);
        } else {
            onUpdatePreIntegration(updatedItem);
            showNotif(`📝 "${item.businessName}" marked as rejected with reason noted.`);
        }
        setPreDecisionModal(null);
        setPreNote('');
    };

    const handleSearchWeb = (item) => {
        const query = encodeURIComponent(`${item.businessName} ${item.address || item.city || ''}`);
        window.open(`https://www.google.com/search?q=${query}`, '_blank');
    };

    const inputStyle = {
        background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '10px',
        padding: '8px 12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit'
    };

    const tabs = [
        { id: 'my-work', label: 'My Work Today', icon: Briefcase, count: myWork.filter(w => w.status !== 'Completed').length },
        { id: 'pre-integration', label: 'Pre-Integration Review', icon: Database, count: stats.prePending },
    ];

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
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: 0 }}>My Work</h1>
                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{currentUser?.name} — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                        {/* Quick stats in header */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {[
                                { label: 'Pending', value: stats.pending, color: '#ca8a04', bg: '#fefce8' },
                                { label: 'In Progress', value: stats.inProgress, color: '#2563eb', bg: '#eff6ff' },
                                { label: 'Done', value: stats.completed, color: '#059669', bg: '#ecfdf5' },
                            ].map((s, i) => (
                                <div key={i} style={{ textAlign: 'center', background: s.bg, borderRadius: '10px', padding: '6px 14px' }}>
                                    <p style={{ fontSize: '18px', fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
                                    <p style={{ fontSize: '10px', color: s.color, margin: 0, fontWeight: 600 }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
                                borderBottom: `3px solid ${activeTab === tab.id ? '#4f46e5' : 'transparent'}`,
                                color: activeTab === tab.id ? '#4f46e5' : '#6b7280', transition: 'all 0.2s'
                            }}>
                                <tab.icon size={15} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span style={{ background: activeTab === tab.id ? '#4f46e5' : '#fee2e2', color: activeTab === tab.id ? 'white' : '#dc2626', borderRadius: '100px', padding: '1px 8px', fontSize: '11px' }}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

                {/* ── MY WORK TAB ── */}
                {activeTab === 'my-work' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Overall Progress Bar */}
                        {myWork.length > 0 && (
                            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BarChart3 size={16} color="#4f46e5" />
                                        <span style={{ fontWeight: 700, color: '#374151', fontSize: '14px' }}>Today's Overall Progress</span>
                                    </div>
                                    <span style={{ fontWeight: 900, color: '#4f46e5', fontSize: '16px' }}>
                                        {stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0}%
                                    </span>
                                </div>
                                <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${stats.total > 0 ? (stats.completed / stats.total * 100) : 0}%`,
                                        height: '100%', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                                        borderRadius: '100px', transition: 'width 0.6s ease'
                                    }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#9ca3af' }}>
                                    <span>{stats.completed} completed</span>
                                    <span>{stats.total} total assignments</span>
                                </div>
                            </div>
                        )}

                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input value={workSearch} onChange={e => setWorkSearch(e.target.value)} placeholder="Search assignments..." style={{ ...inputStyle, width: '100%', paddingLeft: '32px', boxSizing: 'border-box' }} />
                            </div>
                            {['all', 'pending', 'in_progress', 'completed'].map(s => (
                                <button key={s} onClick={() => { setFilterStatus(s); setWorkPage(1); }} style={{
                                    padding: '8px 16px', borderRadius: '100px', border: 'none',
                                    background: filterStatus === s ? '#4f46e5' : '#f3f4f6',
                                    color: filterStatus === s ? 'white' : '#6b7280',
                                    fontWeight: 700, fontSize: '12px', cursor: 'pointer'
                                }}>
                                    {s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>

                        {/* Work List */}
                        {filteredWork.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '64px', textAlign: 'center' }}>
                                <Briefcase size={48} style={{ color: '#e5e7eb', margin: '0 auto 12px' }} />
                                <p style={{ color: '#374151', fontWeight: 700, marginBottom: '4px' }}>No work assignments</p>
                                <p style={{ color: '#9ca3af', fontSize: '13px' }}>You're all caught up!</p>
                            </div>
                        ) : pagedWork.map(work => {
                            const cfg = workTypeConfig[work.type] || workTypeConfig.check;
                            const totalItems = (work.sellingPointIds?.length || 0) + (work.preIntegrationIds?.length || 0);
                            const completedCount = work.completedItems?.length || 0;
                            const progress = totalItems > 0 ? Math.round(completedCount / totalItems * 100) : 0;
                            const isExpanded = expandedWork === work.id;

                            return (
                                <div key={work.id} style={{ background: 'white', borderRadius: '16px', border: `1px solid ${work.status === 'Completed' ? '#bbf7d0' : '#e5e7eb'}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
                                    {/* Work Header */}
                                    <div style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setExpandedWork(isExpanded ? null : work.id)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                            <div style={{ padding: '10px', background: cfg.bg, borderRadius: '12px', flexShrink: 0 }}>
                                                <cfg.icon size={20} color={cfg.color} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                                    <span style={{ fontWeight: 800, color: '#111827', fontSize: '15px' }}>{cfg.label}</span>
                                                    <Badge status={work.status} />
                                                    {work.priority && (
                                                        <span style={{ fontSize: '11px', fontWeight: 700, color: work.priority === 'Urgent' ? '#dc2626' : work.priority === 'High' ? '#ea580c' : '#6b7280', background: work.priority === 'Urgent' ? '#fef2f2' : work.priority === 'High' ? '#fff7ed' : '#f9fafb', padding: '2px 8px', borderRadius: '100px' }}>
                                                            {work.priority}
                                                        </span>
                                                    )}
                                                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#d1d5db' }}>{work.id}</span>
                                                </div>
                                                {work.instructions && <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{work.instructions}</p>}
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontSize: '24px', fontWeight: 900, color: progress === 100 ? '#059669' : '#4f46e5' }}>{progress}%</div>
                                                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{completedCount}/{totalItems} done</div>
                                                {work.dueDate && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Due {new Date(work.dueDate).toLocaleDateString()}</div>}
                                            </div>
                                        </div>
                                        {/* Mini progress bar */}
                                        <div style={{ marginTop: '12px', height: '6px', background: '#f3f4f6', borderRadius: '100px', overflow: 'hidden' }}>
                                            <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#10b981' : 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: '100px', transition: 'width 0.5s' }} />
                                        </div>
                                    </div>

                                    {/* Expanded: Selling Points list */}
                                    {isExpanded && (
                                        <div style={{ borderTop: '1px solid #f3f4f6', padding: '16px 20px' }}>
                                            {work.notes && (
                                                <div style={{ background: '#f0f9ff', borderRadius: '10px', padding: '12px', marginBottom: '12px', border: '1px solid #bae6fd' }}>
                                                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Work Notes</p>
                                                    <p style={{ fontSize: '13px', color: '#0c4a6e', margin: 0, whiteSpace: 'pre-line' }}>{work.notes}</p>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
                                                    Selling Points ({work.sellingPointIds?.length || 0})
                                                </h4>
                                                {(work.sellingPointIds || []).map(spId => {
                                                    const sp = sellingPoints.find(s => s.id === spId || String(s.id) === String(spId));
                                                    const isCompleted = (work.completedItems || []).includes(spId);
                                                    return (
                                                        <div key={spId} style={{
                                                            display: 'flex', alignItems: 'center', gap: '12px',
                                                            padding: '12px 16px', borderRadius: '10px',
                                                            background: isCompleted ? '#f0fdf4' : '#fafafe',
                                                            border: `1px solid ${isCompleted ? '#bbf7d0' : '#e5e7eb'}`,
                                                            transition: 'all 0.2s'
                                                        }}>
                                                            {isCompleted
                                                                ? <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                                                                : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #d1d5db', flexShrink: 0 }} />
                                                            }
                                                            <div style={{ flex: 1 }}>
                                                                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '13px' }}>
                                                                    {sp ? sp.name : `Selling Point #${spId}`}
                                                                </p>
                                                                {sp?.address?.city && <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{sp.address.city}</p>}
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                                {!isCompleted && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => onNavigate('selling-point-detail', { id: spId })}
                                                                            style={{ padding: '7px 14px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                            <Eye size={13} /> View
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setCompletionModal({ work, spId })}
                                                                            style={{ padding: '7px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                            <CheckSquare size={13} /> Done
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {isCompleted && (
                                                                    <span style={{ padding: '7px 14px', background: '#ecfdf5', color: '#059669', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>✓ Completed</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {/* Pre-integration items in this work */}
                                                {(work.preIntegrationIds || []).length > 0 && (
                                                    <>
                                                        <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '8px 0 4px' }}>
                                                            Pre-Integration Items ({work.preIntegrationIds.length})
                                                        </h4>
                                                        {work.preIntegrationIds.map(itemId => {
                                                            const item = preIntegrationPoints.find(p => p.id === itemId);
                                                            const isDone = (work.completedItems || []).includes(itemId);
                                                            return (
                                                                <div key={itemId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: isDone ? '#f0fdf4' : '#faf5ff', border: `1px solid ${isDone ? '#bbf7d0' : '#e9d5ff'}` }}>
                                                                    {isDone ? <CheckCircle2 size={18} color="#10b981" /> : <Database size={18} color="#7c3aed" />}
                                                                    <div style={{ flex: 1 }}>
                                                                        <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '13px' }}>{item?.businessName || itemId}</p>
                                                                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0, fontFamily: 'monospace' }}>{itemId}</p>
                                                                    </div>
                                                                    {!isDone && (
                                                                        <button onClick={() => handleCompleteItem(work, itemId, '')}
                                                                            style={{ padding: '7px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                                                            Done
                                                                        </button>
                                                                    )}
                                                                    {isDone && <span style={{ padding: '7px 14px', background: '#ecfdf5', color: '#059669', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>✓ Done</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Work Pagination */}
                        {workTotalPages > 1 && (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                                <button onClick={() => setWorkPage(p => Math.max(1, p - 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                                {Array.from({ length: workTotalPages }, (_, i) => (
                                    <button key={i} onClick={() => setWorkPage(i + 1)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid', borderColor: workPage === i + 1 ? '#4f46e5' : '#e5e7eb', background: workPage === i + 1 ? '#4f46e5' : 'white', color: workPage === i + 1 ? 'white' : '#374151', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>{i + 1}</button>
                                ))}
                                <button onClick={() => setWorkPage(p => Math.min(workTotalPages, p + 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── PRE-INTEGRATION TAB ── */}
                {activeTab === 'pre-integration' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            {[
                                { label: 'Assigned to Me', value: stats.preTotal, color: '#374151', bg: 'white' },
                                { label: 'Pending Review', value: stats.prePending, color: '#ca8a04', bg: '#fefce8' },
                                { label: 'Reviewed', value: stats.preReviewed, color: '#059669', bg: '#ecfdf5' },
                            ].map((s, i) => (
                                <div key={i} style={{ background: s.bg, borderRadius: '14px', padding: '20px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                                    <p style={{ fontSize: '32px', fontWeight: 900, color: s.color, margin: 0 }}>{s.value}</p>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Info Banner */}
                        <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '14px 18px', border: '1px solid #bae6fd', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <AlertCircle size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '1px' }} />
                            <div>
                                <p style={{ fontWeight: 700, color: '#0c4a6e', margin: '0 0 2px', fontSize: '13px' }}>Your task</p>
                                <p style={{ color: '#0369a1', fontSize: '12px', margin: 0 }}>
                                    Review each pre-integration entry. Decide to <strong>Integrate</strong> it as a real selling point, or <strong>Reject</strong> it with a reason. You can also search the web for more information on any entry.
                                </p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input value={preSearch} onChange={e => { setPreSearch(e.target.value); setPrePage(1); }} placeholder="Search by name or ID..." style={{ ...inputStyle, width: '100%', paddingLeft: '32px', boxSizing: 'border-box' }} />
                            </div>
                            {['all', 'Assigned', 'Integrated', 'Rejected'].map(s => (
                                <button key={s} onClick={() => { setPreFilter(s); setPrePage(1); }} style={{
                                    padding: '8px 16px', borderRadius: '100px', border: 'none',
                                    background: preFilter === s ? '#4f46e5' : '#f3f4f6',
                                    color: preFilter === s ? 'white' : '#6b7280',
                                    fontWeight: 700, fontSize: '12px', cursor: 'pointer'
                                }}>{s === 'all' ? 'All' : s}</button>
                            ))}
                        </div>

                        {/* Pre-Integration Cards */}
                        {filteredPre.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '16px', border: '2px dashed #e5e7eb', padding: '64px', textAlign: 'center' }}>
                                <Database size={48} style={{ color: '#e5e7eb', margin: '0 auto 12px' }} />
                                <p style={{ color: '#374151', fontWeight: 700 }}>No pre-integration entries</p>
                                <p style={{ color: '#9ca3af', fontSize: '13px' }}>The admin hasn't assigned any entries to you yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {pagedPre.map((item, idx) => {
                                    const isReviewed = item.status === 'Integrated' || item.status === 'Rejected' || item.status === 'Reviewed';
                                    return (
                                        <div key={item.id} style={{
                                            background: 'white', borderRadius: '16px',
                                            border: `1px solid ${isReviewed ? (item.status === 'Rejected' ? '#fecaca' : '#bbf7d0') : '#e5e7eb'}`,
                                            padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                                                {/* Index + ID */}
                                                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                                    <div style={{ width: '36px', height: '36px', background: '#f3f4f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                                                        {(prePage - 1) * ITEMS_PER_PAGE + idx + 1}
                                                    </div>
                                                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#9ca3af' }}>{item.id}</span>
                                                </div>

                                                {/* Info */}
                                                <div style={{ flex: 1, minWidth: '200px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                                        <h3 style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: '15px' }}>{item.businessName}</h3>
                                                        <span style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: '100px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>{item.businessType}</span>
                                                        {isReviewed && (
                                                            <span style={{ background: item.status === 'Rejected' ? '#fef2f2' : '#ecfdf5', color: item.status === 'Rejected' ? '#dc2626' : '#059669', border: `1px solid ${item.status === 'Rejected' ? '#fecaca' : '#6ee7b7'}`, borderRadius: '100px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>
                                                                {item.status === 'Integrated' ? '✓ Integrated' : '✗ Rejected'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                                                        {item.address && <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><MapPin size={12} /> {item.address}</span>}
                                                        {item.phone && <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><Phone size={12} /> {item.phone}</span>}
                                                        {item.scrapedData?.website && <span style={{ display: 'flex', gap: '4px', alignItems: 'center', color: '#4f46e5' }}><Globe size={12} /> {item.scrapedData.website}</span>}
                                                        {item.scrapedData?.email && <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}><MessageSquare size={12} /> {item.scrapedData.email}</span>}
                                                    </div>
                                                    {item.source && <span style={{ fontSize: '10px', color: '#d1d5db', fontStyle: 'italic', marginTop: '4px', display: 'block' }}>Source: {item.source}</span>}
                                                    {item.employeeNotes && (
                                                        <div style={{ marginTop: '8px', background: '#f9fafb', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#374151', border: '1px solid #f3f4f6' }}>
                                                            <strong>Note:</strong> {item.employeeNotes}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                                                    {/* Search Web Button */}
                                                    <button onClick={() => handleSearchWeb(item)} style={{
                                                        padding: '8px 14px', border: '1px solid #e5e7eb', background: 'white',
                                                        borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                                                        color: '#374151', display: 'flex', alignItems: 'center', gap: '6px',
                                                        transition: 'all 0.2s'
                                                    }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.border = '1px solid #4f46e5'; e.currentTarget.style.color = '#4f46e5'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.border = '1px solid #e5e7eb'; e.currentTarget.style.color = '#374151'; }}
                                                    >
                                                        <ExternalLink size={13} /> Search Web
                                                    </button>

                                                    {!isReviewed && (
                                                        <button onClick={() => setPreDecisionModal(item)} style={{
                                                            padding: '8px 14px', background: '#4f46e5', color: 'white',
                                                            border: 'none', borderRadius: '10px', cursor: 'pointer',
                                                            fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'
                                                        }}>
                                                            <Send size={13} /> Make Decision
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pre Pagination */}
                        {preTotalPages > 1 && (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                                <button onClick={() => setPrePage(p => Math.max(1, p - 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                                {Array.from({ length: preTotalPages }, (_, i) => (
                                    <button key={i} onClick={() => setPrePage(i + 1)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid', borderColor: prePage === i + 1 ? '#4f46e5' : '#e5e7eb', background: prePage === i + 1 ? '#4f46e5' : 'white', color: prePage === i + 1 ? 'white' : '#374151', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>{i + 1}</button>
                                ))}
                                <button onClick={() => setPrePage(p => Math.min(preTotalPages, p + 1))} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── COMPLETION MODAL ── */}
            {completionModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '12px' }}>
                                    <CheckCircle2 size={22} color="#10b981" />
                                </div>
                                <h2 style={{ fontWeight: 800, color: '#111827', margin: 0, fontSize: '18px' }}>Mark as Completed</h2>
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0 54px' }}>
                                {sellingPoints.find(s => s.id === completionModal.spId || String(s.id) === String(completionModal.spId))?.name || `SP #${completionModal.spId}`}
                            </p>
                        </div>
                        <div style={{ padding: '24px 28px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', display: 'block' }}>
                                Completion Note (optional)
                            </label>
                            <textarea
                                value={completionNote}
                                onChange={e => setCompletionNote(e.target.value)}
                                placeholder="Describe what was done, any findings, or leave blank..."
                                rows={4}
                                style={{ width: '100%', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ padding: '16px 28px 24px', display: 'flex', gap: '12px' }}>
                            <button onClick={() => { setCompletionModal(null); setCompletionNote(''); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => handleCompleteItem(completionModal.work, completionModal.spId, completionNote)} style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <CheckCircle2 size={16} /> Confirm Completion
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRE-INTEGRATION DECISION MODAL ── */}
            {preDecisionModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
                            <h2 style={{ fontWeight: 800, color: '#111827', margin: '0 0 4px', fontSize: '18px' }}>Review: {preDecisionModal.businessName}</h2>
                            <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0, fontFamily: 'monospace' }}>{preDecisionModal.id}</p>
                        </div>
                        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Info Summary */}
                            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '14px' }}>
                                {[
                                    { label: 'Type', value: preDecisionModal.businessType },
                                    { label: 'Address', value: preDecisionModal.address },
                                    { label: 'Phone', value: preDecisionModal.phone },
                                    { label: 'Website', value: preDecisionModal.scrapedData?.website },
                                    { label: 'Email', value: preDecisionModal.scrapedData?.email },
                                ].filter(f => f.value).map((f, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', marginBottom: '4px' }}>
                                        <span style={{ color: '#9ca3af', fontWeight: 600, minWidth: '60px' }}>{f.label}:</span>
                                        <span style={{ color: '#374151' }}>{f.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', display: 'block' }}>
                                    Your Note / Reason
                                </label>
                                <textarea
                                    value={preNote}
                                    onChange={e => setPreNote(e.target.value)}
                                    placeholder="Add notes about this entry (required if rejecting)..."
                                    rows={3}
                                    style={{ width: '100%', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '12px', padding: '12px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button onClick={() => handleSearchWeb(preDecisionModal)} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', background: 'white', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                                <ExternalLink size={13} /> Search Google for more info
                            </button>
                        </div>

                        <div style={{ padding: '16px 28px 24px', display: 'flex', gap: '12px' }}>
                            <button onClick={() => { setPreDecisionModal(null); setPreNote(''); }} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                            <button onClick={() => handlePreDecision(preDecisionModal, 'reject')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#fef2f2', color: '#dc2626', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <XCircle size={15} /> Reject
                            </button>
                            <button onClick={() => handlePreDecision(preDecisionModal, 'integrate')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#10b981', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <CheckCircle2 size={15} /> Integrate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeWorkAssignments;
