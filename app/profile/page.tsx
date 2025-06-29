'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  Edit,
  Camera,
  Heart,
  Activity,
  Pill,
  FileText,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getRoleColor = (role: string) => {
    const colors = {
      patient: 'bg-blue-100 text-blue-800',
      doctor: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
      pharmacy: 'bg-orange-100 text-orange-800',
      accountant: 'bg-teal-100 text-teal-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      patient: 'Patient Portal Access',
      doctor: 'Medical Professional',
      admin: 'Hospital Administrator',
      pharmacy: 'Pharmacy Staff',
      accountant: 'Financial Department',
    };
    return descriptions[role as keyof typeof descriptions] || 'System User';
  };

  // Mock medical data for patients
  const mockMedicalInfo = {
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1-555-0199'
    },
    insurance: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001'
    }
  };

  const mockStats = {
    totalAppointments: 24,
    completedAppointments: 22,
    activePrescriptions: 3,
    lastVisit: new Date(Date.now() - 2592000000) // 30 days ago
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.profile.avatar} alt={user.profile.firstName} />
                    <AvatarFallback className="text-2xl">
                      {user.profile.firstName[0]}{user.profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={() => alert('Photo upload would be implemented here')}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user.profile.firstName} {user.profile.lastName}
                      </h1>
                      <p className="text-gray-600">{getRoleDescription(user.role)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getRoleColor(user.role)}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <Activity className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0">
                      <Link href="/settings">
                        <Button>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{user.profile.phone}</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {user.profile.address.street}<br />
                          {user.profile.address.city}, {user.profile.address.state} {user.profile.address.zipCode}<br />
                          {user.profile.address.country}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">{user.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Clock className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-medium">
                          {user.lastLoginAt ? user.lastLoginAt.toLocaleDateString() : 'Today'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information (for patients) */}
              {user.role === 'patient' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="w-5 h-5" />
                      <span>Medical Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Blood Type</p>
                        <p className="font-medium text-red-600">{mockMedicalInfo.bloodType}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Allergies</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mockMedicalInfo.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Chronic Conditions</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mockMedicalInfo.chronicConditions.map((condition, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Emergency Contact (for patients) */}
              {user.role === 'patient' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{mockMedicalInfo.emergencyContact.name}</p>
                      <p className="text-sm text-gray-600">{mockMedicalInfo.emergencyContact.relationship}</p>
                      <p className="text-sm text-gray-600">{mockMedicalInfo.emergencyContact.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Total Appointments</span>
                    </div>
                    <span className="font-semibold">{mockStats.totalAppointments}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="font-semibold">{mockStats.completedAppointments}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Active Prescriptions</span>
                    </div>
                    <span className="font-semibold">{mockStats.activePrescriptions}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Last Visit</span>
                    </div>
                    <span className="font-semibold text-sm">
                      {mockStats.lastVisit.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information (for patients) */}
              {user.role === 'patient' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Insurance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Provider</p>
                      <p className="font-medium">{mockMedicalInfo.insurance.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Policy Number</p>
                      <p className="font-medium font-mono text-sm">{mockMedicalInfo.insurance.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Group Number</p>
                      <p className="font-medium font-mono text-sm">{mockMedicalInfo.insurance.groupNumber}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  
                  {user.role === 'patient' && (
                    <>
                      <Link href="/appointments">
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          View Appointments
                        </Button>
                      </Link>
                      
                      <Link href="/prescriptions">
                        <Button variant="outline" className="w-full justify-start">
                          <Pill className="w-4 h-4 mr-2" />
                          My Prescriptions
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Records
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}