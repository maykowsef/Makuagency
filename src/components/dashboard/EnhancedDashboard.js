import React, { useState } from 'react';
import {
    TrendingUp, Users, MapPin, Building2, Globe,
    Calendar, Clock, CheckCircle2, Target, Zap,
    ArrowRight, Activity, Award, Briefcase, Phone, BarChart3,
    Upload, Database
} from 'lucide-react';
import { safeNow, safeDate } from '../../utils/dateUtils';

const EnhancedDashboard = ({
    sellingPoints = [],
    companies = [],
    contacts = [],
    minisites = [],
    dailyWork = [],
    workAssignments = [],
    preIntegrationPoints = [],
    currentUser,
    onNavigate,
    activeTime = 0,
    activityLog = []
}) => {
    const isAdmin = currentUser?.role === 'Administrator';

    // Calculate today's stats
    const today = safeNow().split('T')[0];
    const todayWork = dailyWork.find(w => w.date === today && w.userId === currentUser?.id) || {
        checks: [],
        creations: [],
        tasks: []
    };

    // Filter logs for THIS user only
    const userActivities = activityLog.filter(log => String(log.performedBy?.id) === String(currentUser?.id));

    // Calculate detailed stats matching old dashboard
    const stats = {
        // From DailyWork
        sellingPointsChecked: todayWork.checks?.length || 0,
        sellingPointsAdded: todayWork.creations?.length || 0,

        // From ActivityLog (Today)
        scheduled: userActivities.filter(log => {
            const logDate = safeDate(log.timestamp);
            return logDate && logDate.toISOString().split('T')[0] === today && log.metadata?.action === 'schedule_business';
        }).length,
        websitesMadeToday: userActivities.filter(log => {
            const logDate = safeDate(log.timestamp);
            return logDate && logDate.toISOString().split('T')[0] === today && log.type === 'minisite' && log.metadata?.action === 'create';
        }).length,
        contacted: userActivities.filter(log => {
            const logDate = safeDate(log.timestamp);
            return logDate && logDate.toISOString().split('T')[0] === today && log.metadata?.action === 'add_call';
        }).length,
        convinced: userActivities.filter(log => {
            const logDate = safeDate(log.timestamp);
            return logDate && logDate.toISOString().split('T')[0] === today && log.metadata?.action === 'mark_convinced';
        }).length,

        // Work Stats
        pendingWork: workAssignments.filter(w => w.assignedTo === currentUser?.id && w.status === 'Pending').length,
        inProgressWork: workAssignments.filter(w => w.assignedTo === currentUser?.id && w.status === 'In Progress').length,
        completedWork: workAssignments.filter(w => w.assignedTo === currentUser?.id && w.status === 'Completed').length,

        // Overview Totals
        totalSellingPoints: sellingPoints.length,
        totalCompanies: companies.length,
        totalContacts: contacts.length,
        totalMinisites: minisites.length,

        // Pre-integration
        pendingPreIntegration: preIntegrationPoints.filter(p => p.status === 'Pending').length,
    };

    // Format active time
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    // Quick actions - 4 items including bulk injection
    const quickActions = [
        {
            label: 'Add Selling Point',
            description: 'Create a new selling point',
            icon: MapPin,
            color: 'from-indigo-500 to-indigo-700',
            shadow: 'shadow-indigo-200',
            action: () => onNavigate('selling-point-form')
        },
        {
            label: 'Add Contact',
            description: 'Register a new contact',
            icon: Users,
            color: 'from-emerald-500 to-emerald-700',
            shadow: 'shadow-emerald-200',
            action: () => onNavigate('contact-form')
        },
        {
            label: 'Add Company',
            description: 'Add a new company',
            icon: Building2,
            color: 'from-blue-500 to-blue-700',
            shadow: 'shadow-blue-200',
            action: () => onNavigate('company-form')
        },
        {
            label: 'Bulk Data Injection',
            description: 'Import data via Excel/CSV',
            icon: Upload,
            color: 'from-violet-500 to-purple-700',
            shadow: 'shadow-violet-200',
            action: () => onNavigate('selling-points', { showImport: true })
        }
    ];

    // Real recent activity from activityLog
    const recentActivity = userActivities.slice(0, 5).map(log => ({
        action: log.description,
        time: safeDate(log.timestamp)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Invalid Time',
        type: log.type
    }));

    const getActivityColor = (type) => {
        switch (type) {
            case 'Create': case 'selling_point': return 'bg-indigo-100 text-indigo-600';
            case 'Edit': case 'Update': return 'bg-blue-100 text-blue-600';
            case 'Delete': return 'bg-red-100 text-red-600';
            case 'Schedule': return 'bg-purple-100 text-purple-600';
            case 'minisite': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8faff 0%, #fff 50%, #f0f4ff 100%)' }}>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

                {/* Welcome Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)',
                    borderRadius: '24px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.5px' }}>
                            Welcome back, {currentUser?.name}! 👋
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {activeTime > 0 && (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                                borderRadius: '100px', padding: '6px 16px', marginTop: '16px',
                                border: '1px solid rgba(255,255,255,0.25)'
                            }}>
                                <Clock size={14} />
                                <span style={{ fontSize: '13px', fontWeight: 600 }}>Active: {formatTime(activeTime)}</span>
                            </div>
                        )}
                        {stats.pendingWork > 0 && (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(251,191,36,0.25)', backdropFilter: 'blur(10px)',
                                borderRadius: '100px', padding: '6px 16px', marginTop: '8px', marginLeft: '8px',
                                border: '1px solid rgba(251,191,36,0.4)'
                            }}>
                                <Briefcase size={14} />
                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{stats.pendingWork} pending tasks</span>
                            </div>
                        )}
                    </div>
                    <div style={{
                        position: 'absolute', top: '-60px', right: '-60px',
                        width: '240px', height: '240px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-40px', left: '30%',
                        width: '160px', height: '160px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)'
                    }} />
                </div>

                {/* Today's Performance */}
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={20} style={{ color: '#4f46e5' }} />
                        Today's Performance
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                        {[
                            { label: 'Points Checked', value: stats.sellingPointsChecked, badge: 'CHECKS', color: '#4f46e5', bg: '#eef2ff' },
                            { label: 'Points Added', value: stats.sellingPointsAdded, badge: 'ADDED', color: '#059669', bg: '#ecfdf5' },
                            { label: 'Minisites Today', value: stats.websitesMadeToday, badge: 'SITES', color: '#16a34a', bg: '#f0fdf4' },
                            { label: 'Calls Scheduled', value: stats.scheduled, badge: 'SCHEDULED', color: '#2563eb', bg: '#eff6ff' },
                            { label: 'Contacted', value: stats.contacted, badge: 'CALLS', color: '#7c3aed', bg: '#f5f3ff' },
                            { label: 'Convinced', value: stats.convinced, badge: 'WON', color: '#d97706', bg: '#fffbeb' },
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: '16px', padding: '16px',
                                border: `2px solid ${stat.bg}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                transition: 'all 0.2s ease',
                                cursor: 'default'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{
                                        fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em',
                                        color: stat.color, background: stat.bg,
                                        padding: '2px 8px', borderRadius: '100px'
                                    }}>{stat.badge}</span>
                                </div>
                                <p style={{ fontSize: '28px', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{stat.value}</p>
                                <p style={{ fontSize: '11px', fontWeight: 500, color: '#9ca3af', marginTop: '4px' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions - 4 items */}
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={20} style={{ color: '#4f46e5' }} />
                        Quick Actions
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={action.action}
                                style={{
                                    background: `linear-gradient(135deg, ${action.color.includes('indigo') ? '#4f46e5, #4338ca' : action.color.includes('emerald') ? '#10b981, #059669' : action.color.includes('blue') ? '#3b82f6, #2563eb' : '#8b5cf6, #7c3aed'})`,
                                    padding: '24px', borderRadius: '20px', color: 'white',
                                    border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                                    boxShadow: `0 8px 24px ${action.shadow.includes('indigo') ? 'rgba(79,70,229,0.35)' : action.shadow.includes('emerald') ? 'rgba(16,185,129,0.35)' : action.shadow.includes('blue') ? 'rgba(59,130,246,0.35)' : 'rgba(139,92,246,0.35)'}`,
                                    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                            >
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <action.icon size={28} style={{ marginBottom: '12px', opacity: 0.95 }} />
                                    <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{action.label}</p>
                                    <p style={{ fontSize: '12px', opacity: 0.75 }}>{action.description}</p>
                                    <ArrowRight size={16} style={{ marginTop: '12px', opacity: 0.7 }} />
                                </div>
                                <div style={{
                                    position: 'absolute', top: '-20px', right: '-20px',
                                    width: '100px', height: '100px', borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)'
                                }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview + Recent Activity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Overview */}
                    <div style={{
                        background: 'white', borderRadius: '20px',
                        border: '1px solid #e5e7eb', padding: '24px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <BarChart3 size={18} style={{ color: '#4f46e5' }} />
                            Overview
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Selling Points', value: stats.totalSellingPoints, color: '#4f46e5', bg: '#eef2ff', nav: 'selling-points', icon: MapPin },
                                { label: 'Companies', value: stats.totalCompanies, color: '#2563eb', bg: '#eff6ff', nav: 'companies', icon: Building2 },
                                { label: 'Contacts', value: stats.totalContacts, color: '#059669', bg: '#ecfdf5', nav: 'contacts', icon: Users },
                                { label: 'Minisites', value: stats.totalMinisites, color: '#7c3aed', bg: '#f5f3ff', nav: 'minisite-dashboard', icon: Globe },
                                { label: 'Pre-Integration', value: preIntegrationPoints.length, color: '#d97706', bg: '#fffbeb', nav: 'admin-work-management', icon: Database },
                            ].map((item, i) => (
                                <div key={i}
                                    onClick={() => onNavigate(item.nav)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 16px', borderRadius: '12px', background: item.bg,
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', background: item.color, borderRadius: '10px', display: 'flex' }}>
                                            <item.icon size={16} style={{ color: 'white' }} />
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '14px' }}>{item.label}</span>
                                    </div>
                                    <span style={{ fontSize: '22px', fontWeight: 900, color: item.color }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div style={{
                        background: 'white', borderRadius: '20px',
                        border: '1px solid #e5e7eb', padding: '24px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Activity size={18} style={{ color: '#4f46e5' }} />
                                Recent Activity
                            </h3>
                            <button
                                onClick={() => onNavigate('activity-history')}
                                style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                View All →
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {recentActivity.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                                    <Activity size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                                    <p style={{ fontSize: '14px' }}>No recent activity yet</p>
                                </div>
                            ) : recentActivity.map((activity, idx) => (
                                <div key={idx} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                                    padding: '10px 12px', borderRadius: '12px',
                                    transition: 'background 0.2s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em',
                                        padding: '3px 10px', borderRadius: '100px',
                                        whiteSpace: 'nowrap', flexShrink: 0, marginTop: '2px',
                                        ...(() => {
                                            const cls = getActivityColor(activity.type);
                                            return { background: cls.includes('indigo') ? '#eef2ff' : cls.includes('blue') ? '#eff6ff' : cls.includes('green') ? '#ecfdf5' : cls.includes('red') ? '#fef2f2' : '#f5f3ff', color: cls.includes('indigo') ? '#4f46e5' : cls.includes('blue') ? '#2563eb' : cls.includes('green') ? '#059669' : cls.includes('red') ? '#dc2626' : '#7c3aed' };
                                        })()
                                    }}>{activity.type || 'ACT'}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.action}</p>
                                        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Work Progress - shown if there's any work */}
                {(stats.pendingWork + stats.inProgressWork > 0) && (
                    <div style={{
                        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
                        borderRadius: '20px', border: '1px solid #c7d2fe', padding: '24px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={18} style={{ color: '#4f46e5' }} />
                            Your Work Progress
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                            {[
                                { label: 'Pending', value: stats.pendingWork, color: '#d97706', bg: 'white' },
                                { label: 'In Progress', value: stats.inProgressWork, color: '#2563eb', bg: 'white' },
                                { label: 'Completed', value: stats.completedWork, color: '#059669', bg: 'white' },
                            ].map((s, i) => (
                                <div key={i} style={{ background: s.bg, padding: '20px', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                                    <p style={{ fontSize: '32px', fontWeight: 900, color: s.color }}>{s.value}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => onNavigate('employee-work-assignments')}
                            style={{
                                width: '100%', padding: '14px', background: '#4f46e5',
                                color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
                            onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
                        >
                            View All Work Assignments
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Admin shortcuts */}
                {isAdmin && (
                    <div style={{
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                        borderRadius: '20px', padding: '24px', color: 'white'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Briefcase size={18} />
                            Admin Center
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                            {[
                                { label: 'Manage Work', desc: 'Assign tasks & upload data', action: () => onNavigate('admin-work-management'), icon: Target },
                                { label: 'User Management', desc: 'Manage team members', action: () => onNavigate('admin-users'), icon: Users },
                                { label: 'Analytics', desc: 'View performance reports', action: () => onNavigate('analytics'), icon: TrendingUp },
                                { label: 'Work History', desc: 'Track all assignments', action: () => onNavigate('activity-history'), icon: Clock },
                            ].map((item, i) => (
                                <button key={i} onClick={item.action} style={{
                                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '14px', padding: '16px', color: 'white', cursor: 'pointer',
                                    textAlign: 'left', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <item.icon size={20} style={{ marginBottom: '8px', opacity: 0.9 }} />
                                    <p style={{ fontWeight: 700, fontSize: '13px' }}>{item.label}</p>
                                    <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>{item.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default EnhancedDashboard;
