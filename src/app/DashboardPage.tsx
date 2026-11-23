import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './components/ui/button';
import { ArrowLeft, BarChart3, AlertTriangle, Activity, TrendingUp, RefreshCw, X, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [alertsConfig, setAlertsConfig] = useState({
    co2Threshold: 1000,
    maintenanceReminder: true,
    emailNotifications: true,
    smsNotifications: false
  });

  // Dashboard data from API
  const [dashboardData, setDashboardData] = useState({
    currentEmissions: 1247,
    reductionToday: -12,
    alerts: 3,
    reportsCount: 12,
    isOnline: true
  });
  const [alerts, setAlerts] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.dashboard);
        setAlerts(data.alerts);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      // Set up polling for real-time updates
      const interval = setInterval(fetchDashboardData, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const handleViewMonitoring = () => {
    setShowMonitoringModal(true);
  };

  const handleGenerateReport = async () => {
    setReportGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'Personalizado',
          period: 'Hoje',
          title: `Relatório Personalizado - ${new Date().toLocaleDateString('pt-BR')}`
        })
      });

      if (response.ok) {
        setShowReportModal(false);
        alert('Relatório está sendo gerado. Você será notificado quando estiver pronto.');
      } else {
        alert('Erro ao gerar relatório. Tente novamente.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Erro de conexão. Tente novamente.');
    }
    setReportGenerating(false);
  };

  const handleSaveAlertsConfig = () => {
    // In a real app, this would save to backend
    alert('Configurações de alertas salvas com sucesso!');
    setShowAlertsModal(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">Você precisa estar logado para acessar esta página.</p>
          <Link to="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="size-5" />
              <div className="text-2xl font-bold">
                <span className="text-green-700">Eco</span>
                <span className="text-teal-600">Air</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dashboardData.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {dashboardData.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user.name}!
          </h2>
          <p className="text-gray-600">
            Monitore o desempenho ambiental da sua empresa em tempo real.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Emissões Atuais</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.currentEmissions?.toLocaleString() || 0} kg</p>
                <p className="text-xs text-gray-500">CO₂ equivalente</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Redução Hoje</p>
                <p className={`text-2xl font-bold ${dashboardData.reductionToday >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData.reductionToday > 0 ? '+' : ''}{dashboardData.reductionToday || 0}%
                </p>
                <p className="text-xs text-gray-500">vs ontem</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className={`size-6 ${alerts.length > 0 ? 'text-yellow-600' : 'text-green-600'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alertas Ativos</p>
                <p className={`text-2xl font-bold ${alerts.length > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {alerts.length}
                </p>
                <p className="text-xs text-gray-500">precisam atenção</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Relatórios</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.reportsCount || 0}</p>
                <p className="text-xs text-gray-500">gerados este mês</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Chart Simulation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissões em Tempo Real (Últimas 24h)</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between px-4 py-4">
            {Array.from({ length: 24 }, (_, i) => {
              const height = Math.max(10, Math.min(100, 50 + Math.sin(i / 3) * 30 + Math.random() * 20));
              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-4 bg-green-500 rounded-t transition-all duration-1000"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{i}:00</span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Gráfico atualizado automaticamente a cada 5 segundos
          </p>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-6 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Alertas Ativos ({alerts.length})
                </h3>
                <div className="space-y-2">
                  {alerts.slice(0, 3).map((alert: any) => (
                    <p key={alert.id} className="text-yellow-700">• {alert.message}</p>
                  ))}
                  {alerts.length > 3 && (
                    <p className="text-yellow-700">• E mais {alerts.length - 3} alertas...</p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  Ver Todos os Alertas
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CO2 Levels Chart */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Níveis de CO₂ por Setor</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {dashboardData.co2Levels?.reduce((sum: number, level: any) => sum + level.value, 0) / dashboardData.co2Levels?.length || 0} ppm
                </div>
                <p className="text-gray-600">Média Geral</p>
                <div className="mt-4 space-y-2">
                  {dashboardData.co2Levels?.map((level: any) => (
                    <div key={level.sector} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{level.sector}:</span>
                      <span className="text-sm font-medium">{level.value} ppm</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Energy Consumption Chart */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Consumo de Energia</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {dashboardData.energyConsumption?.reduce((sum: number, cons: any) => sum + cons.value, 0) / dashboardData.energyConsumption?.length || 0} kWh
                </div>
                <p className="text-gray-600">Consumo Total</p>
                <div className="mt-4 space-y-2">
                  {dashboardData.energyConsumption?.map((cons: any) => (
                    <div key={cons.sector} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{cons.sector}:</span>
                      <span className="text-sm font-medium">{cons.value} kWh</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" onClick={handleViewMonitoring}>
                <Activity className="size-4 mr-2" />
                Ver Monitoramento em Tempo Real
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowReportModal(true)}>
                <BarChart3 className="size-4 mr-2" />
                Gerar Relatório
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowAlertsModal(true)}>
                <AlertTriangle className="size-4 mr-2" />
                Configurar Alertas
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Links Úteis</h3>
            <div className="space-y-3">
              <Link to="/perfil" className="block text-green-600 hover:text-green-700">
                Meu Perfil
              </Link>
              <Link to="/relatorios" className="block text-green-600 hover:text-green-700">
                Relatórios Detalhados
              </Link>
              <Link to="/suporte" className="block text-green-600 hover:text-green-700">
                Central de Suporte
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 EcoAir. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Monitoring Modal */}
      {showMonitoringModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Monitoramento em Tempo Real</h2>
              <button
                onClick={() => setShowMonitoringModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="size-5 text-green-600" />
                    <span className="font-medium text-green-800">Emissões Atuais</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{dashboardData.currentEmissions} kg</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Redução Hoje</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{dashboardData.reductionToday}%</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="size-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Alertas</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">{dashboardData.alerts}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gráfico de Emissões - Últimas 24 Horas</h3>
                <div className="h-64 bg-white rounded-lg flex items-end justify-between px-4 py-4">
                  {Array.from({ length: 24 }, (_, i) => {
                    const height = Math.max(10, Math.min(100, 50 + Math.sin((i + Date.now() / 10000) / 3) * 30 + Math.random() * 20));
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-4 bg-green-500 rounded-t transition-all duration-1000"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">{i}:00</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gerar Relatório</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Relatório
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Diário</option>
                  <option>Semanal</option>
                  <option>Mensal</option>
                  <option>Anual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>Hoje</option>
                  <option>Esta semana</option>
                  <option>Este mês</option>
                  <option>Personalizado</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleGenerateReport}
                  disabled={reportGenerating}
                  className="flex-1"
                >
                  {reportGenerating ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="size-4 mr-2" />
                      Gerar Relatório
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                  disabled={reportGenerating}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Configuration Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Configurar Alertas</h2>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limite de CO₂ (kg)
                </label>
                <input
                  type="number"
                  value={alertsConfig.co2Threshold}
                  onChange={(e) => setAlertsConfig(prev => ({ ...prev, co2Threshold: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={alertsConfig.maintenanceReminder}
                    onChange={(e) => setAlertsConfig(prev => ({ ...prev, maintenanceReminder: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="maintenance" className="text-sm text-gray-700">
                    Lembretes de manutenção
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email"
                    checked={alertsConfig.emailNotifications}
                    onChange={(e) => setAlertsConfig(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="email" className="text-sm text-gray-700">
                    Notificações por email
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sms"
                    checked={alertsConfig.smsNotifications}
                    onChange={(e) => setAlertsConfig(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="sms" className="text-sm text-gray-700">
                    Notificações por SMS
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveAlertsConfig} className="flex-1">
                  <CheckCircle className="size-4 mr-2" />
                  Salvar Configurações
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAlertsModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}