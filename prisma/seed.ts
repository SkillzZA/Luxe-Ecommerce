import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create demo user
  const userPassword = await hashPassword('password123');
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo User',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('Demo user created:', user.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: {
        name: 'Clothing',
        description: 'Fashionable clothing items',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: {
        name: 'Electronics',
        description: 'Latest electronic gadgets',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Home & Kitchen' },
      update: {},
      create: {
        name: 'Home & Kitchen',
        description: 'Essential items for your home',
      },
    }),
  ]);
  console.log('Categories created:', categories.map(c => c.name).join(', '));

  // Create products
  const products = await Promise.all([
    // Clothing products
    prisma.product.create({
      data: {
        name: 'Classic T-Shirt',
        description: 'A comfortable cotton t-shirt for everyday wear',
        price: 19.99,
        stock: 100,
        inStock: true,
        categoryId: categories[0].id,
        mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Classic T-Shirt front view',
              position: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Classic T-Shirt back view',
              position: 1,
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Denim Jeans',
        description: 'High-quality denim jeans for a stylish look',
        price: 49.99,
        stock: 75,
        inStock: true,
        categoryId: categories[0].id,
        mainImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Denim Jeans front view',
              position: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Denim Jeans detail view',
              position: 1,
            }
          ]
        }
      }
    }),
    
    // Electronics products
    prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation',
        price: 129.99,
        stock: 50,
        inStock: true,
        categoryId: categories[1].id,
        mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Wireless Headphones front view',
              position: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Wireless Headphones in use',
              position: 1,
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch',
        description: 'Feature-packed smartwatch with health monitoring',
        price: 199.99,
        stock: 30,
        inStock: true,
        categoryId: categories[1].id,
        mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Smart Watch front view',
              position: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Smart Watch on wrist',
              position: 1,
            }
          ]
        }
      }
    }),
    
    // Home & Kitchen products
    prisma.product.create({
      data: {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker for the perfect brew',
        price: 89.99,
        stock: 40,
        inStock: true,
        categoryId: categories[2].id,
        mainImage: 'https://images.unsplash.com/photo-1570087407133-a0d36bb41e0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1570087407133-a0d36bb41e0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Coffee Maker front view',
              position: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1606791405792-1004f1d5e60a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Coffee Maker in use',
              position: 1,
            }
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Kitchen Knife Set',
        description: 'Professional-grade kitchen knife set with block',
        price: 149.99,
        stock: 25,
        inStock: true,
        categoryId: categories[2].id,
        mainImage: 'https://images.unsplash.com/photo-1593618998160-854742b8984a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1593618998160-854742b8984a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Kitchen Knife Set',
              position: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1566454419290-57a0589c9b17?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              alt: 'Kitchen Knife in use',
              position: 1,
            }
          ]
        }
      }
    }),
  ]);
  
  console.log(`Created ${products.length} products`);
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
