import React, { useState } from 'react';

const TemplateRealEstateLuxury = ({ sellingPoint, onAction }) => {
    const [activeTab, setActiveTab] = useState('For Sale');
    const sp = sellingPoint || {};
    const overrides = sp.overrides || {};
    const stock = sp.stock || [];
    const tabs = ['For Sale', 'For Rent', 'New Build', 'Commercial', 'Land'];

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
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
            {/* Navigation */}
            <nav style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '0 40px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🏛️</span>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg, #d4af37, #f4e4a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {overrides.heroTitle || sp.name || 'Prestige Properties'}
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{ padding: '8px 20px', borderRadius: '8px', border: activeTab === tab ? '1px solid #d4af37' : '1px solid transparent', background: activeTab === tab ? 'rgba(212,175,55,0.15)' : 'transparent', color: activeTab === tab ? '#d4af37' : '#888', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                            {tab}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Hero */}
            <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
                <img src={overrides.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80'} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', padding: '0 80px' }}>
                    <div style={{ maxWidth: '600px' }}>
                        <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', padding: '6px 16px', borderRadius: '4px', marginBottom: '20px' }}>
                            <span style={{ color: '#d4af37', fontSize: '12px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>Premium Real Estate</span>
                        </div>
                        <h2 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
                            {overrides.heroSubtitle || 'Exceptional Properties, Exceptional Living'}
                        </h2>
                        <p style={{ color: '#999', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
                            {overrides.heroDescription || sp.description || 'Discover curated luxury properties handpicked by our expert team.'}
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #d4af37, #b8941f)', color: '#000', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Browse Properties</button>
                            <button style={{ padding: '14px 32px', background: 'transparent', color: '#d4af37', fontWeight: 700, borderRadius: '8px', border: '1px solid #d4af37', cursor: 'pointer', fontSize: '14px' }}>Book Viewing</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            <section style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h3 style={{ fontSize: '28px', fontWeight: 800 }}>Featured Listings</h3>
                        <p style={{ color: '#666', marginTop: '4px' }}>{listings.length} properties available</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i} style={{ background: '#141414', borderRadius: '16px', overflow: 'hidden', border: '1px solid #222', transition: 'all 0.3s' }}>
                            <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                <img src={item.image || item.imageUrls?.[0] || `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(212,175,55,0.9)', color: '#000', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                                    {item.listingType === 'for-rent' ? 'For Rent' : 'For Sale'}
                                </div>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{item.name || 'Luxury Property'}</h4>
                                <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>{item.propertyAddress || item.description || 'Prime location'}</p>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                    {item.bedrooms && <span style={{ color: '#999', fontSize: '12px' }}>🛏 {item.bedrooms} Beds</span>}
                                    {item.bathrooms && <span style={{ color: '#999', fontSize: '12px' }}>🚿 {item.bathrooms} Baths</span>}
                                    {item.surface && <span style={{ color: '#999', fontSize: '12px' }}>📐 {item.surface} m²</span>}
                                    {item.floor && <span style={{ color: '#999', fontSize: '12px' }}>🏢 Floor {item.floor}</span>}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #222' }}>
                                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#d4af37' }}>€{Number(item.price || 0).toLocaleString()}</span>
                                    <button style={{ padding: '8px 16px', background: 'rgba(212,175,55,0.15)', color: '#d4af37', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Details →</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {listings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#555' }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</p>
                        <p style={{ fontSize: '18px', fontWeight: 600 }}>No properties listed yet</p>
                        <p style={{ fontSize: '14px', color: '#444', marginTop: '8px' }}>Properties will appear here once added to the selling point.</p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a', padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#444', fontSize: '13px' }}>© {new Date().getFullYear()} {sp.name || 'Prestige Properties'}. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default TemplateRealEstateLuxury;
