import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { FiEdit2, FiTrash2, FiPlus, FiMail, FiUser, FiShield } from 'react-icons/fi';
import AdminLayout from '@/components/layout/AdminLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminUsers = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/');
    }
    
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/users');
    }
    
    // Fetch users
    const fetchUsers = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleDelete = async (id: string) => {
    // Don't allow deleting yourself
    if (id === user?.id) {
      alert("You cannot delete your own account");
      return;
    }
    
    setIsDeleting(true);
    setDeleteId(id);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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
    <AdminLayout title="Manage Users">
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <div className="flex gap-4">
            <Link href="/admin" className="btn-secondary">
              Back to Dashboard
            </Link>
            <Link href="/admin/users/new" className="btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Add User
            </Link>
          </div>
        </div>
        
        {isLoadingUsers ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((userData) => (
                    <tr key={userData.id} className={userData.id === user?.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                            <FiUser className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userData.name}
                              {userData.id === user?.id && (
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <FiMail className="mr-2 text-gray-500" />
                          {userData.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          userData.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {userData.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/users/edit/${userData.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(userData.id)}
                            disabled={isDeleting && deleteId === userData.id || userData.id === user?.id}
                            className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${
                              userData.id === user?.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isDeleting && deleteId === userData.id ? (
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
            <div className="text-gray-500 dark:text-gray-400 mb-4">No users found</div>
            <Link href="/admin/users/new" className="btn-primary inline-flex items-center">
              <FiPlus className="mr-2" />
              Add User
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
