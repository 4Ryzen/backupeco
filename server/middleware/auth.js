import jwt from 'jsonwebtoken';
import { findUserById } from '../database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    // Get full user data from database
    const userData = findUserById(user.id);
    if (!userData) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    req.user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    };
    next();
  });
};

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};