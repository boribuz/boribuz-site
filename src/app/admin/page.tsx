"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdminAuth } from '../_components/UnifiedAuthContext';

export default function AdminPage() {
  const { isLoading, hasAccess, shouldRedirect } = useRequireAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect to menu if user has admin access
    if (hasAccess) {
      router.replace('/admin/menu');
    }
  }, [hasAccess, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Checking authentication...</div>
      </div>
    );
  }

  // Show access denied if not authorized (while redirect is happening)
  if (shouldRedirect || !hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You need admin privileges to access this page.</p>
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Redirecting to menu management...</div>
    </div>
  );
}
