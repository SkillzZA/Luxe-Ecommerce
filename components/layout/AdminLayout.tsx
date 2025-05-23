import React, { ReactNode } from 'react';
import Head from 'next/head';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  return (
    <>
      <Head>
        <title>{title} | Admin Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* This wrapper ensures content starts below the navbar */}
        <div className="pt-28">
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
