'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  UserCog,
  Stethoscope,
  Shield,
  Building,
  Clock,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'doctor' | 'nurse' | 'technician' | 'administrator' | 'support';
  department: string;
  position: string;
  hireDate: Date;
  employment: 'full-time' | 'part-time' | 'contract' | 'per-diem';
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  supervisor?: string;
  licenseNumber?: string;
  certifications: string[];
  shift: 'day' | 'night' | 'rotating' | 'on-call';
  avatar?: string;
}

export default function HospitalStaffPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  // Mock staff data
  const mockStaff: StaffMember[] = [
    {
      id: 'staff_1',
      employeeId: 'EMP001',
      firstName: 'Dr. Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@hospital.com',
      phone: '+1-555-0101',
      role: 'doctor',
      department: 'Cardiology',
      position: 'Senior Cardiologist',
      hireDate: new Date('2020-03-15'),
      employment: 'full-time',
      status: 'active',
      supervisor: 'Dr. Michael Chen',
      licenseNumber: 'MD123456',
      certifications: ['Board Certified Cardiologist', 'ACLS', 'BLS'],
      shift: 'day',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'staff_2',
      employeeId: 'EMP002',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@hospital.com',
      phone: '+1-555-0102',
      role: 'doctor',
      department: 'Emergency',
      position: 'Emergency Medicine Physician',
      hireDate: new Date('2018-07-22'),
      employment: 'full-time',
      status: 'active',
      licenseNumber: 'MD789012',
      certifications: ['Emergency Medicine Board Certified', 'ATLS', 'ACLS', 'BLS'],
      shift: 'rotating',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'staff_3',
      employeeId: 'EMP003',
      firstName: 'Jennifer',
      lastName: 'Martinez',
      email: 'jennifer.martinez@hospital.com',
      phone: '+1-555-0103',
      role: 'nurse',
      department: 'Surgery',
      position: 'Charge Nurse',
      hireDate: new Date('2019-11-08'),
      employment: 'full-time',
      status: 'active',
      supervisor: 'Dr. Robert Taylor',
      licenseNumber: 'RN345678',
      certifications: ['RN', 'CNOR', 'BLS'],
      shift: 'day'
    },
    {
      id: 'staff_4',
      employeeId: 'EMP004',
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@hospital.com',
      phone: '+1-555-0104',
      role: 'technician',
      department: 'Radiology',
      position: 'Senior Radiologic Technologist',
      hireDate: new Date('2021-05-12'),
      employment: 'full-time',
      status: 'active',
      supervisor: 'Dr. Lisa Brown',
      licenseNumber: 'RT901234',
      certifications: ['ARRT', 'CT Certified', 'MRI Certified'],
      shift: 'day'
    },
    {
      id: 'staff_5',
      employeeId: 'EMP005',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@hospital.com',
      phone: '+1-555-0105',
      role: 'administrator',
      department: 'Administration',
      position: 'Department Manager',
      hireDate: new Date('2017-09-30'),
      employment: 'full-time',
      status: 'active',
      certifications: ['MBA', 'Healthcare Administration'],
      shift: 'day'
    },
    {
      id: 'staff_6',
      employeeId: 'EMP006',
      firstName: 'David',
      lastName: 'Lee',
      email: 'david.lee@hospital.com',
      phone: '+1-555-0106',
      role: 'support',
      department: 'Maintenance',
      position: 'Facilities Coordinator',
      hireDate: new Date('2022-01-15'),
      employment: 'full-time',
      status: 'on-leave',
      supervisor: 'Lisa Brown',
      certifications: ['Facilities Management'],
      shift: 'day'
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'nurse':
        return <UserCog className="w-4 h-4 text-green-600" />;
      case 'technician':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'administrator':
        return <Shield className="w-4 h-4 text-orange-600" />;
      case 'support':
        return <Building className="w-4 h-4 text-gray-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'nurse':
        return 'bg-green-100 text-green-800';
      case 'technician':
        return 'bg-purple-100 text-purple-800';
      case 'administrator':
        return 'bg-orange-100 text-orange-800';
      case 'support':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'terminated':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = 
      staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || staff.role === selectedRole;
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const StaffCard = ({ staff }: { staff: StaffMember }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
            <AvatarFallback className="text-lg">
              {staff.firstName[0]}{staff.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {staff.firstName} {staff.lastName}
                </h3>
                <p className="text-sm text-gray-600">{staff.position}</p>
                <p className="text-xs text-gray-500">ID: {staff.employeeId}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge className={getStatusColor(staff.status)}>
                  {staff.status.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge className={getRoleColor(staff.role)}>
                  {getRoleIcon(staff.role)}
                  <span className="ml-1">{staff.role.toUpperCase()}</span>
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>{staff.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{staff.shift} shift</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{staff.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Hired: {staff.hireDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{staff.employment}</span>
              </div>
            </div>

            {staff.certifications.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Certifications:</p>
                <div className="flex flex-wrap gap-1">
                  {staff.certifications.slice(0, 3).map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                  {staff.certifications.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{staff.certifications.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Link href={`/hospital/staff/${staff.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </Link>
              <Link href={`/hospital/staff/${staff.id}/edit`}>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button size="sm" variant="outline">
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const uniqueDepartments = Array.from(new Set(mockStaff.map(staff => staff.department)));
  const uniqueRoles = Array.from(new Set(mockStaff.map(staff => staff.role)));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-inter font-bold text-gray-900">
                Staff Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage hospital staff members and their information
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/hospital/staff/schedule">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedules
                </Button>
              </Link>
              <Link href="/hospital/staff/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Member
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{mockStaff.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Doctors</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {mockStaff.filter(s => s.role === 'doctor').length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Nurses</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mockStaff.filter(s => s.role === 'nurse').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCog className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {mockStaff.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-purple-600">{uniqueDepartments.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search staff by name, email, ID, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Departments</option>
                    {uniqueDepartments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    {uniqueRoles.map((role) => (
                      <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff List */}
          <div className="space-y-4">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No staff members found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No staff members match your current search criteria.
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Staff Member
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}