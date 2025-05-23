import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { withAdmin } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received method:', req.method);
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getProduct(req, res);
    case 'PUT':
      return updateProduct(req, res);
    case 'DELETE':
      return deleteProduct(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Wrap handlers with withAdmin middleware
const deleteProduct = withAdmin(deleteProductHandler);
const updateProduct = withAdmin(updateProductHandler);

// GET /api/products/[id] - Get a single product by ID
async function getProduct(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// PUT /api/products/[id] - Update a product (admin only)
async function updateProductHandler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    // Authentication is already handled by the withAdmin middleware
    console.log('Updating product as user:', user.email, 'with role:', user.role);
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Validate request body
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      images, 
      mainImage,
      inStock,
      featured,
      isNew
    } = req.body;
    
    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId && { categoryId }),
        ...(mainImage && { mainImage }),
        ...(images && { images }),
        ...(inStock !== undefined && { inStock }),
        ...(featured !== undefined && { featured }),
        ...(isNew !== undefined && { isNew })
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// DELETE /api/products/[id] - Delete a product (admin only)
async function deleteProductHandler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete the product
    await prisma.product.delete({
      where: { id }
    });
    
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
