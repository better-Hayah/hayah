'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { authService } from '@/lib/auth';
import { LoginForm } from '@/components/auth/login-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, isAuthenticated, setUser, setLoading } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 HomePage: Initializing authentication...');
      setLoading(true);
      
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          console.log('✅ HomePage: User found, redirecting to dashboard');
          setUser(currentUser);
          router.push('/dashboard');
        } else {
          console.log('❌ HomePage: No user found, showing login');
        }
      } catch (error) {
        console.error('❌ HomePage: Auth initialization error:', error);
      } finally {
        setLoading(false);
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [setUser, setLoading, router]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user && !isInitializing) {
      console.log('🔄 HomePage: Authenticated user detected, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-inter font-bold text-gray-900">
              MediCare System
            </h1>
            <p className="text-gray-600">Loading your healthcare dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // This will be handled by the useEffect redirect, but show loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <LoginForm />;
}