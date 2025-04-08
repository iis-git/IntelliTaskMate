import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { storage } from './storage';
import { User, InsertUser } from '../shared/schema';

// This should be in a .env file in a real application
const JWT_SECRET = process.env.JWT_SECRET || 'AURA_VERY_SECRET_KEY_CHANGE_ME_IN_PRODUCTION';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// Generate a JWT token for a user
export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Register a new user
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, name, email } = req.body;
    
    // Check if user exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      name,
      email
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Return user and token
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

// Login user
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await storage.getUserByUsername(username);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Verify password
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user and token
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}

// Authentication middleware
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    
    // Check if header format is valid
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number, username: string };
    
    // Add user to request
    req.user = { id: decoded.id, username: decoded.username };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get current user
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error getting user info' });
  }
}