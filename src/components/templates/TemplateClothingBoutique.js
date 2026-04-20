import React, { useState } from 'react';

const TemplateClothingBoutique = ({ sellingPoint, onAction }) => {
    const [activeTab, setActiveTab] = useState('All Collection');
    const sp = sellingPoint || {};
    const overrides = sp.overrides || {};
    const stock = sp.stock || [];
    const tabs = ['All Collection', 'Dresses', 'Tops', 'Bottoms', 'Accessories'];
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
        <div style={{ fontFamily: "'Playfair Display', serif", background: '#fff0f5', color: '#4a0e2e', minHeight: '100vh' }}>
            <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '28px', fontStyle: 'italic', fontWeight: 700 }}>{overrides.heroTitle || sp.name || 'La Boutique'}</h1>
                <div style={{ display: 'flex', gap: '20px', fontFamily: "'Inter', sans-serif" }}>
                    <span style={{ cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' }}>SHOP</span>
                    <span style={{ cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' }}>ABOUT</span>
                    <span style={{ cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' }}>CONTACT</span>
                </div>
            </nav>

            <header style={{ textAlign: 'center', padding: '60px 20px', background: '#ffe4e1' }}>
                <h2 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 400 }}>{overrides.heroSubtitle || 'Elegance in every thread'}</h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: '#6d2e46', maxWidth: '600px', margin: '0 auto' }}>
                    {overrides.heroDescription || sp.description || 'Discover our exclusively curated collection designed for the modern romantic.'}
                </p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
                {tabs.map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} style={{ background: 'none', border: 'none', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: activeTab === t ? '#4a0e2e' : '#a98492', borderBottom: activeTab === t ? '1px solid #4a0e2e' : 'none', paddingBottom: '4px', cursor: 'pointer' }}>
                        {t}
                    </button>
                ))}
            </div>

            <section style={{ padding: '0 60px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '40px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i} style={{ textAlign: 'center' }}>
                            <div style={{ height: '360px', overflow: 'hidden', marginBottom: '20px' }}>
                                <img src={item.image || item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h4 style={{ fontSize: '20px', marginBottom: '8px', fontWeight: 600 }}>{item.name || 'Floral Dress'}</h4>
                            {item.brand && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#8b5a70', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{item.brand}</p>}
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 500 }}>€{Number(item.price || 0).toLocaleString()}</p>
                            <div style={{ fontFamily: "'Inter', sans-serif", marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {item.size && <span style={{ fontSize: '12px', border: '1px solid #e0c9d3', padding: '4px 10px' }}>Size: {item.size}</span>}
                                {item.color && <span style={{ fontSize: '12px', border: '1px solid #e0c9d3', padding: '4px 10px' }}>{item.color}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TemplateClothingBoutique;
