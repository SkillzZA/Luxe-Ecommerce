import prisma from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    const adminPassword = await hashPassword('admin123');
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@luxe.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@luxe.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@luxe.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: ADMIN');
    console.log('🆔 ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 