import React, { useState } from 'react';

const TemplateClothingMinimalist = ({ sellingPoint, onAction }) => {
    const sp = sellingPoint || {};
    const overrides = sp.overrides || {};
    const stock = sp.stock || [];
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
        <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: '#ffffff', color: '#000000', minHeight: '100vh' }}>
            <nav style={{ padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '2px' }}>{overrides.heroTitle || sp.name || 'STUDIO'}</h1>
                <div style={{ fontSize: '13px', display: 'flex', gap: '30px' }}>
                    <span style={{ cursor: 'pointer' }}>SHOP</span>
                    <span style={{ cursor: 'pointer' }}>EDITORIAL</span>
                    <span style={{ cursor: 'pointer' }}>INF0</span>
                </div>
            </nav>

            <header style={{ padding: '100px 60px', maxWidth: '800px' }}>
                <h2 style={{ fontSize: '48px', fontWeight: 300, lineHeight: 1.2, marginBottom: '20px' }}>{overrides.heroSubtitle || 'Modern Essentials.'}</h2>
                <p style={{ fontSize: '18px', color: '#666', lineHeight: 1.5 }}>
                    {overrides.heroDescription || sp.description || 'Elevated basics for the contemporary wardrobe.'}
                </p>
            </header>

            <section style={{ padding: '0 60px 100px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '60px 40px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i}>
                            <div style={{ height: '450px', background: '#f5f5f5', marginBottom: '20px' }}>
                                <img src={item.image || item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{item.name || 'Essential Item'}</h4>
                                    <p style={{ color: '#888', fontSize: '13px' }}>{item.color} {item.material && `• ${item.material}`}</p>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>€{Number(item.price || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TemplateClothingMinimalist;
