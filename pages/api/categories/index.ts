import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAdmin } from '@/lib/auth'; // Import withAdmin middleware

// Define a type for the user object passed by withAdmin (adjust as needed)
interface AdminUser {
  id: string;
  role: string;
  // Add other relevant user properties
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCategories(req, res);
    case 'POST':
      // Wrap POST handler with withAdmin
      return withAdmin(createCategoryHandler)(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// GET /api/categories - Get all categories
async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: { // This will include the count of related products
          select: { products: true },
        },
      }
    });
    
    // The productCount will be available as category._count.products
    // The frontend is already set up to look for cat._count?.products
    return res.status(200).json({
      categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/categories - Create a new category (admin only)
async function createCategoryHandler(req: NextApiRequest, res: NextApiResponse, user: AdminUser) {
  try {
    console.log('Creating category as user:', user.id, 'with role:', user.role); // Example logging

    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Check if category with the same name already exists (case-insensitive check)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name.trim(),
          // mode: 'insensitive', // Removed for broader compatibility
        },
      },
    });

    if (existingCategory) {
      return res.status(409).json({ message: 'A category with this name already exists' });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description || null, // Set to null if description is empty
      },
    });

    return res.status(201).json({ category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    // Prisma unique constraint violation code is P2002
    if (error instanceof Error && (error as any).code === 'P2002') {
        return res.status(409).json({ message: 'A category with this name already exists.' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}
