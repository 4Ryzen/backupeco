import express from 'express';
import { db, createReport } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all reports for user
router.get('/', authenticateToken, (req, res) => {
  const userReports = db.reports.filter(report => report.userId === req.user.id);
  res.json({ reports: userReports });
});

// Get specific report
router.get('/:id', authenticateToken, (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = db.reports.find(r => r.id === reportId && r.userId === req.user.id);

  if (!report) {
    return res.status(404).json({ error: 'Relatório não encontrado' });
  }

  res.json({ report });
});

// Generate new report
router.post('/generate', authenticateToken, (req, res) => {
  try {
    const { type, period, title } = req.body;

    // Simulate report generation time
    setTimeout(() => {
      const newReport = createReport({
        title: title || `Relatório ${type} - ${new Date().toLocaleDateString('pt-BR')}`,
        date: new Date().toISOString().split('T')[0],
        type,
        status: 'Completo',
        fileUrl: `/reports/report-${Date.now()}.pdf`,
        userId: req.user.id,
        period
      });

      // In a real app, this would trigger actual report generation
      console.log(`Report generated: ${newReport.title}`);
    }, 2000);

    res.json({
      message: 'Relatório está sendo gerado. Você será notificado quando estiver pronto.',
      estimatedTime: '2 minutos'
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// Delete report
router.delete('/:id', authenticateToken, (req, res) => {
  const reportId = parseInt(req.params.id);
  const reportIndex = db.reports.findIndex(r => r.id === reportId && r.userId === req.user.id);

  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Relatório não encontrado' });
  }

  db.reports.splice(reportIndex, 1);
  res.json({ message: 'Relatório excluído com sucesso' });
});

export { router as reportsRoutes };