import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { withAdmin } from '@/lib/auth';

// Handler function that will be wrapped with withAdmin middleware
async function userHandler(req: NextApiRequest, res: NextApiResponse, currentUser: User) {
  // User is already authenticated and verified as admin by withAdmin middleware

  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    if (req.method === 'GET') {
      // Get a specific user
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(user);
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update a user
      const { name, email, role, password } = req.body;
      
      // Don't allow changing the role of the current user
      if (currentUser.id === id && role && role !== currentUser.role) {
        return res.status(400).json({ error: 'You cannot change your own role' });
      }
      
      // Check if email is being changed and if it's already in use
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: 'Email is already in use' });
        }
      }
      
      // Update the user
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (password) updateData.password = password; // In a real app, this would be hashed
      
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      return res.status(200).json(user);
    } else if (req.method === 'DELETE') {
      // Don't allow deleting the current user
      if (currentUser.id === id) {
        return res.status(400).json({ error: 'You cannot delete your own account' });
      }
      
      // Delete the user
      await prisma.user.delete({
        where: { id },
      });
      
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request error', error);
    return res.status(500).json({ error: 'Error processing your request' });
  }
}

// Export the handler wrapped with withAdmin middleware
export default withAdmin(userHandler);
