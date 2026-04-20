// Work Assignments - Tasks assigned by admin to employees
export const initialWorkAssignments = [
    {
        id: 'WORK-001',
        type: 'schedule_call', // 'schedule_call', 'check', 'add_stock', 'full_work'
        sellingPointIds: [1, 2, 3],
        assignedTo: 1, // Employee ID
        assignedBy: 2, // Admin ID
        assignedAt: new Date(Date.now() - 7200000).toISOString(),
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        status: 'Pending', // Pending, In Progress, Completed, Cancelled
        priority: 'High', // Low, Medium, High, Urgent
        instructions: 'Schedule follow-up calls with these dealers to discuss new inventory options',
        completedAt: null,
        completedItems: [], // Array of completed selling point IDs
        notes: '',
        followUpCreated: false
    },
    {
        id: 'WORK-002',
        type: 'check',
        sellingPointIds: [4, 5],
        assignedTo: 1,
        assignedBy: 2,
        assignedAt: new Date(Date.now() - 3600000).toISOString(),
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        status: 'In Progress',
        priority: 'Medium',
        instructions: 'Verify contact information and business hours',
        completedAt: null,
        completedItems: [4], // Already completed ID 4
        notes: 'ID 4 verified successfully',
        followUpCreated: false
    },
    {
        id: 'WORK-003',
        type: 'add_stock',
        sellingPointIds: [1],
        assignedTo: 1,
        assignedBy: 2,
        assignedAt: new Date(Date.now() - 86400000).toISOString(),
        dueDate: new Date(Date.now() + 259200000).toISOString(),
        status: 'Pending',
        priority: 'Low',
        instructions: 'Add new vehicle inventory listings for this dealer',
        completedAt: null,
        completedItems: [],
        notes: '',
        followUpCreated: false
    }
];
