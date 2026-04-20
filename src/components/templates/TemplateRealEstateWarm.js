import React, { useState } from 'react';

const TemplateRealEstateWarm = ({ sellingPoint, onAction }) => {
    const [activeTab, setActiveTab] = useState('All');
    const sp = sellingPoint || {};
    const overrides = sp.overrides || {};
    const stock = sp.stock || [];
    const tabs = ['All', 'For Sale', 'For Rent', 'New Build', 'Commercial', 'Vacation'];
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
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#faf7f2', color: '#2d2a26', minHeight: '100vh' }}>
            <nav style={{ background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e8e0d4', padding: '0 40px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🏡</span>
                    <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#8b6914' }}>{overrides.heroTitle || sp.name || 'Warmstone Realty'}</h1>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {tabs.map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', background: activeTab === t ? '#8b6914' : 'transparent', color: activeTab === t ? '#fff' : '#8b7b5e', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{t}</button>
                    ))}
                </div>
            </nav>

            {/* Hero */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '460px' }}>
                <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ color: '#8b6914', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Welcome Home</span>
                    <h2 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', color: '#2d2a26' }}>
                        {overrides.heroSubtitle || 'Where comfort meets elegance'}
                    </h2>
                    <p style={{ color: '#8b7b5e', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                        {overrides.heroDescription || sp.description || 'Handpicked properties styled for modern living.'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ padding: '12px 28px', background: '#8b6914', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Explore Listings</button>
                        <button style={{ padding: '12px 28px', background: 'transparent', color: '#8b6914', border: '1.5px solid #8b6914', borderRadius: '25px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>Schedule Visit</button>
                    </div>
                </div>
                <div style={{ overflow: 'hidden', borderRadius: '0 0 0 40px' }}>
                    <img src={overrides.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=960&q=80'} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>

            {/* Listings */}
            <section style={{ padding: '60px 40px', maxWidth: '1300px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Our Properties</h3>
                <p style={{ color: '#8b7b5e', marginBottom: '32px' }}>{listings.length} properties available</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e8e0d4', boxShadow: '0 4px 12px rgba(139,105,20,0.06)' }}>
                            <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                                <img src={item.image || item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#8b6914', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                                    {item.listingType === 'for-rent' ? 'Rent' : item.listingType === 'vacation-rental' ? 'Vacation' : 'Sale'}
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{item.name || 'Beautiful Property'}</h4>
                                <p style={{ color: '#8b7b5e', fontSize: '12px', marginBottom: '14px' }}>📍 {item.propertyAddress || 'Location available'}</p>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                                    {item.bedrooms && <span style={{ background: '#faf7f2', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#6b5d3e' }}>🛏 {item.bedrooms} bed</span>}
                                    {item.bathrooms && <span style={{ background: '#faf7f2', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#6b5d3e' }}>🚿 {item.bathrooms} bath</span>}
                                    {item.surface && <span style={{ background: '#faf7f2', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#6b5d3e' }}>📐 {item.surface}m²</span>}
                                </div>
                                <div style={{ borderTop: '1px solid #f0ece4', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#8b6914' }}>€{Number(item.price || 0).toLocaleString()}</span>
                                    <button style={{ padding: '6px 14px', background: '#faf7f2', color: '#8b6914', border: '1px solid #e8e0d4', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {listings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', border: '2px dashed #e8e0d4' }}>
                        <p style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</p>
                        <p style={{ fontWeight: 700 }}>No properties listed yet</p>
                    </div>
                )}
            </section>

            <footer style={{ background: '#2d2a26', padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#6b5d3e', fontSize: '13px' }}>© {new Date().getFullYear()} {sp.name || 'Warmstone Realty'}</p>
            </footer>
        </div>
    );
};

export default TemplateRealEstateWarm;
