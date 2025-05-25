import { NextApiRequest, NextApiResponse } from 'next';
import { OrderStatus, PaymentStatus, User } from '@prisma/client';
import prisma from '@/lib/prisma';
import { withAuth, withAdmin } from '@/lib/auth';

// Handler function for authenticated users
async function ordersHandler(req: NextApiRequest, res: NextApiResponse, user: User) {
  // User is already authenticated by withAuth middleware

  try {
    if (req.method === 'GET') {
      // For admin users, return all orders
      // For regular users, return only their orders
      if (user.role === 'ADMIN') {
        const orders = await prisma.order.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        
        // Format the response
        const formattedOrders = orders.map(order => ({
          id: order.id,
          userId: order.userId,
          userName: order.user.name,
          userEmail: order.user.email,
          items: order.items.map(item => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: order.total,
          status: order.status,
          shippingAddressId: order.shippingAddressId,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));
        
        return res.status(200).json({
          orders: formattedOrders
        });
      } else {
        // Regular user - only return their orders
        const orders = await prisma.order.findMany({
          where: {
            userId: user.id,
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        
        // Format the response
        const formattedOrders = orders.map(order => ({
          id: order.id,
          items: order.items.map(item => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: order.total,
          status: order.status,
          shippingAddressId: order.shippingAddressId,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }));
        
        return res.status(200).json({
          orders: formattedOrders
        });
      }
    } else if (req.method === 'POST') {
      // Create a new order
      const { items, shippingAddress, total, paymentMethod = 'CREDIT_CARD' } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must include at least one item' });
      }
      
      if (!shippingAddress) {
        return res.status(400).json({ error: 'Shipping address is required' });
      }
      
      // Extract shipping address details
      const { line1, city, state, postalCode, country } = shippingAddress;
      
      if (!line1 || !city || !state || !postalCode || !country) {
        return res.status(400).json({ error: 'Complete shipping address is required' });
      }
      
      // First create or find the shipping address
      const address = await prisma.address.create({
        data: {
          userId: user.id,
          name: shippingAddress.name,
          line1,
          city,
          state,
          postalCode,
          country,
          isDefault: false,
        },
      });
      
      // Create the order with a prisma transaction to ensure data consistency
      const order = await prisma.$transaction(async (tx) => {
        // Create the order first
        const newOrder = await tx.order.create({
          data: {
            userId: user.id,
            total: total || 0,
            status: OrderStatus.PENDING,
            shippingAddressId: address.id,
            paymentMethod,
            paymentStatus: PaymentStatus.PENDING,
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                name: item.productName || 'Product',  // Fallback name
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });

        // Fetch the complete order with all related data
        return await tx.order.findUnique({
          where: { id: newOrder.id },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        });
      });
      
      // Update product stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
      
      // Format the response
      const formattedOrder = order ? {
        id: order.id,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        status: order.status,
        shippingAddress: shippingAddress, // Use the original shipping address
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      } : null;
      
      if (!formattedOrder) {
        return res.status(500).json({ error: 'Failed to create order' });
      }
      
      return res.status(201).json(formattedOrder);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request error', error);
    return res.status(500).json({ error: 'Error processing your request' });
  }
}

// Export the handler wrapped with withAuth middleware
export default withAuth(ordersHandler);
