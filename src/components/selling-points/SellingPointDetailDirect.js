import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANNOUNCEMENT_SITES, ANNOUNCEMENT_TYPES, COUNTRIES, BUSINESS_TYPES } from '../../data/constants';

// Import existing sub-components
import Header from './detail/Header';
import BasicInfo from './detail/BasicInfo';
import AddressInfo from './detail/AddressInfo';
import AnnouncementProfiles from './detail/AnnouncementProfiles';
import ContactsList from './detail/ContactsList';
import HistoryList from './detail/HistoryList';
import QuickActions from './detail/QuickActions';
import LogosNotes from './detail/LogosNotes';
import PhoneNumbers from './detail/PhoneNumbers';
import EmailAddresses from './detail/EmailAddresses';
import SocialMedia from './detail/SocialMedia';
import { GenericModal, AIModal, DeduplicateModal, PublishModal, ScheduleModal } from './detail/Modals';

const SellingPointDetailDirect = ({
    onBack,
    sellingPointId,
    onUpdate,
    onNavigate,
    onDelete,
    minisites = [],
    customTemplates = [],
    onAddMinisite,
    onDeleteMinisite,
    companies = [],
    contacts = [],
    onAddContact,
    onEditContact,
    onDeleteContact,
    onCheck,
    onPublish,
    onSchedule,
    activities = [],
    schedules = []
}) => {
    const [sellingPoint, setSellingPoint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch selling point data directly from backend
    useEffect(() => {
        const fetchSellingPoint = async () => {
            if (!sellingPointId) {
                setError('No selling point ID provided');
                setLoading(false);
                return;
            }

            try {
                console.log('🔍 Direct fetch: Fetching selling point with ID:', sellingPointId);
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://makubackend.vercel.app/api'}/selling-points/${sellingPointId}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Selling point not found');
                    } else {
                        setError(`Error: ${response.status} ${response.statusText}`);
                    }
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                console.log('🔍 Direct fetch: Selling point data received:', data);
                setSellingPoint(data);
                setLoading(false);
            } catch (err) {
                console.error('🔍 Direct fetch: Error fetching selling point:', err);
                setError('Failed to fetch selling point');
                setLoading(false);
            }
        };

        fetchSellingPoint();
    }, [sellingPointId]);

    // State for modals
    const [showAIModal, setShowAIModal] = useState(false);
    const [showDeduplicateModal, setShowDeduplicateModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false);
    const [genericModalContent, setGenericModalContent] = useState({});

    // Modal handlers
    const handleOpenAIModal = () => setShowAIModal(true);
    const handleCloseAIModal = () => setShowAIModal(false);
    const handleOpenDeduplicateModal = () => setShowDeduplicateModal(true);
    const handleCloseDeduplicateModal = () => setShowDeduplicateModal(false);
    const handleOpenPublishModal = () => setShowPublishModal(true);
    const handleClosePublishModal = () => setShowPublishModal(false);
    const handleOpenScheduleModal = () => setShowScheduleModal(true);
    const handleCloseScheduleModal = () => setShowScheduleModal(false);

    const handleOpenGenericModal = (title, content) => {
        setGenericModalContent({ title, content });
        setShowGenericModal(true);
    };
    const handleCloseGenericModal = () => setShowGenericModal(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading selling point...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong>Error:</strong> {error}
                    </div>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!sellingPoint) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                        <strong>Selling Point not found</strong>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Render the selling point detail using existing components
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header
                sellingPoint={sellingPoint}
                onBack={onBack}
                onEdit={() => onNavigate('selling-point-form', { id: sellingPoint.id })}
                onDelete={() => onDelete(sellingPoint.id)}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <BasicInfo
                            sellingPoint={sellingPoint}
                            onUpdate={onUpdate}
                        />
                        <AddressInfo
                            sellingPoint={sellingPoint}
                            onUpdate={onUpdate}
                        />
                        <PhoneNumbers
                            sellingPoint={sellingPoint}
                            onUpdate={onUpdate}
                        />
                        <EmailAddresses
                            sellingPoint={sellingPoint}
                            onUpdate={onUpdate}
                        />
                        <SocialMedia
                            sellingPoint={sellingPoint}
                            onUpdate={onUpdate}
                        />
                    </div>

                    {/* Right Column - Actions & History */}
                    <div className="space-y-6">
                        <QuickActions
                            sellingPoint={sellingPoint}
                            onAI={handleOpenAIModal}
                            onDeduplicate={handleOpenDeduplicateModal}
                            onPublish={handleOpenPublishModal}
                            onSchedule={handleOpenScheduleModal}
                            onCheck={onCheck}
                        />
                        <LogosNotes
                            sellingPoint={sellingPoint}
                            onUpdate={onUpdate}
                        />
                        <AnnouncementProfiles
                            sellingPoint={sellingPoint}
                            onUpdate={onUpdate}
                        />
                        <ContactsList
                            contacts={(contacts || []).filter(c => c.selling_point_id === sellingPoint.id)}
                            onAdd={onAddContact}
                            onEdit={onEditContact}
                            onDelete={onDeleteContact}
                        />
                        <HistoryList
                            activities={(activities || []).filter(a => a.entity_id === sellingPoint.id && a.entity_type === 'selling_point')}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAIModal && <AIModal onClose={handleCloseAIModal} />}
            {showDeduplicateModal && <DeduplicateModal onClose={handleCloseDeduplicateModal} />}
            {showPublishModal && <PublishModal onClose={handleClosePublishModal} />}
            {showScheduleModal && <ScheduleModal onClose={handleCloseScheduleModal} />}
            {showGenericModal && (
                <GenericModal
                    title={genericModalContent.title}
                    content={genericModalContent.content}
                    onClose={handleCloseGenericModal}
                />
            )}
        </div>
    );
};

export default SellingPointDetailDirect;
