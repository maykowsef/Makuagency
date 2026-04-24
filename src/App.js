import TemplateUsedCarDealer from './components/templates/TemplateUsedCarDealer';
import TemplateUsedCarDealerPro from './components/templates/TemplateUsedCarDealerPro';
import TemplateModernDark from './components/templates/TemplateModernDark';
import TemplateMinimalistWhite from './components/templates/TemplateMinimalistWhite';

// Real Estate Templates
import TemplateRealEstateLuxury from './components/templates/TemplateRealEstateLuxury';
import TemplateRealEstateModern from './components/templates/TemplateRealEstateModern';
import TemplateRealEstateClean from './components/templates/TemplateRealEstateClean';
import TemplateRealEstateWarm from './components/templates/TemplateRealEstateWarm';

// Clothing Templates
import TemplateClothingUrban from './components/templates/TemplateClothingUrban';
import TemplateClothingBoutique from './components/templates/TemplateClothingBoutique';
import TemplateClothingVintage from './components/templates/TemplateClothingVintage';
import TemplateClothingMinimalist from './components/templates/TemplateClothingMinimalist';
import Login from './components/auth/Login';
import UserManagement from './components/admin/UserManagement';
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import SellingPoints from './components/selling-points/SellingPoints';
import SellingPointDetail from './components/selling-points/SellingPointDetail';
import SellingPointForm from './components/selling-points/SellingPointForm';
import { initialSellingPoints } from './data/initialSellingPoints';
import { initialCompanies } from './data/initialCompanies';
import { initialContacts } from './data/initialContacts';
import { initialSchedules } from './data/initialSchedules';
import { initialMinisites } from './data/initialMinisites';
import { initialActivityLog } from './data/initialActivityLog';
import { initialInventory } from './data/initialInventory';
import { initialContactAssignments } from './data/initialContactAssignments';
// Phase 2 - New Data Files
import { initialPreIntegrationPoints } from './data/initialPreIntegrationPoints';
import { initialWorkAssignments } from './data/initialWorkAssignments';
import WorkSection from './components/dashboard/WorkSection';
import Sidebar from './components/dashboard/Sidebar';
import Header from './components/dashboard/Header';
import Contacts from './components/contacts/Contacts';
import ContactDetail from './components/contacts/ContactDetail';
import ContactForm from './components/contacts/ContactForm';
import MinisiteDashboard from './components/Minisite/MinisiteDashboard';
import ScheduleDashboard from './components/Schedule/ScheduleDashboard';
import ScheduleDetail from './components/Schedule/ScheduleDetail';
import GlobalSearch from './components/common/GlobalSearch';
import ChatInterface from './components/chat/ChatInterface';
import ActivityHistory from './components/dashboard/ActivityHistory';
import Companies from './components/companies/Companies';
import CompanyDetail from './components/companies/CompanyDetail';
import CompanyForm from './components/companies/CompanyForm';
import AIChatBubble from './components/chat/AIChatBubble';
import Analytics from './components/dashboard/Analytics';
import NotificationsView from './components/dashboard/NotificationsView';
import ProfileView from './components/dashboard/ProfileView';
// Phase 2 - New Components
import PreIntegrationWork from './components/dashboard/PreIntegrationWork';
import AdminWorkManagement from './components/dashboard/AdminWorkManagement';
import EmployeeWorkAssignments from './components/dashboard/EmployeeWorkAssignments';
import EnhancedDashboard from './components/dashboard/EnhancedDashboard';
import { useTimer } from './context/TimerContext';

