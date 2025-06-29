'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Video, 
  Plus, 
  Phone, 
  FileText, 
  Pill,
  CreditCard,
  Users,
  Building,
  ClipboardList,
  Stethoscope,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  roles: string[];
  priority?: 'high' | 'medium' | 'low';
}

const quickActions: QuickAction[] = [
  {
    title: 'Book Appointment',
    description: 'Schedule a new appointment with your doctor',
    icon: Calendar,
    href: '/appointments',
    color: 'bg-blue-500 hover:bg-blue-600',
    roles: ['patient'],
    priority: 'high',
  },
  {
    title: 'Start Video Call',
    description: 'Begin a telemedicine consultation',
    icon: Video,
    href: '/telemedicine',
    color: 'bg-green-500 hover:bg-green-600',
    roles: ['patient', 'doctor'],
    priority: 'high',
  },
  {
    title: 'Emergency SOS',
    description: 'Trigger emergency alert for immediate help',
    icon: Phone,
    href: '/emergency',
    color: 'bg-red-500 hover:bg-red-600',
    roles: ['patient'],
    priority: 'high',
  },
  {
    title: 'Create Prescription',
    description: 'Write and send electronic prescriptions',
    icon: Pill,
    href: '/prescriptions',
    color: 'bg-purple-500 hover:bg-purple-600',
    roles: ['doctor'],
    priority: 'high',
  },
  {
    title: 'Patient Records',
    description: 'Access and update medical records',
    icon: FileText,
    href: '/patients/records',
    color: 'bg-teal-500 hover:bg-teal-600',
    roles: ['doctor', 'admin'],
    priority: 'medium',
  },
  {
    title: 'View Schedule',
    description: 'Check your appointment schedule',
    icon: Calendar,
    href: '/appointments/calendar',
    color: 'bg-blue-500 hover:bg-blue-600',
    roles: ['doctor'],
    priority: 'medium',
  },
  {
    title: 'Process Payments',
    description: 'Handle billing and payment processing',
    icon: CreditCard,
    href: '/billing/payments',
    color: 'bg-emerald-500 hover:bg-emerald-600',
    roles: ['accountant'],
    priority: 'high',
  },
  {
    title: 'Pharmacy Queue',
    description: 'View and process prescription orders',
    icon: Pill,
    href: '/prescriptions',
    color: 'bg-orange-500 hover:bg-orange-600',
    roles: ['pharmacy'],
    priority: 'high',
  },
  {
    title: 'Manage Staff',
    description: 'Hospital staff and department management',
    icon: Users,
    href: '/hospital/staff',
    color: 'bg-indigo-500 hover:bg-indigo-600',
    roles: ['admin'],
    priority: 'medium',
  },
  {
    title: 'Emergency Center',
    description: 'Monitor active emergency situations',
    icon: AlertTriangle,
    href: '/emergency/center',
    color: 'bg-red-500 hover:bg-red-600',
    roles: ['admin', 'doctor'],
    priority: 'high',
  },
  {
    title: 'Bed Management',
    description: 'View and manage hospital bed availability',
    icon: Building,
    href: '/hospital/beds',
    color: 'bg-gray-500 hover:bg-gray-600',
    roles: ['admin'],
    priority: 'medium',
  },
  {
    title: 'Generate Reports',
    description: 'Create clinical and financial reports',
    icon: ClipboardList,
    href: '/billing/reports',
    color: 'bg-slate-500 hover:bg-slate-600',
    roles: ['admin', 'accountant', 'doctor'],
    priority: 'low',
  },
];

export function QuickActions() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const userRole = user?.role || 'patient';
  const filteredActions = quickActions
    .filter(action => action.roles.includes(userRole))
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority || 'low'] - priorityOrder[a.priority || 'low'];
    });

  const roleTitle = {
    patient: 'Patient Actions',
    doctor: 'Clinical Actions',
    admin: 'Administrative Actions',
    pharmacy: 'Pharmacy Actions',
    accountant: 'Financial Actions',
  };

  const handleActionClick = (href: string) => {
    console.log('🔗 QuickActions: Navigating to:', href);
    router.push(href);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          <span>{roleTitle[userRole as keyof typeof roleTitle] || 'Quick Actions'}</span>
        </CardTitle>
        <CardDescription>
          Frequently used actions for your role
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActions.slice(0, 6).map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200 group"
                onClick={() => handleActionClick(action.href)}
              >
                <div className={`p-3 rounded-lg text-white ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {action.description.length > 40 
                      ? `${action.description.substring(0, 40)}...`
                      : action.description
                    }
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}