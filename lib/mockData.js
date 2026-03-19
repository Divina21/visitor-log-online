export const INITIAL_LOGS = [
  { id: '1', name: 'Sarah Jenkins', phone: '555-0101', purpose: 'Business Meeting', host: 'Mark Thompson', checkIn: new Date(Date.now() - 3600000).toISOString(), checkOut: null, status: 'active' },
  { id: '2', name: 'Robert Chen', phone: '555-0122', purpose: 'Maintenance', host: 'Facility Manager', checkIn: new Date(Date.now() - 7200000).toISOString(), checkOut: new Date(Date.now() - 5400000).toISOString(), status: 'completed' },
  { id: '3', name: 'Elena Rodriguez', phone: '555-0199', purpose: 'Job Interview', host: 'HR Department', checkIn: new Date(Date.now() - 1500000).toISOString(), checkOut: null, status: 'active' },
  { id: '4', name: 'Divina De Jesus', phone: '555-0199', purpose: 'Job Interview', host: 'HR Department', checkIn: new Date(Date.now() - 1500000).toISOString(), checkOut: null, status: 'active' },
];
