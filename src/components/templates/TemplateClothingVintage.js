import React, { useState } from 'react';

const TemplateClothingVintage = ({ sellingPoint, onAction }) => {
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
        <div style={{ fontFamily: "'Courier New', Courier, monospace", background: '#ece5ce', color: '#3d3024', minHeight: '100vh', padding: '20px' }}>
            <div style={{ border: '4px solid #3d3024', padding: '10px', height: 'calc(100vh - 40px)', overflowY: 'auto' }}>
                <header style={{ textAlign: 'center', borderBottom: '2px dashed #3d3024', paddingBottom: '30px', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', margin: '20px 0 10px' }}>
                        {overrides.heroTitle || sp.name || 'RETRO THREADS'}
                    </h1>
                    <p style={{ fontSize: '16px', fontStyle: 'italic' }}>Est. 2024 • Authentic Vintage & Second-Hand</p>
                    <p style={{ marginTop: '20px', maxWidth: '600px', margin: '20px auto 0' }}>
                        {overrides.heroDescription || sp.description || 'Rare finds and timeless classics.'}
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', padding: '0 20px' }}>
                    {listings.map((item, i) => (
                        <div key={item.id || i} style={{ border: '2px solid #3d3024', background: '#e3dcbe', padding: '15px' }}>
                            <div style={{ height: '300px', overflow: 'hidden', border: '2px solid #3d3024', marginBottom: '15px', position: 'relative' }}>
                                <img src={item.image || item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1542272201-b1ca555f8505?auto=format&fit=crop&w=600&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.3)' }} />
                                {item.clothingCondition && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, background: '#3d3024', color: '#ece5ce', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold' }}>
                                        {item.clothingCondition}
                                    </div>
                                )}
                            </div>
                            <h4 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>{item.name || 'Vintage Item'}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #3d3024', borderBottom: '1px dashed #3d3024', padding: '10px 0', marginBottom: '15px' }}>
                                <span>SIZE: {item.size || 'N/A'}</span>
                                <span style={{ fontWeight: 'bold' }}>€{Number(item.price || 0).toLocaleString()}</span>
                            </div>
                            <button style={{ width: '100%', padding: '10px', background: '#cfc4a1', border: '2px solid #3d3024', fontWeight: 'bold', fontFamily: 'inherit', cursor: 'pointer' }}>ADD TO CART</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplateClothingVintage;
