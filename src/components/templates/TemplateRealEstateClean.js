import React, { useState } from 'react';

const TemplateRealEstateClean = ({ sellingPoint, onAction }) => {
    const [activeTab, setActiveTab] = useState('All');
    const sp = sellingPoint || {};
    const overrides = sp.overrides || {};
    const stock = sp.stock || [];
    const tabs = ['All', 'For Sale', 'For Rent', 'Vacation', 'Land'];
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
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', color: '#111', minHeight: '100vh' }}>
            <nav style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 48px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>{overrides.heroTitle || sp.name || 'Estate & Co.'}</h1>
                <div style={{ display: 'flex', gap: '24px' }}>
                    {tabs.map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', borderBottom: activeTab === t ? '2px solid #111' : '2px solid transparent', padding: '18px 0', color: activeTab === t ? '#111' : '#999', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>{t}</button>
                    ))}
                </div>
                <button style={{ padding: '8px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Contact</button>
            </nav>

            {/* Hero - Minimal */}
            <div style={{ padding: '100px 48px 60px', maxWidth: '800px' }}>
                <p style={{ color: '#999', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>Premium Real Estate</p>
                <h2 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '20px' }}>
                    {overrides.heroSubtitle || 'Properties that inspire.'}
                </h2>
                <p style={{ color: '#888', fontSize: '16px', lineHeight: 1.7, maxWidth: '540px' }}>
                    {overrides.heroDescription || sp.description || 'Every home tells a story. Find the one that speaks to you.'}
                </p>
            </div>

            {/* Listings */}
            <section style={{ padding: '0 48px 80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i} style={{ cursor: 'pointer' }}>
                            <div style={{ height: '280px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                                <img src={item.image || item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{item.name || 'Property'}</h4>
                                    <p style={{ color: '#888', fontSize: '13px' }}>{item.propertyAddress || 'Address available on request'}</p>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px', color: '#666', fontSize: '12px', fontWeight: 600 }}>
                                        {item.bedrooms && <span>{item.bedrooms} bed</span>}
                                        {item.bathrooms && <span>{item.bathrooms} bath</span>}
                                        {item.surface && <span>{item.surface} m²</span>}
                                    </div>
                                </div>
                                <span style={{ fontSize: '18px', fontWeight: 800, whiteSpace: 'nowrap' }}>€{Number(item.price || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {listings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#ccc' }}>
                        <p style={{ fontSize: '18px', fontWeight: 700 }}>No properties listed</p>
                    </div>
                )}
            </section>

            <footer style={{ borderTop: '1px solid #eee', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: '#ccc', fontSize: '12px' }}>© {new Date().getFullYear()} {sp.name}</p>
                <p style={{ color: '#ccc', fontSize: '12px' }}>{sp.email}</p>
            </footer>
        </div>
    );
};

export default TemplateRealEstateClean;
