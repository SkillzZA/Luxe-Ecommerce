import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAdmin } from '@/lib/auth';

// Separate handler for GET requests that don't require authentication
async function getProductsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getProducts(req, res);
  }
  return res.status(405).json({ message: 'Method not allowed' });
}

// Handler for authenticated admin requests
async function productsAdminHandler(req: NextApiRequest, res: NextApiResponse, user: any) {
  // User is already authenticated and verified as admin by withAdmin middleware
  
  if (req.method === 'POST') {
    return createProduct(req, res, user);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}

// Main handler that routes to the appropriate handler based on method
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getProductsHandler(req, res);
  } else {
    // For POST requests, use the admin handler
    return withAdmin(productsAdminHandler)(req, res);
  }
}

// GET /api/products - Get all products with filtering and pagination
async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse query parameters
    const { 
      category, 
      featured, 
      isNew,
      inStock,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 12,
      page = 1
    } = req.query;
    
    // Build where clause
    const where: any = {};
    
    if (category && typeof category === 'string') {
      where.categoryId = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (isNew === 'true') {
      where.isNew = true;
    }
    
    if (inStock === 'true') {
      where.inStock = true;
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Calculate pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12;
    const skip = (pageNum - 1) * limitNum;
    
    // Determine sort order
    const orderBy: any = {};
    if (typeof sortBy === 'string') {
      orderBy[sortBy as string] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }
    
    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });
    
    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        images: true
      },
      orderBy,
      skip,
      take: limitNum
    });
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    return res.status(200).json({
      products,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// POST /api/products - Create a new product (admin only)
async function createProduct(req: NextApiRequest, res: NextApiResponse, user: any) {
  try {
    // Authentication is already handled by the withAdmin middleware
    console.log('Creating product as user:', user.email, 'with role:', user.role);
    
    // Validate request body
    const { 
      name, 
      description, 
      price, 
      categoryId, 
      images, 
      mainImage,
      stock = 0,
      inStock = true,
      featured = false,
      isNew = true
    } = req.body;
    
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        mainImage: mainImage || '',
        stock: parseInt(stock.toString(), 10) || 0,
        inStock: inStock || parseInt(stock.toString(), 10) > 0,
        featured,
        isNew,
        // Create product images if provided
        ...(images && images.length > 0 ? {
          images: {
            create: images.map((url: string) => ({
              url
            }))
          }
        } : {})
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
    
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
