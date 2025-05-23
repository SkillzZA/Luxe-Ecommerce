import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiEye, FiPackage, FiCheck, FiClock, FiTruck, FiX } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminOrders = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/');
    }
    
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/orders');
    }
    
    // Fetch orders
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token
        const response = await fetch('/api/orders', {
          headers: {
            // Add Authorization header if token exists
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, router, user]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token'); // Get token
      if (!token) {
        // Handle missing token, perhaps show an error or redirect
        console.error('Auth token not found. Cannot update order status.');
        // You could set an error state here to inform the user
        return;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        // Update the order in the UI
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: status as Order['status'] } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FiClock className="text-yellow-500" />;
      case 'PROCESSING':
        return <FiPackage className="text-blue-500" />;
      case 'SHIPPED':
        return <FiTruck className="text-purple-500" />;
      case 'DELIVERED':
        return <FiCheck className="text-green-500" />;
      case 'CANCELLED':
        return <FiX className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Manage Orders">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Orders</h1>
          <Link href="/admin" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
        
        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                statusFilter === 'ALL'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                statusFilter === 'PENDING'
                  ? 'bg-primary-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}
            >
              <FiClock className="mr-1" /> Pending
            </button>
            <button
              onClick={() => setStatusFilter('PROCESSING')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                statusFilter === 'PROCESSING'
                  ? 'bg-primary-500 text-white'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              }`}
            >
              <FiPackage className="mr-1" /> Processing
            </button>
            <button
              onClick={() => setStatusFilter('SHIPPED')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                statusFilter === 'SHIPPED'
                  ? 'bg-primary-500 text-white'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
              }`}
            >
              <FiTruck className="mr-1" /> Shipped
            </button>
            <button
              onClick={() => setStatusFilter('DELIVERED')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                statusFilter === 'DELIVERED'
                  ? 'bg-primary-500 text-white'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              }`}
            >
              <FiCheck className="mr-1" /> Delivered
            </button>
            <button
              onClick={() => setStatusFilter('CANCELLED')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                statusFilter === 'CANCELLED'
                  ? 'bg-primary-500 text-white'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              <FiX className="mr-1" /> Cancelled
            </button>
          </div>
        </div>
        
        {isLoadingOrders ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{order.userName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="View Order"
                          >
                            <FiEye className="h-5 w-5" />
                          </Link>
                          
                          {/* Status Update Dropdown */}
                          {(order.status !== 'DELIVERED' && order.status !== 'CANCELLED') && (
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="ml-2 p-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                            >
                              {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(statusValue => {
                                // Prevent reverting from a final status or selecting current status again as an 'action'
                                if (order.status === 'DELIVERED' && statusValue !== 'DELIVERED') return null;
                                if (order.status === 'CANCELLED' && statusValue !== 'CANCELLED') return null;
                                
                                // Disable options that are not logical next steps or are past steps
                                let disabled = false;
                                if (order.status === 'PROCESSING' && statusValue === 'PENDING') disabled = true;
                                if (order.status === 'SHIPPED' && (statusValue === 'PENDING' || statusValue === 'PROCESSING')) disabled = true;
                                if (order.status === 'DELIVERED' && statusValue !== 'DELIVERED') disabled = true; // Should not change from delivered except to delivered itself
                                if (order.status === 'CANCELLED' && statusValue !== 'CANCELLED') disabled = true; // Should not change from cancelled

                                return (
                                  <option key={statusValue} value={statusValue} disabled={disabled}>
                                    {statusValue.charAt(0) + statusValue.slice(1).toLowerCase()}
                                  </option>
                                );
                              })}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              {statusFilter === 'ALL' 
                ? 'No orders found' 
                : `No ${statusFilter.toLowerCase()} orders found`}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
