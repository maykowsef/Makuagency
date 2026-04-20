export const initialSchedules = [
    {
        id: 1,
        sellingPointId: 1,
        scheduler: 'Myself',
        date: new Date(2026, 0, 22, 10, 0).toISOString(),
        status: 'Pending',
        calls: [],
        rescheduleHistory: []
    },
    {
        id: 2,
        sellingPointId: 3,
        scheduler: 'Employer B',
        date: new Date(2026, 0, 23, 14, 30).toISOString(),
        status: 'Convinced',
        calls: [
            {
                id: 1,
                time: new Date(2026, 0, 20, 15, 0).toISOString(),
                duration: '12',
                notes: 'Initial contact. Very interested in our services.',
                outcome: 'Convinced',
                voiceNote: null
            }
        ],
        rescheduleHistory: []
    },
    {
        id: 3,
        sellingPointId: 5,
        scheduler: 'Employer C',
        date: new Date(2026, 0, 25, 9, 0).toISOString(),
        status: 'Not Convinced',
        calls: [],
        rescheduleHistory: []
    }
];
