import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiShoppingBag, FiClock, FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }

    // Fetch user orders
    const fetchOrders = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch('/api/orders');
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, router]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders | Luxe E-Commerce</title>
        <meta name="description" content="View and track your orders" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link href="/account" className="text-primary-500 hover:text-primary-600">
            Back to Account
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
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <FiShoppingBag className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {statusFilter === 'ALL' 
                ? 'No orders found' 
                : `No ${statusFilter.toLowerCase()} orders found`}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {statusFilter === 'ALL' 
                ? 'You haven\'t placed any orders yet. Start shopping to place your first order!'
                : 'Try selecting a different status filter to see your orders.'}
            </p>
            <div className="mt-6">
              <Link href="/shop" className="btn-primary">
                Browse Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
