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
      return getCategory(req, res);
    case 'PUT':
      // Wrap PUT handler with withAdmin
      return withAdmin(updateCategoryHandler)(req, res);
    case 'DELETE':
      // Wrap DELETE handler with withAdmin
      return withAdmin(deleteCategoryHandler)(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// GET /api/categories/[id] - Get a single category by ID and its products
async function getCategory(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await prisma.product.findMany({
      where: { categoryId: id },
      include: {
        // images: {
        //   select: {
        //     id: true,
        //     url: true,
        //     alt: true,
        //     position: true
        //   },
        //   orderBy: {
        //     position: 'asc'
        //   }
        // }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json({
      category,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching category details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/categories/[id] - Update a category (admin only)
async function updateCategoryHandler(req: NextApiRequest, res: NextApiResponse, user: AdminUser) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    console.log('Updating category as user:', user.id, 'with role:', user.role); // Example logging

    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null, // Set to null if description is empty
      },
    });

    return res.status(200).json({ category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return res.status(409).json({ message: 'A category with this name already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/categories/[id] - Delete a category (admin only)
async function deleteCategoryHandler(req: NextApiRequest, res: NextApiResponse, user: AdminUser) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    console.log('Deleting category as user:', user.id, 'with role:', user.role); // Example logging

    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: { products: true } // Check if category has products
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Optional: Prevent deletion if category has products associated with it
    if (existingCategory.products && existingCategory.products.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category: It has associated products. Please reassign or delete them first.' });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
