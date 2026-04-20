import React, { useState } from 'react';

const TemplateRealEstateModern = ({ sellingPoint, onAction }) => {
    const [activeTab, setActiveTab] = useState('All');
    const sp = sellingPoint || {};
    const overrides = sp.overrides || {};
    const stock = sp.stock || [];
    const tabs = ['All', 'For Sale', 'For Rent', 'New Build', 'Commercial'];

    const getListings = () => {
        const rawListings = (!stock.length) ? (sp.announcementProfiles?.flatMap(p => p.stockListings || []) || []) : stock;
        return rawListings.map(item => ({
            ...item,
            ...(item.attributes || {}),
            image: item.image || item.imageUrls?.[0]
        }));
    };
    const listings = getListings();

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8f9fa', color: '#1a1a2e', minHeight: '100vh' }}>
            <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 40px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '16px' }}>P</div>
                    <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e' }}>{overrides.heroTitle || sp.name || 'PropertyHub'}</h1>
                </div>
                <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', borderRadius: '10px', padding: '4px' }}>
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#4F46E5' : '#666', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
                            {tab}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#999' }}>{sp.phones?.[0]?.number || ''}</span>
                </div>
            </nav>

            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
                <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '44px', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
                        {overrides.heroSubtitle || 'Find Your Perfect Space'}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                        {overrides.heroDescription || sp.description || 'Browse our curated collection of premium properties.'}
                    </p>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '8px', display: 'flex', gap: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', maxWidth: '560px', margin: '0 auto' }}>
                        <input placeholder="Search by location, type..." style={{ flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: '14px', borderRadius: '10px' }} />
                        <button style={{ padding: '12px 24px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>Search</button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px', background: '#fff', borderBottom: '1px solid #eee' }}>
                {[{ n: listings.length, l: 'Active Listings' }, { n: '50+', l: 'Happy Clients' }, { n: '15+', l: 'Years Experience' }].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '28px', fontWeight: 800, color: '#4F46E5' }}>{s.n}</p>
                        <p style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>{s.l}</p>
                    </div>
                ))}
            </div>

            {/* Listings */}
            <section style={{ padding: '60px 40px', maxWidth: '1300px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px' }}>Available Properties</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                <img src={item.image || item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                                    <span style={{ background: '#4F46E5', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                                        {item.listingType === 'for-rent' ? 'Rent' : 'Sale'}
                                    </span>
                                    {item.propertyCondition && <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700 }}>{item.propertyCondition}</span>}
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: '#1a1a2e' }}>{item.name || 'Property'}</h4>
                                <p style={{ color: '#999', fontSize: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {item.propertyAddress || 'Location TBD'}</p>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    {item.bedrooms && <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>🛏 {item.bedrooms}</span>}
                                    {item.bathrooms && <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>🚿 {item.bathrooms}</span>}
                                    {item.surface && <span style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>📐 {item.surface}m²</span>}
                                    {item.energyRating && <span style={{ background: '#dcfce7', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#15803d' }}>⚡ {item.energyRating}</span>}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#4F46E5' }}>€{Number(item.price || 0).toLocaleString()}{item.listingType === 'for-rent' ? '/mo' : ''}</span>
                                    <button style={{ padding: '8px 16px', background: '#4F46E5', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>View →</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {listings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '16px', border: '2px dashed #e5e7eb' }}>
                        <p style={{ fontSize: '42px', marginBottom: '12px' }}>🏡</p>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: '#374151' }}>No listings available yet</p>
                    </div>
                )}
            </section>

            <footer style={{ background: '#1a1a2e', padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '13px' }}>© {new Date().getFullYear()} {sp.name || 'PropertyHub'}</p>
            </footer>
        </div>
    );
};

export default TemplateRealEstateModern;
