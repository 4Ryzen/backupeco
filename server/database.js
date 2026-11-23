// In-memory database for development
// In production, replace with a real database like PostgreSQL, MongoDB, etc.

export const db = {
  users: [
    {
      id: 1,
      name: 'Admin EcoAir',
      email: 'admin@ecoair.com',
      password: '$2b$10$rp9t6yUJ/WXQ9S53bwy1nu9pmqhYr8ZVyjDRfdebr2cgCKfN4qe0e', // password: admin123
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  dashboard: {
    currentEmissions: 1247,
    reductionToday: -12,
    alerts: 3,
    reportsCount: 12,
    isOnline: true,
    lastUpdate: new Date().toISOString()
  },
  reports: [
    {
      id: 1,
      title: 'Relatório de Emissões - Janeiro 2026',
      date: '2026-01-31',
      type: 'Mensal',
      status: 'Completo',
      fileUrl: '/reports/report-1.pdf',
      userId: 1
    },
    {
      id: 2,
      title: 'Relatório de Emissões - Dezembro 2025',
      date: '2025-12-31',
      type: 'Mensal',
      status: 'Completo',
      fileUrl: '/reports/report-2.pdf',
      userId: 1
    },
    {
      id: 3,
      title: 'Relatório Trimestral Q4 2025',
      date: '2025-12-31',
      type: 'Trimestral',
      status: 'Completo',
      fileUrl: '/reports/report-3.pdf',
      userId: 1
    },
    {
      id: 4,
      title: 'Relatório Anual 2025',
      date: '2025-12-31',
      type: 'Anual',
      status: 'Em Processamento',
      fileUrl: '/reports/report-4.pdf',
      userId: 1
    }
  ],
  alerts: [
    {
      id: 1,
      type: 'CO2_HIGH',
      message: 'Níveis de CO₂ acima do limite em Setor A',
      severity: 'high',
      timestamp: '2026-03-25T10:30:00.000Z',
      resolved: false
    },
    {
      id: 2,
      type: 'MAINTENANCE',
      message: 'Manutenção preventiva necessária no Sensor 3',
      severity: 'medium',
      timestamp: '2026-03-25T09:15:00.000Z',
      resolved: false
    }
  ]
};

// Helper functions
export const findUserByEmail = (email) => {
  return db.users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return db.users.find(user => user.id === id);
};

export const createUser = (userData) => {
  const newUser = {
    id: db.users.length + 1,
    ...userData,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  return newUser;
};

export const updateDashboardData = (newData) => {
  db.dashboard = { ...db.dashboard, ...newData, lastUpdate: new Date().toISOString() };
  return db.dashboard;
};

export const createReport = (reportData) => {
  const newReport = {
    id: db.reports.length + 1,
    ...reportData,
    createdAt: new Date().toISOString()
  };
  db.reports.push(newReport);
  return newReport;
};