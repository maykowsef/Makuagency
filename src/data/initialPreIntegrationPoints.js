// Pre-Integration Selling Points - Items awaiting employee review and integration
export const initialPreIntegrationPoints = [
    {
        id: 'PRE-001',
        businessName: 'Auto Service Lyon',
        address: '15 Rue de la République, 69001 Lyon, France',
        phone: '+33 4 78 27 15 89',
        businessType: 'Auto Repair',
        source: 'Web Scraping',
        scrapedData: {
            website: null,
            socialMedia: [],
            email: null
        },
        assignedTo: null, // Employee ID when assigned
        assignedAt: null,
        status: 'Pending', // Pending, Assigned, Reviewed, Integrated, Rejected
        employeeDecision: null, // 'integrate', 'has_website', 'other'
        employeeNotes: '',
        integratedAsId: null, // Selling Point ID if integrated
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 'PRE-002',
        businessName: 'Garage Moderne Paris',
        address: '42 Avenue des Champs-Élysées, 75008 Paris, France',
        phone: '+33 1 42 25 89 45',
        businessType: 'Auto Dealer',
        source: 'CSV Import',
        scrapedData: {
            website: null,
            socialMedia: ['facebook.com/garagemoderne'],
            email: 'contact@garagemoderne.fr'
        },
        assignedTo: null,
        assignedAt: null,
        status: 'Pending',
        employeeDecision: null,
        employeeNotes: '',
        integratedAsId: null,
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'PRE-003',
        businessName: 'Moto Expert Marseille',
        address: '88 La Canebière, 13001 Marseille, France',
        phone: '+33 4 91 54 32 10',
        businessType: 'Motorcycle Dealer',
        source: 'Manual Entry',
        scrapedData: {
            website: 'www.motoexpert-marseille.fr',
            socialMedia: ['instagram.com/motoexpert'],
            email: 'info@motoexpert.fr'
        },
        assignedTo: 1, // Assigned to Makrem
        assignedAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'Assigned',
        employeeDecision: null,
        employeeNotes: '',
        integratedAsId: null,
        createdAt: new Date().toISOString()
    }
];
