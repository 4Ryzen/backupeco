import express from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Trim and lowercase email for consistency
    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = findUserByEmail(trimmedEmail);
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = createUser({
      name: name.trim(),
      email: trimmedEmail,
      password: hashedPassword,
      role: 'user'
    });

    // Generate token
    const token = generateToken(newUser);

    // Return user data (without password)
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Trim and lowercase email
    const trimmedEmail = email.trim().toLowerCase();

    // Find user
    const user = findUserByEmail(trimmedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      message: 'Login realizado com sucesso',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres' });
    }

    // Check if email is already taken by another user
    const existingUser = findUserByEmail(email.trim().toLowerCase());
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(409).json({ error: 'Este email já está sendo usado por outro usuário' });
    }

    // Update user in database
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    db.users[userIndex].name = name.trim();
    db.users[userIndex].email = email.trim().toLowerCase();

    const updatedUser = db.users[userIndex];

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    // Find user
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    db.users[userIndex].password = hashedNewPassword;

    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update security settings
router.put('/security-settings', authenticateToken, (req, res) => {
  try {
    const { twoFactorEnabled, emailNotifications, smsNotifications, loginAlerts } = req.body;

    // In a real app, this would be stored in the database
    // For now, we'll just return success
    console.log('Security settings updated for user:', req.user.id, {
      twoFactorEnabled,
      emailNotifications,
      smsNotifications,
      loginAlerts
    });

    res.json({
      message: 'Configurações de segurança atualizadas com sucesso',
      settings: {
        twoFactorEnabled,
        emailNotifications,
        smsNotifications,
        loginAlerts
      }
    });

  } catch (error) {
    console.error('Security settings error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as authRoutes };