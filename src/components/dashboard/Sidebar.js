import React, { useState } from 'react';
import {
    BarChart3, Search, Bell, Settings, LogOut,
    MapPin, Building2, Users, Calendar, FileText,
    TrendingUp, History, ChevronDown, ChevronRight, MessageSquare, X
} from 'lucide-react';

const Sidebar = ({ activePage, onNavigate, onLogout, userData, mobileOpen, onClose, unreadChatCount = 0 }) => {
    const [expandedMenus, setExpandedMenus] = useState({});

    const menuItems = [
        { id: 'enhanced-dashboard', name: 'Dashboard', icon: BarChart3 },
        ...(userData?.role === 'Administrator' ? [{ id: 'users', name: 'User Management', icon: Users }] : []),

        { id: 'search', name: 'Search', icon: Search },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'chat', name: 'Team Chat', icon: MessageSquare },
        {
            id: 'selling-points',
            name: 'Selling Points',
            icon: MapPin,
            subItems: ['View All', 'Search', 'Add']
        },
        {
            id: 'companies',
            name: 'Companies',
            icon: Building2,
            subItems: ['View All', 'Search', 'Add']
        },
        {
            id: 'contacts',
            name: 'Contacts',
            icon: Users,
            subItems: ['View All', 'Search', 'Add']
        },
        {
            id: 'minisites',
            name: 'Minisites',
            icon: FileText
        },
        { id: 'schedule', name: 'Schedule', icon: Calendar },
        {
            id: 'my-work',
            name: 'My Work',
            icon: FileText,
            subItems: userData?.role === 'Administrator'
                ? ['Assignments', 'Manage Work']
                : ['Assignments']
        },
        { id: 'analytics', name: 'Analytics', icon: TrendingUp },
        { id: 'history', name: 'History', icon: History },
        { id: 'settings', name: 'Settings', icon: Settings }
    ];

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const handleNavigation = (id, subItem = null) => {
        if (subItem) {
            onNavigate(`${id}-${subItem}`); // Example: selling-points-View All
        } else {
            onNavigate(id);
        }
        if (mobileOpen && onClose) onClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:fixed lg:inset-y-0 lg:left-0
            `}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">MAKU Agency</h1>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = activePage === item.id ||
                            (item.subItems && activePage.startsWith(item.id));

                        return (
                            <div key={item.id} className="relative">
                                {isActive && (
                                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r-lg" />
                                )}
                                <button
                                    onClick={() => item.subItems ? toggleMenu(item.id) : handleNavigation(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-50/80 text-indigo-600 font-bold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        <span className="text-sm font-medium">{item.name}</span>
                                        {item.id === 'chat' && unreadChatCount > 0 && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full shrink-0"></span>
                                        )}
                                    </div>
                                    {item.subItems && (
                                        <div className={`transition-transform duration-200 ${expandedMenus[item.id] ? 'rotate-180' : ''}`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>

                                {item.subItems && expandedMenus[item.id] && (
                                    <div className="ml-9 mt-1 space-y-1 border-l border-gray-100">
                                        {item.subItems.map((subItem) => {
                                            const isSubActive = activePage === `${item.id}-${subItem}`;
                                            return (
                                                <button
                                                    key={subItem}
                                                    onClick={() => handleNavigation(item.id, subItem)}
                                                    className={`w-full text-left px-4 py-2 text-xs rounded-r-lg transition-all ${isSubActive
                                                        ? 'text-indigo-600 font-bold bg-indigo-50/50'
                                                        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {subItem}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