const App = () => {
  const { resetTimer, pauseTimer, resumeTimer, activeTime } = useTimer();
  // Handle initial view from URL
  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const allParams = {};
    for (const [key, value] of params.entries()) {
      if (key !== 'view') allParams[key] = value;
    }

    if (view) {
      return { view, params: allParams };
    }
    return { view: 'enhanced-dashboard', params: {} };
  };

  const initialState = getInitialState();
  const [currentView, setCurrentView] = useState(initialState.view);
  const [viewParams, setViewParams] = useState(initialState.params);
  const [activePage, setActivePage] = useState((initialState.view === 'dashboard' || initialState.view === 'enhanced-dashboard') ? 'enhanced-dashboard' : initialState.view); // For Sidebar highlight
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [isInitializing, setIsInitializing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navTarget, setNavTarget] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // USERS STATE - Centralized User Management
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('crm_users');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        name: 'Makrem Youssef',
        email: 'makremmakrouma2@gmail.com',
        password: 'makrem123456', // In a real app, this would be hashed
        role: 'Employer Data Specialist',
        status: 'Active',
        lastLogin: '2 mins ago',
        avatar: 'https://ui-avatars.com/api/?name=Makrem&background=4F46E5&color=fff'
      },
      {
        id: 2,
        name: 'System Admin',
        email: 'admin@crmpro.com',
        password: 'admin123',
        role: 'Administrator',
        status: 'Active',
        lastLogin: 'Now',
        avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=dc2626&color=fff'
      }
    ];
  });

  useEffect(() => { localStorage.setItem('crm_users', JSON.stringify(users)); }, [users]);

  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : {
      id: 1,
      name: 'Makrem Youssef',
      role: 'Data Entry Specialist',
      avatar: 'https://ui-avatars.com/api/?name=Makrem+Youssef&background=4F46E5&color=fff'
    };
  });
  useEffect(() => { localStorage.setItem('userData', JSON.stringify(userData)); }, [userData]);

  // Re-sync if URL changes (optional but good for back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const state = getInitialState();
      setCurrentView(state.view);
      setViewParams(state.params);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);



  // --- CHAT STATE ---
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I am your CRM Assistant. How can I help you today?' }
  ]);

  // Team Chat Messages State (Persistent)
  const [teamMessages, setTeamMessages] = useState(() => {
    const saved = localStorage.getItem('teamMessages');
    if (saved) return JSON.parse(saved);
    // Initial mock messages for demo
    return [
      { id: 1, senderId: 2, receiverId: 1, text: "Hey! Did you see the new car dealer from Lyon? I've already scapped 20 listings.", time: '10:30 AM', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
      { id: 2, senderId: 1, receiverId: 2, text: "Yes, looks good. Keep going until 50.", time: '10:32 AM', timestamp: new Date(Date.now() - 86300000).toISOString(), read: true },
    ];
  });

  useEffect(() => { localStorage.setItem('teamMessages', JSON.stringify(teamMessages)); }, [teamMessages]);

  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Simulate an incoming message to demonstrate the notification badge
  useEffect(() => {
    // Only simulate if we haven't already for this session
    if (unreadChatCount === 0) {
      const timer = setTimeout(() => {
        const newMsg = {
          id: Date.now(),
          senderId: 2, // Admin ID
          receiverId: userData?.id || 1,
          text: 'Hey! New leads just arrived from the Lyon campaign. Check them out.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date().toISOString(),
          senderName: 'System Admin',
          read: false
        };
        setTeamMessages(prev => [...prev, newMsg]);
        // Optionally play a sound here
      }, 5000); // 5 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  // Calculate unread count based on actual unread messages
  useEffect(() => {
    const unread = teamMessages.filter(msg => !msg.read && msg.receiverId === userData?.id).length;
    setUnreadChatCount(unread);
  }, [teamMessages, userData]);

  // --- NOTIFICATIONS STATE ---
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Duplicate detected! Selling point ID 100 and 105', time: '5 min ago', read: false },
    { id: 2, type: 'info', message: 'Business now has website', time: '10 min ago', read: true },
    { id: 3, type: 'reminder', message: 'Contact schedule in 5 minutes', time: '15 min ago', read: false },
    { id: 4, type: 'success', message: 'New AI matches available', time: '2 hours ago', read: false }
  ]);



  // Handle actions coming from Minisite Templates (Bridging Website -> CRM)
  const handleWebAction = (action, data) => {
    if (action === 'lead') {
      const newNotif = {
        id: Date.now(),
        type: 'success',
        message: `New Web Lead: ${data.interest || 'General Inquiry'}`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      // Also log it
      logActivity('Lead', 'New Lead captured from Website', { details: data });
      // Optional: Create a Contact (Lead)
      const newContact = {
        id: Date.now(),
        name: 'Website Visitor',
        role: 'Lead',
        company: data.interest || 'Unknown',
        email: 'visitor@example.com',
        phone: 'N/A',
        status: 'New',
        source: 'Website'
      };
      setContacts(prev => [newContact, ...prev]);
    }
  };
  const handleSendMessage = (msgData) => {
    const newMsg = {
      id: Date.now(),
      senderId: userData.id,
      receiverId: msgData.receiverId,
      text: msgData.text,
      type: msgData.type || 'text',
      attachment: msgData.attachment,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      senderName: userData?.name || 'User',
      read: false
    };
    setTeamMessages(prev => [...prev, newMsg]);

    // Simulate other person reading the message after 3 seconds (exclusive of general chat)
    if (msgData.receiverId !== 'general') {
      setTimeout(() => {
        setTeamMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, read: true } : m));
      }, 3000);
    }
  };

  const handleReportBug = (bugData) => {
    // Send to System Admin (ID 2)
    const adminId = 2;
    const newMsg = {
      id: Date.now(),
      senderId: userData.id,
      receiverId: adminId,
      type: 'bug_report',
      bugDetails: bugData,
      status: 'Open',
      text: `Bug Report: ${bugData.description}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    };
    setTeamMessages(prev => [...prev, newMsg]);
  };

  const handleSubmitSuggestion = (suggestionData) => {
    // Send to System Admin (ID 2)
    const adminId = 2;
    const newMsg = {
      id: Date.now(),
      senderId: userData.id,
      receiverId: adminId,
      type: 'suggestion',
      suggestionDetails: suggestionData,
      status: 'Pending Review',
      text: `Suggestion: ${suggestionData.title}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    };
    setTeamMessages(prev => [...prev, newMsg]);
  };

  const handleUpdateStatus = (msgId, newStatus) => {
    setTeamMessages(prev => prev.map(msg =>
      msg.id === msgId ? { ...msg, status: newStatus } : msg
    ));
  };

  const [sellingPoints, setSellingPoints] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [minisites, setMinisites] = useState([]);

  // Data is fetched in the auth-gated useEffect below (runs after login)
  // Do NOT fetch here to avoid race conditions with the authenticated fetch

  // Sync back to local storage only for non-DB persistent states if needed, 
  // but for the main entities we prefer DB now.
  useEffect(() => { localStorage.setItem('sellingPoints', JSON.stringify(sellingPoints)); }, [sellingPoints]);
  useEffect(() => { localStorage.setItem('companies', JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem('contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('minisites', JSON.stringify(minisites)); }, [minisites]);

  // Custom Templates State
  const [customTemplates, setCustomTemplates] = useState(() => {
    const defaultTemplates = [
      {
        id: 'car-dealer-premium-pro',
        name: 'Professional Car Dealer (VIP)',
        description: 'Elite, high-performance animated template for luxury dealerships.',
        type: 'react',
        view: 'template-used-car-dealer-pro',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'primaryColor', label: 'Accent Color', type: 'color', default: '#0ea5e9' },
          { key: 'headerText', label: 'Business Headline', type: 'text', default: 'Luxury Automotive' },
          { key: 'introDescription', label: 'Hero Slogan', type: 'textarea', default: 'Experience Precision & Performance.' }
        ]
      },
      {
        id: 'car-dealer-premium',
        name: 'Modern Car Dealer',
        description: 'Advanced React template for car dealerships (with image gallery & booking)',
        type: 'react',
        view: 'template-used-car-dealer',
        image: 'https://images.unsplash.com/photo-1563720223488-8f2f62a6e71a?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'primaryColor', label: 'Theme Color', type: 'color', default: '#ca8a04' },
          { key: 'headerText', label: 'Dealership Name', type: 'text', default: 'Luxury Motors' },
          { key: 'introDescription', label: 'Welcome Text', type: 'textarea', default: 'Experience Luxury Redefined' }
        ]
      },
      {
        id: 'car-dealer-modern-dark',
        name: 'Neo-Modern Dark',
        description: 'Sleek, futuristic dark mode template with neon accents and high energy.',
        type: 'react',
        view: 'template-modern-dark',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'primaryColor', label: 'Accent Color', type: 'color', default: '#3b82f6' },
          { key: 'headerText', label: 'Logo Name', type: 'text', default: 'Neo Motors' },
          { key: 'introDescription', label: 'Main Headline', type: 'textarea', default: 'Unleashing the Future of Performance' }
        ]
      },
      {
        id: 'car-dealer-minimalist-white',
        name: 'Heritage Minimalist',
        description: 'Clean, elegant, and professional. Perfect for high-end luxury showrooms.',
        type: 'react',
        view: 'template-minimalist-white',
        image: 'https://images.unsplash.com/photo-1542362567-b051c63b9a5c?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'headerText', label: 'Heritage Name', type: 'text', default: 'Heritage Motors' },
          { key: 'introDescription', label: 'Philosophy', type: 'textarea', default: 'Curating Excellence in Motion' }
        ]
      },
      // Real Estate Templates
      {
        id: 'real-estate-luxury',
        name: 'Premium Real Estate Showcase',
        description: 'Luxury property template with high-end typography and sleek dark mode support.',
        type: 'react',
        view: 'template-real-estate-luxury',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Agency Name', type: 'text', default: 'Prestige Properties' },
          { key: 'heroSubtitle', label: 'Headline', type: 'textarea', default: 'Exceptional Properties, Exceptional Living' }
        ]
      },
      {
        id: 'real-estate-modern',
        name: 'Modern Property Portal',
        description: 'Clean, dynamic search-oriented real estate template for robust listings.',
        type: 'react',
        view: 'template-real-estate-modern',
        image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Agency Name', type: 'text', default: 'PropertyHub' },
          { key: 'heroSubtitle', label: 'Main Headline', type: 'text', default: 'Find Your Perfect Space' }
        ]
      },
      {
        id: 'real-estate-clean',
        name: 'Clean Minimalist Real Estate',
        description: 'Editorial-style layout focusing on large imagery and elegant presentation.',
        type: 'react',
        view: 'template-real-estate-clean',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Agency Name', type: 'text', default: 'Estate & Co.' },
          { key: 'heroSubtitle', label: 'Headline', type: 'text', default: 'Properties that inspire.' }
        ]
      },
      {
        id: 'real-estate-warm',
        name: 'Warm Residential Properties',
        description: 'Earthy tones and rounded aesthetics for a cozy, residential feel.',
        type: 'react',
        view: 'template-real-estate-warm',
        image: 'https://images.unsplash.com/photo-1600607687126-8a3414373ebc?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Agency Name', type: 'text', default: 'Warmstone Realty' },
          { key: 'heroSubtitle', label: 'Headline', type: 'text', default: 'Where comfort meets elegance' }
        ]
      },
      // Clothing Templates
      {
        id: 'clothing-urban',
        name: 'Urban Streetwear Shop',
        description: 'Bold, dark, high-contrast theme for modern streetwear and hype fashion.',
        type: 'react',
        view: 'template-clothing-urban',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Shop Name', type: 'text', default: 'URBAN THREADS' },
          { key: 'heroSubtitle', label: 'Headline', type: 'textarea', default: 'STREET STYLE REDEFINED' }
        ]
      },
      {
        id: 'clothing-boutique',
        name: 'Elegant Fashion Boutique',
        description: 'Soft colors and serif typography for classic and romantic fashion collections.',
        type: 'react',
        view: 'template-clothing-boutique',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Boutique Name', type: 'text', default: 'La Boutique' },
          { key: 'heroSubtitle', label: 'Headline', type: 'text', default: 'Elegance in every thread' }
        ]
      },
      {
        id: 'clothing-vintage',
        name: 'Retro & Vintage Store',
        description: 'Hip, old-school layout with courier typography for second-hand/vintage clothing.',
        type: 'react',
        view: 'template-clothing-vintage',
        image: 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Store Name', type: 'text', default: 'RETRO THREADS' },
          { key: 'heroSubtitle', label: 'Headline', type: 'text', default: 'Est. 2024 • Authentic Vintage' }
        ]
      },
      {
        id: 'clothing-minimalist',
        name: 'Minimalist Essentials',
        description: 'Hyper-clean, sparse design focusing purely on the garment.',
        type: 'react',
        view: 'template-clothing-minimalist',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80',
        variables: [
          { key: 'heroTitle', label: 'Brand Name', type: 'text', default: 'STUDIO' },
          { key: 'heroSubtitle', label: 'Headline', type: 'text', default: 'Modern Essentials.' }
        ]
      }
    ];

    const saved = localStorage.getItem('customTemplates');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure we only keep user templates and valid system templates
      // Specifically filter out 'car-dealer-rugged-utility' because user wants it gone
      const merged = [...defaultTemplates, ...parsed].filter(t =>
        t.id !== 'car-dealer-rugged-utility'
      );

      // Dedup by ID (system/default version wins for system IDs)
      // We process defaultTemplates last to ensure they overwrite any stale local versions
      const dedupMap = new Map();
      parsed.forEach(t => dedupMap.set(t.id, t));
      defaultTemplates.forEach(t => dedupMap.set(t.id, t));

      // Also ensure we remove the rugged one from the map if it sneaked in
      dedupMap.delete('car-dealer-rugged-utility');

      return Array.from(dedupMap.values());
    }
    return defaultTemplates;
  });

  useEffect(() => { localStorage.setItem('customTemplates', JSON.stringify(customTemplates)); }, [customTemplates]);

  // Schedules State
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  useEffect(() => { localStorage.setItem('schedules', JSON.stringify(schedules)); }, [schedules]);

  // Activity Log State
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem('activityLog');
    return saved ? JSON.parse(saved) : initialActivityLog;
  });

  useEffect(() => { localStorage.setItem('activityLog', JSON.stringify(activityLog)); }, [activityLog]);

  // Inventory State
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });
  useEffect(() => { localStorage.setItem('inventory', JSON.stringify(inventory)); }, [inventory]);

  // Contact Assignments State
  const [contactAssignments, setContactAssignments] = useState(() => {
    const saved = localStorage.getItem('contactAssignments');
    return saved ? JSON.parse(saved) : initialContactAssignments;
  });
  useEffect(() => { localStorage.setItem('contactAssignments', JSON.stringify(contactAssignments)); }, [contactAssignments]);

  const handleUpdateContactAssignments = (newAssignments) => {
    setContactAssignments(newAssignments);
    logActivity('Update', 'Updated contact assignments');
  };

  // Phase 2 - Pre-Integration Points State
  const [preIntegrationPoints, setPreIntegrationPoints] = useState(() => {
    const saved = localStorage.getItem('preIntegrationPoints');
    return saved ? JSON.parse(saved) : initialPreIntegrationPoints;
  });
  useEffect(() => { localStorage.setItem('preIntegrationPoints', JSON.stringify(preIntegrationPoints)); }, [preIntegrationPoints]);

  // Phase 2 - Work Assignments State
  const [workAssignments, setWorkAssignments] = useState(() => {
    const saved = localStorage.getItem('workAssignments');
    return saved ? JSON.parse(saved) : initialWorkAssignments;
  });
  useEffect(() => { localStorage.setItem('workAssignments', JSON.stringify(workAssignments)); }, [workAssignments]);



  const handleLogin = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    setIsInitializing(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(user));

    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLoginDate');

    resumeTimer(); // Ensure timer runs

    if (lastLogin !== today) {
      // First login of the day
      logActivity('Session', 'Clocked In (Start of Day)', { details: `First login at ${new Date().toLocaleTimeString()}` });
      localStorage.setItem('lastLoginDate', today);
    } else {
      logActivity('Session', 'User Logged In', { details: 'Resuming session' });
    }

    // Experience transition delay
    setTimeout(() => {
      setIsInitializing(false);
    }, 2000);
  };

  const handleLogout = () => {
    logActivity('Session', 'User Logged Out', { details: `Ended at ${new Date().toLocaleTimeString()}` });
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    pauseTimer(); // Stop counting, but save progress for restart today
  };

  const API_BASE_URL = 'https://makubackend.vercel.app';

  // ─── API FETCHING ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { key: 'sellingPoints', url: `${API_BASE_URL}/api/selling-points` },
          { key: 'companies', url: `${API_BASE_URL}/api/companies` },
          { key: 'contacts', url: `${API_BASE_URL}/api/contacts` },
          { key: 'minisites', url: `${API_BASE_URL}/api/minisites` },
          { key: 'schedules', url: `${API_BASE_URL}/api/schedules` },
          { key: 'assignments', url: `${API_BASE_URL}/api/contact-assignments` },
          { key: 'inventory', url: `${API_BASE_URL}/api/inventory` }
        ];

        const results = await Promise.allSettled(
          endpoints.map(e => fetch(e.url).then(r => {
            if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
            return r.json();
          }))
        );

        results.forEach((result, index) => {
          const key = endpoints[index].key;
          if (result.status === 'fulfilled') {
            const data = result.value;
            if (Array.isArray(data)) {
              if (key === 'sellingPoints') setSellingPoints(data);
              else if (key === 'companies') setCompanies(data);
              else if (key === 'contacts') setContacts(data);
              else if (key === 'minisites') setMinisites(data);
              else if (key === 'schedules') setSchedules(data);
              else if (key === 'assignments') setContactAssignments(data);
              else if (key === 'inventory') setInventory(data);
            }
          } else {
            console.error(`Error fetching ${key}:`, result.reason);
          }
        });
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);



  // DAILY WORK STATE
  const [dailyWork, setDailyWork] = useState(() => {
    const saved = localStorage.getItem('crm_daily_work');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => { localStorage.setItem('crm_daily_work', JSON.stringify(dailyWork)); }, [dailyWork]);

  const handleCheckSellingPoint = (spId) => {
    const today = new Date().toISOString().split('T')[0];
    const sp = sellingPoints.find(p => String(p.id) === String(spId));
    if (!sp) return;

    // 1. Update Selling Point checkedBy
    const updatedSP = {
      ...sp,
      checkedBy: [...(sp.checkedBy || []), { userId: userData.id, name: userData.name, timestamp: new Date().toISOString() }],
      lastCheckedAt: new Date().toISOString()
    };
    handleUpdateSellingPoint(updatedSP);

    // 2. Update Daily Work stats
    setDailyWork(prev => {
      const existingToday = prev.find(w => w.date === today && w.userId === userData.id);
      if (existingToday) {
        return prev.map(w => (w.date === today && w.userId === userData.id)
          ? { ...w, checks: [...(w.checks || []), { id: spId, time: new Date().toISOString() }] }
          : w
        );
      }
      return [...prev, {
        date: today,
        userId: userData.id,
        checks: [{ id: spId, time: new Date().toISOString() }],
        creations: [],
        tasks: []
      }];
    });

    logActivity('Check', `Verified selling point: ${sp.name}`, { spId });
  };
  // TASKS STATE
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('crm_tasks');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: 'Check Used Car Dealers - Lyon',
        description: 'Verify all used car dealers in Lyon and identify those without websites.',
        assignedTo: [1],
        createdBy: 2,
        status: 'Pending',
        city: 'Lyon',
        type: 'Analysis',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 2,
        title: 'Create 30 Selling Points',
        description: 'Find and add 30 new automotive businesses in Paris.',
        assignedTo: [1],
        createdBy: 2,
        status: 'In Progress',
        city: 'Paris',
        targetCount: 30,
        currentCount: 12,
        type: 'Creation',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title: 'Recheck IDs: 100, 105',
        description: 'The SIRET numbers for these entries seem incorrect. Please re-verify.',
        assignedTo: [1],
        createdBy: 2,
        status: 'Faulty',
        targetIds: [100, 105],
        type: 'Recheck',
        createdAt: new Date().toISOString()
      }
    ];
  });

  useEffect(() => { localStorage.setItem('crm_tasks', JSON.stringify(tasks)); }, [tasks]);

  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const newTask = await response.json();
      setTasks(prev => [newTask, ...prev]);
      logActivity('Task', `New task assigned: ${newTask.title}`, { replayable: false });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      const data = await response.json();
      setTasks(prev => prev.map(t => t.id === data.id ? data : t));
      if (data.status === 'Completed') {
        logActivity('Task', `Task marked as completed: ${data.title}`, { replayable: false });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Phase 2 - Pre-Integration Handlers
  const handleUpdatePreIntegration = (updatedItem) => {
    setPreIntegrationPoints(prev =>
      prev.map(p => p.id === updatedItem.id ? updatedItem : p)
    );
    logActivity('Update', `Updated pre-integration item: ${updatedItem.businessName}`);
  };

  const handleIntegrateAsSellingPoint = (preIntegrationItem) => {
    // Create new selling point from pre-integration data
    const newSP = {
      id: Date.now(),
      name: preIntegrationItem.businessName,
      address: {
        street: preIntegrationItem.address.split(',')[0] || '',
        city: preIntegrationItem.address.split(',')[1]?.trim() || '',
        country: 'France'
      },
      phone: preIntegrationItem.phone,
      businessType: preIntegrationItem.businessType,
      status: 'Active',
      createdAt: new Date().toISOString(),
      createdBy: { name: userData.name, id: userData.id },
      source: 'Pre-Integration'
    };

    setSellingPoints(prev => [newSP, ...prev]);

    // Update pre-integration item
    const updatedItem = {
      ...preIntegrationItem,
      status: 'Integrated',
      integratedAsId: newSP.id,
      integratedAt: new Date().toISOString()
    };
    handleUpdatePreIntegration(updatedItem);

    // Update daily work counter
    const today = new Date().toISOString().split('T')[0];
    setDailyWork(prev => {
      const existingToday = prev.find(w => w.date === today && w.userId === userData.id);
      if (existingToday) {
        return prev.map(w => (w.date === today && w.userId === userData.id)
          ? { ...w, creations: [...(w.creations || []), { id: newSP.id, time: new Date().toISOString(), type: 'pre-integration' }] }
          : w
        );
      }
      return [...prev, {
        date: today,
        userId: userData.id,
        checks: [],
        creations: [{ id: newSP.id, time: new Date().toISOString(), type: 'pre-integration' }],
        tasks: []
      }];
    });

    logActivity('Create', `Integrated selling point: ${newSP.name}`, {
      fromPreIntegration: preIntegrationItem.id
    });
  };

  const handleBulkUploadPreIntegration = (items) => {
    setPreIntegrationPoints(prev => [...prev, ...items]);
    logActivity('Upload', `Bulk uploaded ${items.length} pre-integration items`);
  };

  const handleAssignPreIntegration = (updatedItem) => {
    handleUpdatePreIntegration(updatedItem);
  };

  // Phase 2 - Work Assignment Handlers
  const handleCreateWorkAssignment = (newWork) => {
    setWorkAssignments(prev => [newWork, ...prev]);
    logActivity('Task', `Created work assignment: ${newWork.type}`, { workId: newWork.id });
  };

  const handleUpdateWorkAssignment = (updatedWork) => {
    setWorkAssignments(prev =>
      prev.map(w => w.id === updatedWork.id ? updatedWork : w)
    );

    // Auto-create follow-up if completed and not already created
    if (updatedWork.status === 'Completed' && !updatedWork.followUpCreated) {
      const followUpTask = {
        id: Date.now(),
        title: `Follow-up: ${updatedWork.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
        description: `Follow up on completed ${updatedWork.type} work`,
        assignedTo: [updatedWork.assignedTo],
        createdBy: 2, // System/Admin
        status: 'Pending',
        type: 'Follow-up',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days later
      };

      handleAddTask(followUpTask);

      // Mark follow-up as created
      setWorkAssignments(prev =>
        prev.map(w => w.id === updatedWork.id ? { ...w, followUpCreated: true } : w)
      );
    }

    logActivity('Update', `Updated work assignment: ${updatedWork.type}`);
  };


  const logActivity = async (type, description, metadata = {}) => {
    try {
      const newActivity = {
        type,
        description,
        performedBy: { name: userData?.name, id: userData?.id },
        metadata
      };
      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity)
      });
      const data = await response.json();
      setActivityLog(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error logging activity:', error);
      // Fallback for UI if API fails
      setActivityLog(prev => [{ id: Date.now(), type, description, timestamp: new Date().toISOString(), performedBy: { name: userData?.name }, metadata }, ...prev]);
    }
  };

  // Upcoming Call Notification Checker
  useEffect(() => {
    const checkSchedules = setInterval(() => {
      const now = new Date();
      schedules.forEach(schedule => {
        if (schedule.status === 'Pending') {
          const callDate = new Date(schedule.date);
          const diffMs = callDate - now;
          const diffMins = Math.round(diffMs / 60000);

          if (diffMins > 0 && diffMins <= 15 && !schedule.notified) {
            const newNotif = {
              id: Date.now(),
              type: 'reminder',
              message: `Upcoming call with ${schedule.sellingPointName} in ${diffMins} minutes!`,
              time: 'Just now',
              read: false,
              link: { view: 'schedule-detail', id: schedule.id }
            };
            setNotifications(prev => [newNotif, ...prev]);
            setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, notified: true } : s));
            logActivity('Notice', `Proximity reminder for schedule #${schedule.id}`);
          }
        }
      });
    }, 60000); // Check every minute
    return () => clearInterval(checkSchedules);
  }, [schedules]);

  const navigateTo = (view, params = {}) => {
    // Show redirecting toast first
    setNavTarget(view);
    setIsNavigating(true);

    // Short cute delay
    setTimeout(() => {
      setCurrentView(view);
      setViewParams(params);

      // Update active page for sidebar based on view
      if (view === 'dashboard') setActivePage('dashboard');
      else if (view === 'selling-points') setActivePage('selling-points');
      else if (view === 'selling-point-detail') setActivePage('selling-points');
      else if (view === 'my-work') setActivePage('my-work');
      else if (view === 'contacts') setActivePage('contacts');
      else if (view === 'contact-detail') setActivePage('contacts');
      else if (view === 'contact-form') setActivePage('contacts');
      else if (view.startsWith('minisite')) setActivePage('minisites');
      else if (view.startsWith('schedule')) setActivePage('schedule');
      else if (view === 'global-search') setActivePage('search');
      else if (view === 'activity-history') setActivePage('history');
      else if (view.startsWith('company')) setActivePage('companies');
      else if (view === 'analytics') setActivePage('analytics');
      else if (view === 'notifications') setActivePage('notifications');
      else if (view === 'chat') setActivePage('chat');
      else if (view === 'settings' || view === 'profile') setActivePage('settings');
      else if (view === 'admin-users') setActivePage('users');
      // Phase 2 - New Routes
      else if (view === 'pre-integration-work') setActivePage('my-work-Pre-Integration');
      else if (view === 'admin-work-management') setActivePage('my-work-Manage Work');
      else if (view === 'employee-work-assignments') setActivePage('my-work-Assignments');
      else if (view === 'enhanced-dashboard') setActivePage('enhanced-dashboard');

      // Log navigation
      if (view !== 'dashboard') {
        logActivity('Navigation', `Viewed ${view.replace(/-/g, ' ')}`, {
          replayable: true,
          view,
          params
        });
      }

      setIsNavigating(false);
    }, 600);
  };

  const handleSidebarNavigation = (path) => {
    // Handle specific paths
    if (path === 'enhanced-dashboard') navigateTo('enhanced-dashboard');
    else if (path === 'dashboard') navigateTo('enhanced-dashboard'); // Default to new dashboard

    // My Work Sub-items handling
    else if (path === 'my-work-Assignments') navigateTo('employee-work-assignments');
    else if (path === 'my-work-Manage Work') navigateTo('admin-work-management');
    else if (path === 'my-work') navigateTo('employee-work-assignments');

    else if (path === 'selling-points') navigateTo('selling-points');
    else if (path === 'contacts') navigateTo('contacts');
    else if (path === 'minisites') navigateTo('minisite-dashboard');
    else if (path === 'schedule') navigateTo('schedule-dashboard');
    else if (path === 'search') navigateTo('global-search');
    else if (path === 'users') navigateTo('admin-users');
    else if (path === "history") navigateTo('activity-history');
    else if (path === 'companies') navigateTo('companies');
    else if (path === 'chat') navigateTo('chat');
    else if (path === 'analytics') navigateTo('analytics');
    else if (path === 'notifications') navigateTo('notifications');
    else if (path === 'settings') navigateTo('settings');

    // Selling Points Sub-items
    else if (path.startsWith('selling-points-')) {
      if (path.includes('Search')) navigateTo('global-search', { activeTab: 'Selling Points' });
      else if (path.includes('Add')) {
        // Since we don't have a specific Add Selling Point form yet, we'll go to the list 
        // or we could show an alert or a modal if it existed. 
        // For now, let's route to the list view as a fallback or if user meant filter.
        // Actually, the user asked specifically for navigation to work. 
        // Best approach is typically to open a form. We'll reuse the logic or create a placeholder if needed.
        // But wait, there isn't a selling-point-form. 
        // Let's just go to selling-points view, which is likely where adding would happen (or via work section).
        navigateTo('selling-point-form');
      }
      else navigateTo('selling-points');
    }

    // Companies Sub-items
    else if (path.startsWith('companies-')) {
      if (path.includes('Search')) navigateTo('global-search', { activeTab: 'Companies' });
      else if (path.includes('Add')) navigateTo('company-form');
      else navigateTo('companies');
    }

    // Contacts Sub-items
    else if (path.startsWith('contacts-')) {
      if (path.includes('Search')) navigateTo('global-search', { activeTab: 'Contacts' });
      else if (path.includes('Add')) navigateTo('contact-form');
      else navigateTo('contacts');
    }

    else if (path === 'minisites-Dashboard') navigateTo('minisite-dashboard');
    else if (path === 'minisites-New Minisite') navigateTo('minisite-templates');
    else if (path === 'minisites-Template Maker') navigateTo('template-maker');

    else {
      // Default fallbacks or unimplemented routes
      console.log('Navigating to:', path);
      navigateTo('dashboard'); // Fallback
    }

    // activePage is now updated inside navigateTo for consistency
    if (path.includes('-')) {
      setActivePage(path);
    }
  };

  // CRUD Operations
  const handleAddContact = async (contactData, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      const contact = await response.json();
      setContacts(prev => [contact, ...prev]);

      logActivity('Create', `Created contact: ${contact.name}`, {
        replayable: false,
        details: `Email: ${contact.email}`
      });

      if (options.sellingPointId) {
        navigateTo('selling-point-detail', { id: options.sellingPointId });
      } else {
        navigateTo('contacts');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleUpdateContact = async (updatedContact) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${updatedContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact)
      });
      const data = await response.json();
      setContacts(prev => prev.map(c => c.id === data.id ? data : c));
      
      logActivity('Edit', `Updated contact: ${data.name}`, {
        replayable: true,
        view: 'contact-detail',
        params: { id: data.id }
      });
      navigateTo('contact-detail', { id: data.id });
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/contacts/${id}`, { method: 'DELETE' });
      setContacts(prev => prev.filter(c => c.id !== id));
      logActivity('Delete', `Deleted contact`, { replayable: false });
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Inventory CRUD
  const handleAddInventory = async (itemData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      const newItem = await response.json();
      setInventory(prev => [newItem, ...prev]);
      logActivity('Create', `Added inventory item: ${newItem.name}`, { replayable: false });
      return newItem;
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  const handleUpdateInventory = async (updatedItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventory/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      const data = await response.json();
      setInventory(prev => prev.map(i => String(i.id) === String(data.id) ? data : i));
      logActivity('Edit', `Updated inventory item: ${data.name}`, { replayable: false });
      return data;
    } catch (error) {
      console.error('Error updating inventory item:', error);
    }
  };

  const handleDeleteInventory = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/inventory/${id}`, { method: 'DELETE' });
      setInventory(prev => prev.filter(i => String(i.id) !== String(id)));
      logActivity('Delete', `Deleted inventory item`, { replayable: false });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  // Minisite CRUD
  const handleAddMinisite = async (minisiteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/minisites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minisiteData)
      });
      const newSite = await response.json();
      setMinisites(prev => [newSite, ...prev]);
      logActivity('minisite', `Created minisite: ${minisiteData.domain}`, { action: 'create' });
      navigateTo('minisite-dashboard');
    } catch (error) {
      console.error('Error adding minisite:', error);
    }
  };

  const handleDeleteMinisite = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/minisites/${id}`, { method: 'DELETE' });
      setMinisites(prev => prev.filter(m => m.id !== id));
      logActivity('Delete', `Deleted minisite`, { replayable: false });
    } catch (error) {
      console.error('Error deleting minisite:', error);
    }
  };

  const handleSaveTemplate = (template) => {
    const exists = customTemplates.find(t => String(t.id) === String(template.id));
    if (exists) {
      setCustomTemplates(prev => prev.map(t => String(t.id) === String(template.id) ? template : t));
    } else {
      setCustomTemplates(prev => [...prev, template]);
    }
    navigateTo('minisite-dashboard');
  };

  const handleUpdateMinisite = async (site) => {
    try {
      const response = await fetch(`http://localhost:5000/api/minisites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site)
      });
      const data = await response.json();
      setMinisites(prev => prev.map(s => s.id === data.id ? data : s));

      // Also update the selling point to link it
      const sp = sellingPoints.find(p => String(p.id) === String(site.sellingPointId));
      if (sp) {
        handleUpdateSellingPoint({
          ...sp,
          website: site.domain
        });
      }

      navigateTo('minisite-dashboard');
    } catch (error) {
      console.error('Error updating minisite:', error);
    }
  };

  // Schedule CRUD
  const handleAddSchedule = async (scheduleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });
      const newSchedule = await response.json();
      setSchedules(prev => [newSchedule, ...prev]);

      logActivity('Schedule', `Scheduled business: ${newSchedule.sellingPointName}`, {
        action: 'schedule_business',
        replayable: true,
        view: 'schedule-detail',
        params: { id: newSchedule.id }
      });
      navigateTo('schedule-detail', { id: newSchedule.id });
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleUpdateSchedule = async (scheduleId, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      setSchedules(prev => prev.map(s => s.id === data.id ? data : s));

      if (updates.status === 'Convinced') {
        logActivity('Schedule', `Marked business convinced: ${data.sellingPointName}`, {
          action: 'mark_convinced',
          scheduleId: data.id
        });
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleMarkConvinced = async (scheduleId) => {
    await handleUpdateSchedule(scheduleId, { isConvinced: true, status: 'Convinced' });
  };

  const handleAddCall = async (scheduleId, callData) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;
    const updatedCalls = [...(schedule.calls || []), callData];
    await handleUpdateSchedule(scheduleId, { calls: updatedCalls });
  };

  const handleReschedule = async (scheduleId, newDate, reason) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;
    const historyEntry = {
      oldDate: schedule.date,
      reason,
      changedBy: userData?.name || 'Myself'
    };
    await handleUpdateSchedule(scheduleId, {
      date: newDate,
      rescheduleHistory: [...(schedule.rescheduleHistory || []), historyEntry]
    });
  };

  const handleDeleteSchedule = async (scheduleId, options) => {
    try {
      await fetch(`${API_BASE_URL}/api/schedules/${scheduleId}`, { method: 'DELETE' });
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));

      if (options.deleteMinisite && options.sellingPointId) {
        const mini = minisites.find(m => String(m.sellingPointId) === String(options.sellingPointId));
        if (mini) handleDeleteMinisite(mini.id);
      }

      if (options.deleteSP && options.sellingPointId) {
        handleDeleteSellingPoint(options.sellingPointId);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  // Company CRUD
  const handleAddCompany = async (newCompany) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany)
      });
      const data = await response.json();
      setCompanies(prev => [data, ...prev]);
      logActivity('Create', `Created company: ${data.name}`, { replayable: false });
      navigateTo('companies');
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const handleQuickAddCompany = async (newCompany) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany)
      });
      const data = await response.json();
      setCompanies(prev => [data, ...prev]);
      logActivity('Create', `Created company (Quick): ${data.name}`, { replayable: false });
      return data;
    } catch (error) {
      console.error('Error quick adding company:', error);
    }
  };

  const handleUpdateCompany = async (updatedCompany) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies/${updatedCompany.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCompany)
      });
      const data = await response.json();
      setCompanies(prev => prev.map(c => c.id === data.id ? data : c));
      logActivity('Edit', `Updated company: ${data.name}`, {
        replayable: true,
        view: 'company-detail',
        params: { id: data.id }
      });
      navigateTo('company-detail', { id: data.id });
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/companies/${id}`, { method: 'DELETE' });
      setCompanies(prev => prev.filter(c => c.id !== id));
      logActivity('Delete', `Deleted company`, { replayable: false });
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  // Selling Points CRUD
  const handleAddSellingPoint = async (newData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/selling-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      const newPoint = await response.json();
      setSellingPoints(prev => [newPoint, ...prev]);

      logActivity('selling_point', `Created selling point: ${newPoint.name}`, { action: 'create', replayable: false });
      navigateTo('selling-point-detail', { id: newPoint.id });
    } catch (error) {
      console.error('Error adding selling point:', error);
    }
  };

  const handleUpdateSellingPoint = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/selling-points/${updatedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      setSellingPoints(prev => prev.map(sp => String(sp.id) === String(data.id) ? data : sp));
      logActivity('selling_point', `Updated selling point: ${data.name}`, { action: 'update', replayable: false });
    } catch (error) {
      console.error('Error updating selling point:', error);
    }
  };

  const handleDeleteSellingPoint = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/selling-points/${id}`, { method: 'DELETE' });
      setSellingPoints(prev => prev.filter(p => p.id !== id));
      logActivity('Delete', `Deleted selling point`, { replayable: false });
      navigateTo('selling-points');
    } catch (error) {
      console.error('Error deleting selling point:', error);
    }
  };

  const handleMergeCompanies = (primaryId, secondaryIds) => {
    const primary = companies.find(c => c.id === primaryId);
    const secondaries = companies.filter(c => secondaryIds.includes(c.id));

    if (!primary || secondaries.length === 0) return;

    // Collect all linked selling points and contacts
    const allLinkedSPs = new Set([
      ...(primary.linkedSellingPoints || []),
      ...secondaries.flatMap(c => c.linkedSellingPoints || [])
    ]);
    const allLinkedContacts = new Set([
      ...(primary.linkedContacts || []),
      ...secondaries.flatMap(c => c.linkedContacts || [])
    ]);

    // Update primary company
    const updatedPrimary = {
      ...primary,
      linkedSellingPoints: Array.from(allLinkedSPs),
      linkedContacts: Array.from(allLinkedContacts)
    };

    // Remove secondaries and update primary
    setCompanies(prev =>
      prev.filter(c => !secondaryIds.includes(c.id))
        .map(c => c.id === primaryId ? updatedPrimary : c)
    );

    logActivity('Merge', `Merged ${secondaries.length} companies into ${primary.name}`, {
      replayable: false,
      details: `Merged: ${secondaries.map(c => c.name).join(', ')}`
    });

    navigateTo('company-detail', { id: primaryId });
  };

  const handleBulkImport = (newItems, options) => {
    const timestamp = Date.now();
    const itemsToAdd = [];
    const newCompanies = [];
    const newContacts = [];

    newItems.forEach((item, index) => {
      // 1. Check for duplicates if option enabled
      if (options?.skipDuplicates) {
        const exists = sellingPoints.some(sp =>
          (item.siret && sp.siret === item.siret) ||
          (sp.name.toLowerCase() === item.name.toLowerCase()) ||
          (String(item.id) === String(sp.id)) || // Added ID check
          (item.businessType && sp.businessType?.toLowerCase() === item.businessType.toLowerCase()) // Added business type check
        );
        if (exists) return; // Skip
      }

      // Add to list
      const newId = Date.now() + index;
      itemsToAdd.push({
        ...item,
        id: newId,
        businessType: item.businessType || 'Used Car Dealer', // Default for demo purposes
        website: `mysitedomaine/usedcardealer/${newId}`,
        chance: 50,
        priority: 'Medium',
        stockImagesTarget: 50,
        stockListings: [],
        announcementProfiles: [],
        createdBy: { name: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin' },
        checkedBy: [],
        status: 'New'
      });

      // 2. Inject Company
      if (options?.injectCompanies && item.companyName) {
        // Check if company exists in existing companies OR in newCompanies array
        const existingCompany = companies.find(c => c.name.toLowerCase() === item.companyName.toLowerCase() || (item.siret && c.siret === item.siret));
        const alreadyAdded = newCompanies.find(nc => nc.name.toLowerCase() === item.companyName.toLowerCase());

        if (!existingCompany && !alreadyAdded) {
          newCompanies.push({
            id: Date.now() + Math.random(),
            name: item.companyName,
            siret: item.siret || '',
            address: item.address,
            contactPerson: item.email || item.phone || '', // heuristic
            industry: 'Unknown',
            linkedSellingPoints: [],
            linkedContacts: []
          });
        }
      }

      // 3. Inject Contact
      if (options?.injectContacts && (item.email || item.phone)) {
        const existingContact = contacts.find(c => (item.email && c.email === item.email) || (item.phone && c.phone === item.phone));
        const alreadyAddedContact = newContacts.find(nc => (item.email && nc.email === item.email) || (item.phone && nc.phone === item.phone));

        if (!existingContact && !alreadyAddedContact) {
          newContacts.push({
            id: Date.now() + Math.random(),
            name: item.name, // Using SP name as contact name proxy if no specific name
            email: item.email || '',
            phone: item.phone || '',
            company: item.companyName || '',
            role: 'Imported Contact',
            avatar: `https://ui-avatars.com/api/?name=${item.name}`
          });
        }
      }
    });

    if (itemsToAdd.length > 0) {
      setSellingPoints(prev => [...prev, ...itemsToAdd]);
      logActivity('Import', `Imported ${itemsToAdd.length} selling points`, { replayable: false });
    }

    if (newCompanies.length > 0) {
      setCompanies(prev => [...prev, ...newCompanies]);
      logActivity('Import', `Created ${newCompanies.length} companies from import`, { replayable: false });
    }

    if (newContacts.length > 0) {
      setContacts(prev => [...prev, ...newContacts]);
      logActivity('Import', `Created ${newContacts.length} contacts from import`, { replayable: false });
    }
  };

  const handleQuickAddContact = async (newContact) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      });
      const data = await response.json();
      setContacts(prev => [data, ...prev]);
      logActivity('Create', `Created contact (Quick): ${data.name}`, { replayable: false });
      return data;
    } catch (error) {
      console.error('Error quick adding contact:', error);
    }
  };


  const renderView = () => {
    switch (currentView) {
      case 'selling-points':
        return <SellingPoints
          sellingPoints={sellingPoints}
          onBack={() => navigateTo('dashboard')}
          onAdd={() => navigateTo('selling-point-form')}
          onImport={handleBulkImport}
          onViewDetail={(id) => navigateTo('selling-point-detail', { id })}
          onDelete={handleDeleteSellingPoint}
          initialFilters={viewParams.filters}
          openImport={viewParams.showImport}
          minisites={minisites}
          schedules={schedules}
        />;
      case 'selling-point-form':
        const spToEdit = viewParams.id ? sellingPoints.find(sp => String(sp.id) === String(viewParams.id)) : null;
        return <SellingPointForm
          onSave={spToEdit ? handleUpdateSellingPoint : handleAddSellingPoint}
          onCancel={() => navigateTo('selling-points')}
          initialData={spToEdit}
          availableCompanies={companies}
          onAddCompany={handleQuickAddCompany}
          availableContacts={contacts}
          onAddContact={handleQuickAddContact}
        />;
      case 'selling-point-detail':
        const spDetail = viewParams.id ? sellingPoints.find(sp => String(sp.id) === String(viewParams.id)) : null;
        return <SellingPointDetail
          onBack={() => {
            if (viewParams.returnTo) navigateTo(viewParams.returnTo, { id: viewParams.returnId });
            else navigateTo('selling-points');
          }}
          sellingPoint={spDetail}
          onUpdate={handleUpdateSellingPoint}
          onNavigate={navigateTo}
          onDelete={handleDeleteSellingPoint}
          onCheck={handleCheckSellingPoint}
          onFlagFaulty={(id, note) => {
            const sp = sellingPoints.find(p => String(p.id) === String(id));
            if (sp) {
              handleUpdateSellingPoint({ ...sp, status: 'Faulty', faultNote: note });
            }
          }}
          minisites={minisites}
          customTemplates={customTemplates}
          onAddMinisite={handleAddMinisite}
          onDeleteMinisite={handleDeleteMinisite}
          companies={companies}
          contacts={contacts}
          inventory={inventory}
          onAddInventory={handleAddInventory}
          onUpdateInventory={handleUpdateInventory}
          onDeleteInventory={handleDeleteInventory}
          contactAssignments={contactAssignments}
          schedules={schedules}
          userData={userData}
          onAddSchedule={handleAddSchedule}
          onUpdateAssignments={handleUpdateContactAssignments}
          viewParams={viewParams}
        />;
      case 'my-work':
        return <WorkSection
          onBack={() => navigateTo('dashboard')}
          onNavigate={navigateTo}
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          dailyWork={dailyWork}
          sellingPoints={sellingPoints}
          users={users}
          currentUser={userData}
        />;

      case 'contacts':
        return <Contacts
          onNavigate={navigateTo}
          contacts={contacts}
          onDelete={handleDeleteContact}
        />;

      case 'contact-detail':
        return <ContactDetail
          onBack={() => {
            if (viewParams.returnTo) navigateTo(viewParams.returnTo, { id: viewParams.returnId });
            else navigateTo('contacts');
          }}
          contactId={viewParams.id}
          contacts={contacts}
          onEdit={(id) => navigateTo('contact-form', { id })}
          onDelete={handleDeleteContact}
          onUpdate={handleUpdateContact}
          onNavigate={navigateTo}
          sellingPoints={sellingPoints}
          companies={companies}
          contactAssignments={contactAssignments}
          onUpdateAssignments={handleUpdateContactAssignments}
          viewParams={viewParams}
        />;

      case 'contact-form':
        const contactToEdit = viewParams.id ? contacts.find(c => c.id === viewParams.id) : null;
        return <ContactForm
          onSave={(data) => {
            if (contactToEdit) {
              handleUpdateContact(data);
            } else {
              // Pass options for new contact if coming from selling point detail
              const options = viewParams.returnTo === 'selling-point-detail' ? { sellingPointId: viewParams.sellingPointId } : {};
              handleAddContact(data, options);
            }
          }}
          onCancel={() => {
            if (viewParams.returnTo === 'selling-point-detail' && viewParams.sellingPointId) {
              navigateTo('selling-point-detail', { id: viewParams.sellingPointId });
            } else {
              navigateTo('contacts');
            }
          }}
          initialData={contactToEdit}
          viewParams={viewParams}
          onNavigate={navigateTo}
        />;

      case 'minisite-dashboard':
        return <MinisiteDashboard
          onNavigate={navigateTo}
          minisites={minisites}
          onDelete={handleDeleteMinisite}
          onUpdate={handleUpdateMinisite}
          customTemplates={customTemplates}
          sellingPoints={sellingPoints}
          viewParams={viewParams}
        />;

      case 'schedule-dashboard':
        return <ScheduleDashboard
          schedules={schedules}
          minisites={minisites}
          onNavigate={navigateTo}
          userData={userData}
          users={users}
        />;

      case 'schedule-detail':
        return <ScheduleDetail
          scheduleId={viewParams.id}
          schedules={schedules}
          minisites={minisites}
          customTemplates={customTemplates}
          onBack={() => {
            if (viewParams.returnTo) navigateTo(viewParams.returnTo, { id: viewParams.returnId, activeTab: viewParams.activeTab });
            else navigateTo('schedule-dashboard');
          }}
          onAddCall={handleAddCall}
          onReschedule={handleReschedule}
          onUpdate={handleUpdateSchedule}
          onDelete={handleDeleteSchedule}
          onNavigateToMinisite={(spId) => {
            // Pre-select the selling point in generator
            navigateTo('minisite-templates');
            // Note: In a real implementation, we'd pass the SP ID to auto-select
          }}
          viewParams={viewParams}
          onNavigate={navigateTo}
        />;

      case 'global-search':
        return <GlobalSearch
          contacts={contacts}
          schedules={schedules}
          minisites={minisites}
          sellingPoints={sellingPoints}
          companies={companies}
          onNavigate={navigateTo}
          initialTab={viewParams.activeTab}
          initialQuery={viewParams.query}
        />;

      case 'activity-history':
        // Filter history to only show the current user's actions (distinct history)
        const myHistory = activityLog.filter(log => String(log.performedBy?.id) === String(userData?.id));
        return <ActivityHistory
          activityLog={myHistory}
          onReplay={(activity) => {
            if (activity.metadata?.view) {
              // Time Machine Replay Logic: Restore view and parameters
              navigateTo(activity.metadata.view, activity.metadata.params || {});
            }
          }}
        />;

      case 'companies':
        return <Companies
          companies={companies}
          onNavigate={navigateTo}
          onDelete={handleDeleteCompany}
          onMerge={handleMergeCompanies}
        />;

      case 'chat':
        return <ChatInterface
          currentUser={userData}
          allMessages={teamMessages}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onMarkRead={(senderId) => {
            setTeamMessages(prev => prev.map(msg =>
              (msg.senderId === senderId && msg.receiverId === userData.id) ? { ...msg, read: true } : msg
            ));
          }}
          onAttachItem={(type, item) => console.log('Attach', type, item)}
          users={users}
        />;

      case 'company-detail':
        return <CompanyDetail
          companyId={viewParams.id}
          companies={companies}
          sellingPoints={sellingPoints}
          contacts={contacts}
          onBack={() => {
            if (viewParams.returnTo) navigateTo(viewParams.returnTo, { id: viewParams.returnId });
            else navigateTo('companies');
          }}
          onEdit={(id) => navigateTo('company-form', { id })}
          onDelete={handleDeleteCompany}
          onNavigate={navigateTo}
          onUpdate={handleUpdateCompany}
          viewParams={viewParams}
        />;

      case 'template-used-car-dealer-pro':
        const siteConfigPro = viewParams.id ? minisites.find(s => String(s.id) === String(viewParams.id)) : null;
        if (siteConfigPro && siteConfigPro.isActive === false) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white text-2xl font-bold">This website is currently offline.</div>;
        const spForTemplatePro = siteConfigPro ? sellingPoints.find(sp => String(sp.id) === String(siteConfigPro.sellingPointId)) : null;
        const mergedSPPro = spForTemplatePro ? {
          ...spForTemplatePro,
          overrides: siteConfigPro?.overrides || {},
          stock: inventory.filter(inv => String(inv.sellingPointId) === String(spForTemplatePro.id))
        } : null;
        return <TemplateUsedCarDealerPro sellingPoint={mergedSPPro} onAction={(type, data) => handleWebAction(type, data)} />;

      case 'template-used-car-dealer':
        const siteConfig = viewParams.id ? minisites.find(s => String(s.id) === String(viewParams.id)) : null;
        if (siteConfig && siteConfig.isActive === false) return <div className="h-screen bg-gray-50 flex items-center justify-center text-gray-500 text-2xl font-bold">This website is currently offline.</div>;
        const spForTemplate = siteConfig ? sellingPoints.find(sp => String(sp.id) === String(siteConfig.sellingPointId)) : null;
        const mergedSP = spForTemplate ? {
          ...spForTemplate,
          overrides: siteConfig?.overrides || {},
          stock: inventory.filter(inv => String(inv.sellingPointId) === String(spForTemplate.id))
        } : null;
        return <TemplateUsedCarDealer sellingPoint={mergedSP} onAction={(type, data) => handleWebAction(type, data)} />;

      case 'template-modern-dark':
        const siteConfigMD = viewParams.id ? minisites.find(s => String(s.id) === String(viewParams.id)) : null;
        if (siteConfigMD && siteConfigMD.isActive === false) return <div className="h-screen bg-black flex items-center justify-center text-blue-500 text-2xl font-bold">Protocol Offline.</div>;
        const spMD = siteConfigMD ? sellingPoints.find(sp => String(sp.id) === String(siteConfigMD.sellingPointId)) : null;
        const mergedSPMD = spMD ? {
          ...spMD,
          overrides: siteConfigMD?.overrides || {},
          stock: inventory.filter(inv => String(inv.sellingPointId) === String(spMD.id))
        } : null;
        return <TemplateModernDark sellingPoint={mergedSPMD} onAction={(type, data) => handleWebAction(type, data)} />;

      case 'template-minimalist-white':
        const siteConfigMW = viewParams.id ? minisites.find(s => String(s.id) === String(viewParams.id)) : null;
        if (siteConfigMW && siteConfigMW.isActive === false) return <div className="h-screen bg-white flex items-center justify-center text-gray-300 text-2xl font-bold italic">Currently Private.</div>;
        const spForTemplateMW = siteConfigMW ? sellingPoints.find(sp => String(sp.id) === String(siteConfigMW.sellingPointId)) : null;
        const mergedSPMW = spForTemplateMW ? {
          ...spForTemplateMW,
          overrides: siteConfigMW?.overrides || {},
          stock: inventory.filter(inv => String(inv.sellingPointId) === String(spForTemplateMW.id))
        } : null;
        return <TemplateMinimalistWhite sellingPoint={mergedSPMW} onAction={(type, data) => handleWebAction(type, data)} />;

      case 'template-real-estate-luxury':
      case 'template-real-estate-modern':
      case 'template-real-estate-clean':
      case 'template-real-estate-warm':
      case 'template-clothing-urban':
      case 'template-clothing-boutique':
      case 'template-clothing-vintage':
      case 'template-clothing-minimalist': {
        const tSiteConfig = viewParams.id ? minisites.find(s => String(s.id) === String(viewParams.id)) : null;
        if (tSiteConfig && tSiteConfig.isActive === false) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">This website is currently offline.</div>;
        const tSP = tSiteConfig ? sellingPoints.find(sp => String(sp.id) === String(tSiteConfig.sellingPointId)) : null;
        const tMergedSP = tSP ? {
          ...tSP,
          overrides: tSiteConfig?.overrides || {},
          stock: inventory.filter(inv => String(inv.sellingPointId) === String(tSP.id))
        } : null;

        if (view === 'template-real-estate-luxury') return <TemplateRealEstateLuxury sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        if (view === 'template-real-estate-modern') return <TemplateRealEstateModern sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        if (view === 'template-real-estate-clean') return <TemplateRealEstateClean sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        if (view === 'template-real-estate-warm') return <TemplateRealEstateWarm sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        if (view === 'template-clothing-urban') return <TemplateClothingUrban sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        if (view === 'template-clothing-boutique') return <TemplateClothingBoutique sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        if (view === 'template-clothing-vintage') return <TemplateClothingVintage sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        if (view === 'template-clothing-minimalist') return <TemplateClothingMinimalist sellingPoint={tMergedSP} onAction={(type, data) => handleWebAction(type, data)} />;
        return null;
      }

      case 'custom-template':
        const siteData = minisites.find(s => String(s.id) === String(viewParams.id));
        if (siteData) {
          const tmpl = customTemplates.find(t => String(t.id) === String(siteData.templateId));
          if (tmpl) {
            let html = tmpl.code;
            Object.entries(siteData.overrides || {}).forEach(([key, value]) => {
              const regex = new RegExp(`{{${key}}}`, 'g');
              html = html.replace(regex, value);
            });
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
          }
        }
        return <div className="p-20 text-center text-gray-400">Template or Minisite not found</div>;

      case 'company-form':
        const companyToEdit = viewParams.id ? companies.find(c => c.id === viewParams.id) : null;
        return <CompanyForm
          onSave={companyToEdit ? handleUpdateCompany : handleAddCompany}
          onCancel={() => navigateTo('companies')}
          initialData={companyToEdit}
        />;

      case 'analytics':
        return <Analytics
          sellingPoints={sellingPoints}
          companies={companies}
          contacts={contacts}
          minisites={minisites}
          activityLog={activityLog}
          dailyWork={dailyWork}
          users={users}
          currentUser={userData}
          workAssignments={workAssignments}
          preIntegrationPoints={preIntegrationPoints}
        />;

      // Phase 2 - New Views
      case 'enhanced-dashboard':
        return <EnhancedDashboard
          sellingPoints={sellingPoints}
          companies={companies}
          contacts={contacts}
          minisites={minisites}
          dailyWork={dailyWork}
          workAssignments={workAssignments}
          preIntegrationPoints={preIntegrationPoints}
          currentUser={userData}
          onNavigate={navigateTo}
          activeTime={activeTime}
          activityLog={activityLog} // Added for counters
        />;

      case 'pre-integration-work':
        return <PreIntegrationWork
          preIntegrationPoints={preIntegrationPoints}
          onUpdatePreIntegration={handleUpdatePreIntegration}
          onIntegrateAsSellingPoint={handleIntegrateAsSellingPoint}
          currentUser={userData}
          onBack={() => navigateTo('my-work')}
        />;

      case 'admin-work-management':
        return <AdminWorkManagement
          preIntegrationPoints={preIntegrationPoints}
          workAssignments={workAssignments}
          sellingPoints={sellingPoints}
          users={users}
          onAddPreIntegration={(item) => setPreIntegrationPoints(prev => [...prev, item])}
          onBulkUploadPreIntegration={handleBulkUploadPreIntegration}
          onAssignPreIntegration={handleAssignPreIntegration}
          onCreateWorkAssignment={handleCreateWorkAssignment}
          onUpdateWorkAssignment={handleUpdateWorkAssignment}
          onBack={() => navigateTo('enhanced-dashboard')}
          currentUser={userData}
        />;

      case 'employee-work-assignments':
        return <EmployeeWorkAssignments
          workAssignments={workAssignments}
          preIntegrationPoints={preIntegrationPoints}
          sellingPoints={sellingPoints}
          onUpdateWorkAssignment={handleUpdateWorkAssignment}
          onUpdatePreIntegration={handleUpdatePreIntegration}
          onIntegrateAsSellingPoint={handleIntegrateAsSellingPoint}
          onNavigate={navigateTo}
          currentUser={userData}
          onBack={() => navigateTo('enhanced-dashboard')}
        />;

      case 'notifications':
        return <NotificationsView
          notifications={notifications}
          onUpdate={setNotifications} // Allow view to update read status/delete
        />;

      case 'profile':
      case 'settings':
        return <ProfileView
          userData={userData}
          onUpdateUser={setUserData}
        />;

      case 'admin-users':
        if (userData.role !== 'Administrator') return <div className="p-20 text-center text-red-500 font-bold">Access Denied</div>;
        return <UserManagement
          users={users}
          onAddUser={(newUser) => {
            const userWithId = { ...newUser, id: Date.now(), lastLogin: 'Never', status: 'Active' };
            setUsers(prev => [...prev, userWithId]);
            logActivity('User Management', `Created new user: ${newUser.name} as ${newUser.role}`);
          }}
          onUpdateUser={(updatedUser) => {
            setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            logActivity('User Management', `Updated user profile: ${updatedUser.name}`);
          }}
          onDeleteUser={(userId) => {
            const user = users.find(u => u.id === userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            logActivity('User Management', `Deleted user: ${user?.name}`);
          }}
          activityLog={activityLog} // Pass activity log for history view
        />;

      case 'dashboard':
      default:
        return <Dashboard3
          onNavigate={navigateTo}
          sellingPoints={sellingPoints}
          companies={companies}
          contacts={contacts}
          activityLog={activityLog}
          onReportBug={handleReportBug}
          onSubmitSuggestion={handleSubmitSuggestion}
          userData={userData}
          dailyWork={dailyWork}
          schedules={schedules}
          minisites={minisites}
        />;
    }
  };

  // If we are viewing a template (e.g. "Live Site Demo" in a new tab), render ONLY the template
  if (currentView.startsWith('template-')) {
    return renderView();
  }

  // If not authenticated, force Login screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  // Attractive initialization delay
  if (isInitializing) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
        {/* Animated logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50 relative z-10 animate-bounce">
            <span className="text-3xl font-black text-white italic">P</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Initializing Workspace</h2>
        <p className="text-slate-400 text-sm font-medium mb-8">Synchronizing enterprise data protocols...</p>

        {/* Progress bar */}
        <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-1/2 rounded-full animate-initial-load"></div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          Secure Session Verified
        </div>

        <style jsx>{`
          @keyframes initial-load {
            0% { transform: translateX(-100%); width: 30%; }
            50% { transform: translateX(50%); width: 60%; }
            100% { transform: translateX(250%); width: 30%; }
          }
          .animate-initial-load {
            animation: initial-load 1.8s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Persistent Sidebar */}
      {/* Persistent Sidebar */}
      <Sidebar
        unreadChatCount={unreadChatCount}
        activePage={activePage}
        userData={userData}
        onNavigate={handleSidebarNavigation}
        onLogout={handleLogout}
        mobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area with Header */}
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden relative">
        <Header
          userData={userData}
          notifications={notifications}
          onNavigate={navigateTo}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>

        <AIChatBubble
          messages={chatMessages}
          setMessages={setChatMessages}
          onAction={(action) => {
            if (action.type === 'add_sp') navigateTo('selling-point-form');
            // other actions...
          }}
        />

        {/* Redirect Alert Toast - Top Center of Workspace */}
        {isNavigating && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-full max-w-xs flex justify-center px-4">
            <div className="pointer-events-auto animate-pop-in bg-white/95 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl px-4 py-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              </div>
              <div className="flex flex-col pr-2">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-0.5">Redirecting</p>
                <p className="text-xs font-bold text-slate-800 capitalize truncate max-w-[120px]">
                  {navTarget.replace(/-/g, ' ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>


      <style jsx>{`
        @keyframes slide-down {
          0% { transform: translateY(-100%) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;