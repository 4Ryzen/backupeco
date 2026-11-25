import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Mesmo formato que o resto do site já usa (user.name, user.email, user.role)
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function toUser(u: SupabaseUser | null | undefined): User | null {
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const appMeta = (u.app_metadata ?? {}) as Record<string, unknown>;
  const email = u.email ?? '';
  return {
    id: u.id,
    name: (meta.name as string) || email.split('@')[0] || 'Usuário',
    email,
    // role só pode ser definido por app_metadata (não editável pelo usuário)
    role: (appMeta.role as string) || 'user',
  };
}

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu email antes de entrar. Verifique sua caixa de entrada e o spam.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Este email já está cadastrado.';
  if (m.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
  if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes')) return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'Erro de rede. Verifique sua conexão e tente novamente.';
  if (m.includes('invalid email') || m.includes('unable to validate email')) return 'Email inválido.';
  if (m.includes('signups not allowed') || m.includes('signup is disabled')) return 'Novos cadastros estão desativados.';
  return message;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // só para a checagem inicial da sessão
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session?.user));
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session?.user));
      setIsLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { success: false, message: translateError(error.message) };
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Erro de rede ao tentar fazer login.' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) return { success: false, message: translateError(error.message) };

      // Com "Confirm email" ligado no Supabase, não vem sessão até o usuário clicar no link.
      // Se o email já existe, o Supabase devolve um usuário sem identities (sem erro).
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { success: false, message: 'Este email já está cadastrado.' };
      }
      return { success: true, needsEmailConfirmation: !data.session };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, message: 'Erro de rede ao tentar criar conta.' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Atualiza só o estado local (o ProfilePage grava no Supabase antes de chamar)
  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : prev));
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isLoading: isLoading || isSubmitting,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
