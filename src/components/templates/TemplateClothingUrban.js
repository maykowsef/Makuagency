import React, { useState } from 'react';

const TemplateClothingUrban = ({ sellingPoint, onAction }) => {
    const [activeTab, setActiveTab] = useState('All');
    const sp = sellingPoint || {};
    const overrides = sp.overrides || {};
    const stock = sp.stock || [];
    const tabs = ['All', 'New', 'Used', 'Men', 'Women', 'Kids', 'Accessories'];
    const getListings = () => {
        const rawListings = (!stock.length) ? (sp.announcementProfiles?.flatMap(p => p.stockListings || []) || []) : stock;
        return rawListings.map(item => ({
            ...item,
            ...(item.attributes || {}),
            image: item.image || item.imageUrls?.[0]
        }));
    };
    const listings = getListings();
    const conditionLabel = (c) => ({ 'new-with-tags': 'NWT', 'new-without-tags': 'NWOT', 'like-new': 'Like New', 'gently-used': 'Used', 'good': 'Good', 'fair': 'Fair', 'vintage': 'Vintage' }[c] || c || '');

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#0d0d0d', color: '#fff', minHeight: '100vh' }}>
            <nav style={{ background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1a1a1a', padding: '0 40px', position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                    {overrides.heroTitle || sp.name || 'URBAN THREADS'}
                </h1>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {tabs.map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: activeTab === t ? '#fff' : 'transparent', color: activeTab === t ? '#000' : '#666', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{t}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#555' }}>🛒 Cart</span>
                </div>
            </nav>

            {/* Hero */}
            <div style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
                <img src={overrides.heroImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80'} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) contrast(1.1)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '6px', textTransform: 'uppercase', color: '#888', marginBottom: '16px' }}>New Season</p>
                        <h2 style={{ fontSize: '60px', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', lineHeight: 1 }}>
                            {overrides.heroSubtitle || 'STREET STYLE\nREDEFINED'}
                        </h2>
                        <p style={{ color: '#777', fontSize: '15px', marginTop: '20px', maxWidth: '500px', margin: '20px auto 0' }}>
                            {overrides.heroDescription || sp.description || 'Curated streetwear and fashion from the best brands.'}
                        </p>
                        <button style={{ marginTop: '32px', padding: '14px 40px', background: '#fff', color: '#000', border: 'none', borderRadius: '0', fontWeight: 800, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>Shop Now</button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <section style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Collection</h3>
                    <span style={{ color: '#555', fontSize: '13px' }}>{listings.length} items</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i} style={{ background: '#141414', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e1e1e', transition: 'all 0.3s', cursor: 'pointer' }}>
                            <div style={{ height: '320px', overflow: 'hidden', position: 'relative', background: '#1a1a1a' }}>
                                <img src={item.image || item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {item.clothingCondition && (
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                                        <span style={{ background: item.clothingCondition?.includes('new') ? '#22c55e' : '#f59e0b', color: '#000', padding: '3px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>
                                            {conditionLabel(item.clothingCondition)}
                                        </span>
                                    </div>
                                )}
                                {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                                        -{Math.round((1 - Number(item.price) / Number(item.originalPrice)) * 100)}%
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '16px' }}>
                                {item.brand && <p style={{ color: '#666', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{item.brand}</p>}
                                <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name || 'Fashion Item'}</h4>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    {item.size && <span style={{ background: '#1e1e1e', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: '#888' }}>Size: {item.size}</span>}
                                    {item.color && <span style={{ background: '#1e1e1e', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: '#888' }}>{item.color}</span>}
                                    {item.gender && <span style={{ background: '#1e1e1e', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: '#888' }}>{item.gender}</span>}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '18px', fontWeight: 800 }}>€{Number(item.price || 0).toLocaleString()}</span>
                                        {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
                                            <span style={{ fontSize: '13px', color: '#555', textDecoration: 'line-through' }}>€{Number(item.originalPrice).toLocaleString()}</span>
                                        )}
                                    </div>
                                    <button style={{ padding: '6px 12px', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase' }}>Add</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {listings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px', border: '1px dashed #222', borderRadius: '12px' }}>
                        <p style={{ fontSize: '40px', marginBottom: '12px' }}>👕</p>
                        <p style={{ fontWeight: 700, color: '#555' }}>No items in collection yet</p>
                    </div>
                )}
            </section>

            <footer style={{ borderTop: '1px solid #1a1a1a', padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#333', fontSize: '12px' }}>© {new Date().getFullYear()} {sp.name || 'URBAN THREADS'}</p>
            </footer>
        </div>
    );
};

export default TemplateClothingUrban;
