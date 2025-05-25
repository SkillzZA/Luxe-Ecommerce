import { NextApiRequest, NextApiResponse } from 'next';
import { OrderStatus, User as PrismaUser } from '@prisma/client';
import prisma from '@/lib/prisma';
import { withAdmin } from '@/lib/auth';

// Define a type for the user object passed by withAdmin (adjust as needed from your withAdmin implementation)
interface AdminUser {
  id: string;
  role: string;
  email?: string; // Add other relevant user properties from your User type in withAdmin
  name?: string;
}

async function orderByIdHandler(req: NextApiRequest, res: NextApiResponse, user: AdminUser) {
  const { id: orderId } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
                mainImage: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.method === 'GET') {
      // Format the response to match what the OrderDetailPage expects
      const formattedOrder = {
        id: order.id,
        userId: order.userId,
        userName: order.user.name,
        userEmail: order.user.email,
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.mainImage,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        status: order.status,
        shippingAddress: order.shippingAddress ? {
          name: order.shippingAddress.name,
          line1: order.shippingAddress.line1,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.postalCode,
          country: order.shippingAddress.country,
        } : null,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
      return res.status(200).json(formattedOrder);
    } else if (req.method === 'PATCH' || req.method === 'PUT') {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: status as OrderStatus },
        include: {
          user: true,
          items: { include: { product: true } },
          shippingAddress: true,
        },
      });

      if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
        // Restore stock in a transaction
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { 
                stock: { increment: item.quantity },
                inStock: true  // Product is back in stock
              },
            });
          }
        });
      }
      return res.status(200).json(updatedOrder);
    } else if (req.method === 'DELETE') {
      await prisma.order.delete({ where: { id: orderId } });
      return res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'PATCH', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Order API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAdmin(orderByIdHandler);
