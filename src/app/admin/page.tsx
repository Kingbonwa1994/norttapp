'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminTabs from '@/components/admin/AdminTabs';
import { useUser } from '@/lib/hooks/useUser';

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!isLoading && (!user || user.role !== 'admin')) {
        router.push('/');
      }
    };

    checkAdmin();
  }, [user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <AdminTabs />
        </div>
      </div>
    </div>
  );
}