import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { FiArrowLeft, FiCheckCircle, FiClock, FiPackage, FiTruck, FiXCircle, FiUser, FiMapPin, FiCreditCard, FiShoppingCart, FiHash } from 'react-icons/fi';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string; // Optional product image
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: {
    name?: string; // Changed from fullName for consistency with API
    line1?: string; // Changed from address
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailPage = () => {
  const router = useRouter();
  const { id: orderId } = router.query;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/');
    }
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/orders');
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (orderId && isAuthenticated && user?.role === 'ADMIN') {
      const fetchOrderDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Authentication token not found. Please log in again.');
            setIsLoading(false);
            // Optionally, redirect to login:
            // router.push('/login?redirect=/admin/orders');
            return;
          }
          
          const response = await fetch(`/api/orders/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }); 
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `Failed to fetch order details (status: ${response.status})`);
          }
          const data = await response.json();
          setOrder(data);
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated, user, router]);

  const getStatusIcon = (status: Order['status']) => {
    const iconProps = { className: "mr-2 h-5 w-5" };
    switch (status) {
      case 'PENDING': return <FiClock {...iconProps} />;
      case 'PROCESSING': return <FiPackage {...iconProps} />;
      case 'SHIPPED': return <FiTruck {...iconProps} />;
      case 'DELIVERED': return <FiCheckCircle {...iconProps} />;
      case 'CANCELLED': return <FiXCircle {...iconProps} />;
      default: return <FiClock {...iconProps} />;
    }
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 dark:text-yellow-400';
      case 'PROCESSING': return 'text-blue-600 dark:text-blue-400';
      case 'SHIPPED': return 'text-purple-600 dark:text-purple-400';
      case 'DELIVERED': return 'text-green-600 dark:text-green-400';
      case 'CANCELLED': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (authLoading || isLoading) {
    return (
      <AdminLayout title="Order Details">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Error">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Order</h1>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <Link href="/admin/orders" className="btn-primary mt-6">
            <FiArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Not Found">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-700 dark:text-gray-300">The requested order could not be found.</p>
          <Link href="/admin/orders" className="btn-primary mt-6">
            <FiArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Order #${order.id.substring(0,8)}`}>
      <div className="container mx-auto px-4 pb-12">
        {/* Header */} 
        <div className="flex justify-between items-center my-8">
          <h1 className="text-3xl font-bold flex items-center">
            <FiHash className="mr-2" /> Order Details
          </h1>
          <Link href="/admin/orders" className="btn-secondary flex items-center">
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer & Order Details */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center"><FiUser className="mr-2"/>Customer</h3>
                <p>{order.userName || 'N/A'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.userEmail || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center"><FiShoppingCart className="mr-2"/>Order Info</h3>
                <p><strong>ID:</strong> #{order.id.substring(0, 8)}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className={`font-semibold ${getStatusColor(order.status)} flex items-center`}>{getStatusIcon(order.status)} {order.status}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center"><FiMapPin className="mr-2"/>Shipping Address</h3>
                <p>{order.shippingAddress?.name || 'N/A'}</p>
                <p>{order.shippingAddress?.line1 || 'N/A'}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center"><FiCreditCard className="mr-2"/>Payment</h3>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Method:</strong> {order.paymentMethod || 'N/A'}</p>
                <p><strong>Status:</strong> {order.paymentStatus || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions or Summary could go here if needed */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    {/* Subtotal might not be directly on order, sum items if needed or adjust API */}
                    <span>${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span> 
                </div>
                 <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$0.00</span> {/* Placeholder, adjust if shipping cost is available */}
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
            </div>
            {/* Can add status update dropdown here as well/instead if preferred over table */}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Items Ordered ({order.items.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU/ID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.productImage && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img className="h-10 w-10 rounded-md object-cover" src={item.productImage} alt={item.productName} />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</div>
                          {/* Could add more product details here, like color/size if available */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.productId.substring(0,8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetailPage; 