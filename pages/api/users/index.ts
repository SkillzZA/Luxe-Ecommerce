import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

// Handler function that will be wrapped with withAdmin middleware
async function usersHandler(req: NextApiRequest, res: NextApiResponse, user: any) {
  // User is already authenticated and verified as admin by withAdmin middleware

  try {
    if (req.method === 'GET') {
      // Get all users
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return res.status(200).json({
        users: users
      });
    } else if (req.method === 'POST') {
      // Create a new user
      const { name, email, password, role } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      
      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password, // In a real app, this would be hashed
          role: role || 'USER',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      return res.status(201).json(user);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request error', error);
    return res.status(500).json({ error: 'Error processing your request' });
  }
}

// Export the handler wrapped with withAdmin middleware
export default withAdmin(usersHandler);
