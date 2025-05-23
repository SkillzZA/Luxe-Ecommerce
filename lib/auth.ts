import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT secret key - in production, this should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-jwt-authentication';

// Token expiration (1 day)
const EXPIRES_IN = '1d';

// Generate JWT token
export const generateToken = (user: Partial<User>) => {
  // Exclude password from token payload
  const { password, ...userWithoutPassword } = user as User & { password: string };
  
  return jwt.sign(userWithoutPassword, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
};

// Verify JWT token
export const verifyToken = (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: Error | null, decoded: any) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded as User);
    });
  });
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password with hash
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Auth middleware for API routes
export const withAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse, user: User) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      const user = await verifyToken(token);
      
      return handler(req, res, user);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
};

// Admin middleware for API routes
export const withAdmin = (
  handler: (req: NextApiRequest, res: NextApiResponse, user: User) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      const user = await verifyToken(token);
      
      if (user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }
      
      return handler(req, res, user);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
};
