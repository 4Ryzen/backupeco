import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const navItems = ['Início', 'Sobre', 'Solução', 'Contato', 'Suporte'];

interface EcoHeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function EcoHeader({ onLoginClick, onSignupClick }: EcoHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-green-700">Eco</span>
              <span className="text-teal-600">Air</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              item === 'Suporte' ? (
                <Link
                  key={item}
                  to="/suporte"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </Link>
              ) : (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm transition-colors ${
                    index === 0 
                      ? 'text-gray-900 font-medium border-b-2 border-green-600 pb-1' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item}
                </a>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="size-5" />
          </Button>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 p-2"
                >
                  Olá, {user.name}
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      to="/perfil"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Meu Perfil
                    </Link>
                    <Link 
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/relatorios"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Relatórios
                    </Link>
                    <Link 
                      to="/suporte"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Suporte
                    </Link>
                    <div className="border-t border-gray-200 mt-1">
                      <button 
                        onClick={logout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={onLoginClick}>
                  Entrar
                </Button>
                <Button onClick={onSignupClick}>
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  item === 'Suporte' ? (
                    <Link
                      key={item}
                      to="/suporte"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item}
                    </Link>
                  ) : (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item}
                    </a>
                  )
                ))}
                <div className="border-t border-gray-200 pt-4">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-gray-900">Olá, {user.name}</p>
                      <Link 
                        to="/perfil"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-gray-700 hover:text-gray-900"
                      >
                        Meu Perfil
                      </Link>
                      <Link 
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-gray-700 hover:text-gray-900"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/relatorios"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-gray-700 hover:text-gray-900"
                      >
                        Relatórios
                      </Link>
                      <Link 
                        to="/suporte"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-gray-700 hover:text-gray-900"
                      >
                        Suporte
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="text-left text-sm text-gray-700 hover:text-gray-900"
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}>
                        Entrar
                      </Button>
                      <Button onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }}>
                        Criar Conta
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}