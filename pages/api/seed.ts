import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create test category
    const category = await prisma.category.upsert({
      where: { name: 'Test Category' },
      update: {},
      create: {
        name: 'Test Category',
        description: 'A test category for products',
      },
    });

    return res.status(200).json({
      message: 'Database seeded successfully',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      category: {
        id: category.id,
        name: category.name,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ message: 'Error seeding database' });
  }
}
