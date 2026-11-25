import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './components/ui/button';
import { ArrowLeft, FileText, Download, Calendar, Filter, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [filters, setFilters] = useState({
    type: 'Todos os tipos',
    status: 'Todos os status'
  });
  const [newReport, setNewReport] = useState({
    type: 'Mensal',
    period: 'Este mês',
    title: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw new Error('Erro ao carregar relatórios: ' + dbError.message);

      setReports((data ?? []).map((r) => ({ ...r, fileUrl: r.file_url })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const { error: dbError } = await supabase.from('reports').insert({
        title: newReport.title || `Relatório ${newReport.type} - ${new Date().toLocaleDateString('pt-BR')}`,
        type: newReport.type,
        period: newReport.period,
        status: 'Completo',
      });

      if (dbError) throw new Error(dbError.message);

      alert('Relatório gerado com sucesso!');

      // Reset form
      setNewReport({
        type: 'Mensal',
        period: 'Este mês',
        title: '',
        startDate: '',
        endDate: ''
      });
      
      // Refresh reports list
      fetchReports();
    } catch (err) {
      alert('Erro ao gerar relatório: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownloadReport = async (report: any) => {
    try {
      // In a real app, this would download the actual file
      // For now, we'll simulate the download
      const link = document.createElement('a');
      link.href = report.fileUrl;
      link.download = `${report.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Erro ao baixar relatório');
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm('Tem certeza que deseja excluir este relatório?')) {
      return;
    }

    try {
      const { error: dbError } = await supabase.from('reports').delete().eq('id', reportId);

      if (dbError) throw new Error(dbError.message);

      alert('Relatório excluído com sucesso');
      fetchReports();
    } catch (err) {
      alert('Erro ao excluir relatório: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  };

  const filteredReports = reports.filter((report: any) => {
    const typeMatch = filters.type === 'Todos os tipos' || report.type === filters.type;
    const statusMatch = filters.status === 'Todos os status' || report.status === filters.status;
    return typeMatch && statusMatch;
  });

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
            <h1 className="text-xl font-semibold text-gray-900">Relatórios</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Relatórios de Emissões
          </h2>
          <p className="text-gray-600">
            Acesse e baixe relatórios detalhados sobre o monitoramento ambiental.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              >
                <option>Todos os tipos</option>
                <option>Mensal</option>
                <option>Trimestral</option>
                <option>Anual</option>
                <option>Personalizado</option>
              </select>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option>Todos os status</option>
                <option>Completo</option>
                <option>Em Processamento</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setFilters({ type: 'Todos os tipos', status: 'Todos os status' })}>
                Limpar Filtros
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading}>
              <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Relatórios Disponíveis</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Carregando relatórios...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">Erro ao carregar relatórios: {error}</p>
              <Button onClick={fetchReports}>Tentar Novamente</Button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="size-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {reports.length === 0 ? 'Nenhum relatório encontrado.' : 'Nenhum relatório corresponde aos filtros aplicados.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReports.map((report: any) => (
                <div key={report.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(report.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-sm text-gray-600">{report.type}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            report.status === 'Completo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === 'Completo' ? (
                        <Button size="sm" onClick={() => handleDownloadReport(report)}>
                          <Download className="size-4 mr-2" />
                          Baixar
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Em Processamento
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate New Report */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerar Novo Relatório</h3>
          <p className="text-gray-600 mb-6">
            Crie relatórios personalizados com dados específicos do período desejado.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Relatório
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newReport.type}
                onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
              >
                <option>Mensal</option>
                <option>Trimestral</option>
                <option>Anual</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newReport.period}
                onChange={(e) => setNewReport(prev => ({ ...prev, period: e.target.value }))}
              >
                <option>Hoje</option>
                <option>Esta semana</option>
                <option>Este mês</option>
                <option>Este trimestre</option>
                <option>Este ano</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Relatório
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Relatório Personalizado"
                value={newReport.title}
                onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>
          {newReport.period === 'Personalizado' && (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newReport.startDate}
                  onChange={(e) => setNewReport(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newReport.endDate}
                  onChange={(e) => setNewReport(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          )}
          <Button onClick={handleGenerateReport} disabled={generatingReport}>
            {generatingReport ? (
              <>
                <RefreshCw className="size-4 mr-2 animate-spin" />
                Gerando Relatório...
              </>
            ) : (
              <>
                <Plus className="size-4 mr-2" />
                Gerar Relatório
              </>
            )}
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/perfil" className="text-green-600 hover:text-green-700">
              Meu Perfil
            </Link>
            <Link to="/dashboard" className="text-green-600 hover:text-green-700">
              Dashboard
            </Link>
            <Link to="/suporte" className="text-green-600 hover:text-green-700">
              Suporte
            </Link>
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
    </div>
  );
}