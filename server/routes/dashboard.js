import express from 'express';
import { db, updateDashboardData } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard data
router.get('/', authenticateToken, (req, res) => {
  // Simulate real-time updates
  const currentData = { ...db.dashboard };

  // Add some random variation to simulate real-time data
  currentData.currentEmissions += Math.floor(Math.random() * 21) - 10;
  currentData.reductionToday = Math.max(-20, Math.min(5,
    currentData.reductionToday + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)
  ));
  currentData.alerts = Math.max(0,
    currentData.alerts + (Math.random() > 0.9 ? 1 : Math.random() > 0.95 ? -1 : 0)
  );
  currentData.lastUpdate = new Date().toISOString();

  res.json({
    dashboard: currentData,
    alerts: db.alerts.filter(alert => !alert.resolved).slice(0, 5) // Last 5 active alerts
  });
});

// Update dashboard data (admin only)
router.put('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar dados.' });
  }

  const updatedData = updateDashboardData(req.body);
  res.json({ dashboard: updatedData });
});

// Get alerts
router.get('/alerts', authenticateToken, (req, res) => {
  const alerts = db.alerts.filter(alert => !alert.resolved);
  res.json({ alerts });
});

// Resolve alert
router.put('/alerts/:id/resolve', authenticateToken, (req, res) => {
  const alertId = parseInt(req.params.id);
  const alert = db.alerts.find(a => a.id === alertId);

  if (!alert) {
    return res.status(404).json({ error: 'Alerta não encontrado' });
  }

  alert.resolved = true;
  alert.resolvedAt = new Date().toISOString();
  alert.resolvedBy = req.user.id;

  res.json({ alert });
});

export { router as dashboardRoutes };