import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './components/ui/button';
import { ArrowLeft, User, Mail, Calendar, Settings, Shield, Bell, X, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Perfil atualizado com sucesso!');
        setShowEditProfile(false);
        // Update user in context
        updateUser({ name: profileData.name, email: profileData.email });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      setMessage('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('A nova senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Senha alterada com sucesso!');
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      setMessage('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSecuritySettings = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/security-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(securitySettings)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Configurações de segurança atualizadas!');
        setShowSecuritySettings(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Erro ao atualizar configurações');
      }
    } catch (error) {
      setMessage('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <User className="size-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="size-4" />
                  {user.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Calendar className="size-4" />
                  Membro desde {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações da Conta</h3>
              <p className="text-gray-600 mb-4">
                Gerencie suas informações pessoais e preferências.
              </p>
              <Button className="w-full" onClick={() => setShowEditProfile(true)}>
                <Settings className="size-4 mr-2" />
                Editar Perfil
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
              <p className="text-gray-600 mb-4">
                Altere sua senha e configure autenticação.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => setShowChangePassword(true)}>
                  <Shield className="size-4 mr-2" />
                  Alterar Senha
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowSecuritySettings(true)}>
                  <Bell className="size-4 mr-2" />
                  Configurações de Segurança
                </Button>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas da Conta</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <p className="text-sm text-gray-600">Relatórios Gerados</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <p className="text-sm text-gray-600">Alertas Ativos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{new Date().getFullYear() - 2024}</div>
                <p className="text-sm text-gray-600">Anos de Membro</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Zona de Perigo</h3>
            <p className="text-red-700 mb-4">
              Ações irreversíveis que afetam sua conta permanentemente.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                onClick={() => {
                  if (confirm('Tem certeza que deseja sair da sua conta?')) {
                    logout();
                  }
                }}
              >
                Sair da Conta
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita.')) {
                    alert('Funcionalidade de desativação de conta ainda não implementada.');
                  }
                }}
              >
                Desativar Conta
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir permanentemente sua conta? Todos os dados serão perdidos.')) {
                    alert('Funcionalidade de exclusão de conta ainda não implementada.');
                  }
                }}
              >
                Excluir Conta
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="text-green-600 hover:text-green-700">
                Dashboard
              </Link>
              <Link to="/relatorios" className="text-green-600 hover:text-green-700">
                Relatórios
              </Link>
              <Link to="/suporte" className="text-green-600 hover:text-green-700">
                Suporte
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check className="size-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditProfile(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Alterar Senha</h2>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    <>
                      <Shield className="size-4 mr-2" />
                      Alterar Senha
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChangePassword(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Settings Modal */}
      {showSecuritySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Configurações de Segurança</h2>
              <button
                onClick={() => setShowSecuritySettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Autenticação</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactor"
                      checked={securitySettings.twoFactorEnabled}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                      className="mr-3"
                    />
                    <div>
                      <label htmlFor="twoFactor" className="font-medium text-gray-700">
                        Autenticação de Dois Fatores
                      </label>
                      <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNotif"
                      checked={securitySettings.emailNotifications}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="mr-3"
                    />
                    <label htmlFor="emailNotif" className="font-medium text-gray-700">
                      Notificações por Email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="smsNotif"
                      checked={securitySettings.smsNotifications}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                      className="mr-3"
                    />
                    <label htmlFor="smsNotif" className="font-medium text-gray-700">
                      Notificações por SMS
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="loginAlerts"
                      checked={securitySettings.loginAlerts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                      className="mr-3"
                    />
                    <label htmlFor="loginAlerts" className="font-medium text-gray-700">
                      Alertas de Login
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleUpdateSecuritySettings} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check className="size-4 mr-2" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSecuritySettings(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {message && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          message.includes('sucesso') ? 'bg-green-100 border border-green-400 text-green-800' : 'bg-red-100 border border-red-400 text-red-800'
        }`}>
          {message}
        </div>
      )}

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