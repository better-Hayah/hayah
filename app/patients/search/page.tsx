'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter,
  X,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Eye,
  Edit
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchFilters {
  name: string;
  email: string;
  phone: string;
  medicalRecordNumber: string;
  dateOfBirth: string;
  gender: string;
  status: string;
  primaryDoctor: string;
  insurance: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalRecordNumber: string;
  lastVisit: Date;
  status: 'active' | 'inactive' | 'critical';
  primaryDoctor: string;
  insurance: string;
  emergencyContact: string;
  avatar?: string;
}

export default function PatientSearchPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    email: '',
    phone: '',
    medicalRecordNumber: '',
    dateOfBirth: '',
    gender: '',
    status: '',
    primaryDoctor: '',
    insurance: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    if (user.role !== 'admin' && user.role !== 'doctor') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'doctor')) {
    return null;
  }

  // Mock patients database
  const mockPatients: Patient[] = [
    {
      id: 'patient_1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'male',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'CA',
        zipCode: '12345'
      },
      medicalRecordNumber: 'MRN001234',
      lastVisit: new Date(Date.now() - 604800000),
      status: 'active',
      primaryDoctor: 'Dr. Sarah Wilson',
      insurance: 'Blue Cross Blue Shield',
      emergencyContact: 'Jane Doe - Spouse',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'patient_2',
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily.johnson@email.com',
      phone: '+1-555-0124',
      dateOfBirth: new Date('1992-07-22'),
      gender: 'female',
      address: {
        street: '456 Oak Ave',
        city: 'Riverside',
        state: 'CA',
        zipCode: '12346'
      },
      medicalRecordNumber: 'MRN001235',
      lastVisit: new Date(Date.now() - 259200000),
      status: 'active',
      primaryDoctor: 'Dr. Michael Chen',
      insurance: 'Aetna',
      emergencyContact: 'Robert Johnson - Father',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'patient_3',
      firstName: 'Robert',
      lastName: 'Smith',
      email: 'robert.smith@email.com',
      phone: '+1-555-0125',
      dateOfBirth: new Date('1978-11-08'),
      gender: 'male',
      address: {
        street: '789 Pine St',
        city: 'Lakewood',
        state: 'CA',
        zipCode: '12347'
      },
      medicalRecordNumber: 'MRN001236',
      lastVisit: new Date(Date.now() - 86400000),
      status: 'critical',
      primaryDoctor: 'Dr. Sarah Wilson',
      insurance: 'Medicare',
      emergencyContact: 'Mary Smith - Wife',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'patient_4',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1-555-0126',
      dateOfBirth: new Date('1990-05-12'),
      gender: 'female',
      address: {
        street: '321 Elm St',
        city: 'Oceanside',
        state: 'CA',
        zipCode: '12348'
      },
      medicalRecordNumber: 'MRN001237',
      lastVisit: new Date(Date.now() - 1209600000),
      status: 'active',
      primaryDoctor: 'Dr. Michael Chen',
      insurance: 'Cigna',
      emergencyContact: 'Carlos Garcia - Husband',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'patient_5',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@email.com',
      phone: '+1-555-0127',
      dateOfBirth: new Date('1965-09-30'),
      gender: 'male',
      address: {
        street: '654 Maple Dr',
        city: 'Fullerton',
        state: 'CA',
        zipCode: '12349'
      },
      medicalRecordNumber: 'MRN001238',
      lastVisit: new Date(Date.now() - 2592000000),
      status: 'inactive',
      primaryDoctor: 'Dr. Sarah Wilson',
      insurance: 'United Healthcare',
      emergencyContact: 'Linda Brown - Wife'
    }
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter patients based on search criteria
    const results = mockPatients.filter(patient => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const nameMatch = !filters.name || fullName.includes(filters.name.toLowerCase());
      const emailMatch = !filters.email || patient.email.toLowerCase().includes(filters.email.toLowerCase());
      const phoneMatch = !filters.phone || patient.phone.includes(filters.phone);
      const mrnMatch = !filters.medicalRecordNumber || patient.medicalRecordNumber.toLowerCase().includes(filters.medicalRecordNumber.toLowerCase());
      const dobMatch = !filters.dateOfBirth || patient.dateOfBirth.toISOString().split('T')[0] === filters.dateOfBirth;
      const genderMatch = !filters.gender || patient.gender === filters.gender;
      const statusMatch = !filters.status || patient.status === filters.status;
      const doctorMatch = !filters.primaryDoctor || patient.primaryDoctor.toLowerCase().includes(filters.primaryDoctor.toLowerCase());
      const insuranceMatch = !filters.insurance || patient.insurance.toLowerCase().includes(filters.insurance.toLowerCase());
      const cityMatch = !filters.city || patient.address.city.toLowerCase().includes(filters.city.toLowerCase());
      const stateMatch = !filters.state || patient.address.state.toLowerCase().includes(filters.state.toLowerCase());
      const zipMatch = !filters.zipCode || patient.address.zipCode.includes(filters.zipCode);
      
      return nameMatch && emailMatch && phoneMatch && mrnMatch && dobMatch && 
             genderMatch && statusMatch && doctorMatch && insuranceMatch && 
             cityMatch && stateMatch && zipMatch;
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      email: '',
      phone: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      gender: '',
      status: '',
      primaryDoctor: '',
      insurance: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={patient.avatar} alt={`${patient.firstName} ${patient.lastName}`} />
            <AvatarFallback className="text-lg">
              {patient.firstName[0]}{patient.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h3>
                <p className="text-sm text-gray-600">MRN: {patient.medicalRecordNumber}</p>
              </div>
              <Badge className={getStatusColor(patient.status)}>
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{calculateAge(patient.dateOfBirth)} years old, {patient.gender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{patient.address.city}, {patient.address.state}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Last visit: {patient.lastVisit.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Dr: {patient.primaryDoctor}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Link href={`/patients/${patient.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </Link>
              <Link href={`/patients/${patient.id}/edit`}>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Link href={`/patients/records?patient=${patient.id}`}>
                <Button size="sm" variant="outline">
                  <FileText className="w-4 h-4 mr-1" />
                  Records
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-inter font-bold text-gray-900">
                Advanced Patient Search
              </h1>
              <p className="text-gray-600 mt-1">
                Search for patients using multiple criteria and filters
              </p>
            </div>
            <Link href="/patients">
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                Back to Patients
              </Button>
            </Link>
          </div>

          {/* Search Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Search Filters</span>
              </CardTitle>
              <CardDescription>
                Use the filters below to search for specific patients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="First or last name"
                      value={filters.name}
                      onChange={(e) => handleFilterChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@email.com"
                      value={filters.email}
                      onChange={(e) => handleFilterChange('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1-555-0123"
                      value={filters.phone}
                      onChange={(e) => handleFilterChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mrn">Medical Record Number</Label>
                    <Input
                      id="mrn"
                      placeholder="MRN001234"
                      value={filters.medicalRecordNumber}
                      onChange={(e) => handleFilterChange('medicalRecordNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={filters.dateOfBirth}
                      onChange={(e) => handleFilterChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={filters.gender}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Genders</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="critical">Critical</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Primary Doctor</Label>
                    <Input
                      id="doctor"
                      placeholder="Dr. Smith"
                      value={filters.primaryDoctor}
                      onChange={(e) => handleFilterChange('primaryDoctor', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance Provider</Label>
                    <Input
                      id="insurance"
                      placeholder="Blue Cross"
                      value={filters.insurance}
                      onChange={(e) => handleFilterChange('insurance', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Springfield"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="12345"
                      value={filters.zipCode}
                      onChange={(e) => handleFilterChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button onClick={handleSearch} disabled={isSearching}>
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? 'Searching...' : 'Search Patients'}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  {searchResults.length} patient{searchResults.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((patient) => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No patients found
                    </h3>
                    <p className="text-gray-600">
                      No patients match your search criteria. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}