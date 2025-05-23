import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import AdminLayout from '@/components/layout/AdminLayout';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  inStock: boolean;
  mainImage: string;
  categoryId: string;
  categoryName?: string;
  category?: {
    id: string;
    name: string;
  };
}

const AdminProducts = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/');
    }
    
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/products');
    }
    
    // Fetch products
    const fetchProducts = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          
          // Check if data.products exists
          if (data.products) {
            // Process products with their categories
            const productsWithCategories = data.products.map((product: Product) => {
              return { 
                ...product, 
                categoryName: product.category ? product.category.name : 'Uncategorized' 
              };
            });
            
            setProducts(productsWithCategories);
          } else {
            console.error('No products found in API response');
            setProducts([]);
          }
        } else {
          console.error('Failed to fetch products:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchProducts();
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteId(id);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
      } else {
        console.error('Failed to delete product:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
      setDeleteId('');
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
    <AdminLayout title="Manage Products">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <div className="flex gap-4">
            <Link href="/admin" className="btn-secondary">
              Back to Dashboard
            </Link>
            <Link href="/admin/products/new" className="btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Add Product
            </Link>
          </div>
        </div>
        
        {isLoadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Stock
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
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            {product.mainImage ? (
                              <div className="h-10 w-10 flex items-center justify-center">
                                <Image
                                  src={product.mainImage}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{product.categoryName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{product.stock || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (product.stock > 0)
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {(product.stock > 0) ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={isDeleting && deleteId === product.id}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          >
                            {isDeleting && deleteId === product.id ? (
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <FiTrash2 className="h-5 w-5" />
                            )}
                          </button>
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
            <div className="text-gray-500 dark:text-gray-400 mb-4">No products found</div>
            <Link href="/admin/products/new" className="btn-primary inline-flex items-center">
              <FiPlus className="mr-2" />
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
