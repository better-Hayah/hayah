'use client';

import { useEffect } from 'react';
import { useAuthStore, useAppStore, generateMockNotifications } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { notifications, addNotification } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('🔒 Dashboard: User not authenticated, redirecting to login');
      router.push('/');
      return;
    }

    console.log('📊 Dashboard: Loading dashboard for:', user.role);
    
    // Initialize mock notifications if empty
    if (notifications.length === 0) {
      const mockNotifications = generateMockNotifications();
      mockNotifications.forEach(notification => {
        addNotification(notification);
      });
    }
  }, [isAuthenticated, user, router, notifications.length, addNotification]);

  if (!isAuthenticated || !user) {
    return null; // Redirect is handled in useEffect
  }

  const getDashboardTitle = () => {
    const titles = {
      patient: 'Patient Portal',
      doctor: 'Clinical Dashboard',
      admin: 'Administrative Dashboard',
      pharmacy: 'Pharmacy Management',
      accountant: 'Financial Dashboard',
    };
    return titles[user.role as keyof typeof titles] || 'Dashboard';
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user.profile.firstName}!`;
  };

  // Mock upcoming appointments for demo
  const upcomingAppointments = [
    {
      id: '1',
      title: 'Annual Checkup',
      doctor: 'Dr. Sarah Wilson',
      time: 'Today, 2:00 PM',
      type: 'in-person',
      location: 'Room 205, Cardiology Dept.',
    },
    {
      id: '2',
      title: 'Follow-up Consultation',
      doctor: 'Dr. Michael Chen',
      time: 'Tomorrow, 10:30 AM',
      type: 'video',
      location: 'Video Call',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-medical rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-inter font-bold mb-2">
                  {getWelcomeMessage()}
                </h1>
                <p className="text-blue-100 mb-4">
                  Welcome to your {getDashboardTitle()}. Here's what's happening today.
                </p>
                <div className="flex items-center space-x-4 text-sm text-blue-100">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>General Hospital</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />

              {/* Upcoming Appointments (for patients and doctors) */}
              {(user.role === 'patient' || user.role === 'doctor') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>Upcoming Appointments</span>
                    </CardTitle>
                    <CardDescription>
                      Your scheduled appointments for the next few days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {appointment.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {user.role === 'patient' ? `with ${appointment.doctor}` : 'Patient: John Doe'}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{appointment.time}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{appointment.location}</span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={appointment.type === 'video' ? 'default' : 'secondary'}
                              className="ml-2"
                            >
                              {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              <RecentActivity />
            
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}