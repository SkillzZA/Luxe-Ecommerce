# 🛍️ Luxe E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js, TypeScript, Prisma, and PostgreSQL. Features a beautiful dark/light theme, comprehensive admin panel, and robust inventory management.

## 🌟 Features

### 🛒 **Customer Features**
- **Product Catalog**: Browse products with categories, search, and filtering
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout System**: Complete order processing with address and payment forms
- **User Authentication**: Register, login, and profile management
- **Order Tracking**: View order history and status updates
- **Responsive Design**: Mobile-first design with dark/light theme toggle
- **Stock Validation**: Real-time stock checking prevents overselling

### 👨‍💼 **Admin Features**
- **Dashboard**: Overview with key metrics and recent activity
- **Product Management**: Full CRUD operations for products
- **Category Management**: Create, edit, and delete product categories
- **Order Management**: View, update order status, and track fulfillment
- **User Management**: Manage customer accounts and roles
- **Inventory Control**: Real-time stock tracking and management
- **Admin Authentication**: Secure admin-only access controls

### 🔧 **Technical Features**
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with role-based access control
- **Stock Management**: Transaction-based inventory updates
- **Error Handling**: Comprehensive error handling and validation
- **Type Safety**: Full TypeScript implementation
- **Responsive UI**: Tailwind CSS with dark/light theme support

## 🚀 Live Demo

**Website**: [https://luxe-e.netlify.app/](https://luxe-e.netlify.app/)

### Admin Access
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Admin Panel**: [https://luxe-e.netlify.app/admin](https://luxe-e.netlify.app/admin)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: JWT, bcryptjs
- **Deployment**: Netlify
- **Icons**: React Icons (Feather Icons)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SkillzZA/Luxe-Ecommerce.git
   cd Luxe-Ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_jwt_secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_nextauth_secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Core Models
- **User**: Customer and admin accounts with role-based access
- **Product**: Product catalog with categories, pricing, and inventory
- **Category**: Product categorization system
- **Order**: Order management with items and shipping
- **CartItem**: Shopping cart functionality
- **Address**: Customer shipping addresses

### Key Features
- **Stock Management**: Real-time inventory tracking
- **Order Processing**: Complete order lifecycle management
- **User Roles**: Customer and admin role separation
- **Transaction Safety**: Database transactions for data consistency

## 🔐 Authentication & Authorization

### User Roles
- **USER**: Standard customer access
- **ADMIN**: Full administrative access

### Protected Routes
- `/admin/*`: Admin-only access
- `/orders/*`: Authenticated users only
- `/checkout`: Supports both guest and authenticated checkout

## 📱 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `GET /api/products/[id]` - Get single product

### Protected Endpoints (Admin)
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/categories` - Create category
- `GET /api/users` - Get all users
- `GET /api/orders` - Get all orders

### User Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## 🎨 UI/UX Features

- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client and server-side validation
- **Toast Notifications**: Success/error feedback

## 🔄 Recent Updates

### ✅ **Completed Features**
- Fixed Prisma client singleton pattern for serverless deployment
- Implemented comprehensive stock management system
- Added transaction-based order processing
- Created complete category management system
- Fixed checkout process with proper error handling
- Added admin user seeding functionality
- Improved error messages and validation

### 🚀 **Performance Optimizations**
- Database connection pooling
- Optimized API responses
- Efficient state management
- Lazy loading for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern e-commerce platforms
- **Icons**: Feather Icons via React Icons
- **Images**: Unsplash for product placeholders
- **Deployment**: Netlify for hosting
- **Database**: Neon for PostgreSQL hosting

---

**Built with ❤️ by the Luxe Team**

