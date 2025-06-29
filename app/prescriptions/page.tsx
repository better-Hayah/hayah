'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Pill, 
  Search, 
  Filter,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Building,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Prescription, PrescriptionStatus } from '@/types';

export default function PrescriptionsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PrescriptionStatus | 'all'>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // Mock prescriptions data
  const mockPrescriptions: Prescription[] = [
    {
      id: 'rx_1',
      patientId: 'patient_1',
      doctorId: 'doctor_1',
      pharmacyId: 'pharmacy_1',
      medication: {
        id: 'med_1',
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        brandName: 'Amoxil',
        ndcNumber: '0093-4155-73',
        strength: '500mg',
        form: 'capsule',
        routeOfAdministration: 'Oral',
        contraindications: ['Penicillin allergy'],
        sideEffects: ['Nausea', 'Diarrhea', 'Rash'],
        warnings: ['Take with food']
      },
      dosage: {
        amount: 1,
        unit: 'capsule',
        frequency: 'Three times daily',
        duration: '7 days',
        route: 'Oral'
      },
      quantity: 21,
      refills: 0,
      refillsRemaining: 0,
      status: 'active',
      prescribedDate: new Date(Date.now() - 86400000), // Yesterday
      expirationDate: new Date(Date.now() + 31536000000), // 1 year from now
      instructions: 'Take one capsule three times daily with food for 7 days',
      notes: 'For bacterial infection treatment',
      interactions: []
    },
    {
      id: 'rx_2',
      patientId: 'patient_1',
      doctorId: 'doctor_2',
      pharmacyId: 'pharmacy_1',
      medication: {
        id: 'med_2',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        brandName: 'Prinivil',
        ndcNumber: '0071-0222-23',
        strength: '10mg',
        form: 'tablet',
        routeOfAdministration: 'Oral',
        contraindications: ['Pregnancy', 'Angioedema history'],
        sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia'],
        warnings: ['Monitor blood pressure regularly']
      },
      dosage: {
        amount: 1,
        unit: 'tablet',
        frequency: 'Once daily',
        duration: 'Ongoing',
        route: 'Oral'
      },
      quantity: 30,
      refills: 5,
      refillsRemaining: 5,
      status: 'active',
      prescribedDate: new Date(Date.now() - 2592000000), // 30 days ago
      expirationDate: new Date(Date.now() + 31536000000), // 1 year from now
      instructions: 'Take one tablet once daily in the morning',
      notes: 'For blood pressure management',
      interactions: []
    },
    {
      id: 'rx_3',
      patientId: 'patient_1',
      doctorId: 'doctor_1',
      pharmacyId: 'pharmacy_1',
      medication: {
        id: 'med_3',
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        brandName: 'Advil',
        ndcNumber: '0573-0164-40',
        strength: '200mg',
        form: 'tablet',
        routeOfAdministration: 'Oral',
        contraindications: ['GI bleeding', 'Kidney disease'],
        sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
        warnings: ['Take with food or milk']
      },
      dosage: {
        amount: 1,
        unit: 'tablet',
        frequency: 'As needed',
        duration: '30 days',
        route: 'Oral'
      },
      quantity: 60,
      refills: 2,
      refillsRemaining: 0,
      status: 'completed',
      prescribedDate: new Date(Date.now() - 5184000000), // 60 days ago
      expirationDate: new Date(Date.now() - 2592000000), // 30 days ago
      instructions: 'Take one tablet as needed for pain, maximum 3 times daily',
      notes: 'For pain management',
      interactions: []
    }
  ];

  const getStatusIcon = (status: PrescriptionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: PrescriptionStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'expired':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  const handleRefillRequest = (prescriptionId: string) => {
    console.log('Requesting refill for prescription:', prescriptionId);
    alert('Refill request submitted successfully! You will be notified when it\'s ready for pickup.');
  };

  const handleReorder = (prescriptionId: string) => {
    console.log('Reordering prescription:', prescriptionId);
    alert('Reorder request submitted! Please consult with your doctor for a new prescription.');
  };

  const handleViewDetails = (prescription: Prescription) => {
    console.log('Viewing prescription details:', prescription.id);
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleBookAppointment = () => {
    console.log('Booking appointment');
    router.push('/appointments');
  };

  const handleRequestPrescription = () => {
    console.log('Requesting prescription');
    if (user.role === 'patient') {
      router.push('/appointments');
    } else {
      alert('Prescription creation form would open here');
    }
  };

  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesSearch = prescription.medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.medication.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || prescription.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activePrescriptions = filteredPrescriptions.filter(rx => rx.status === 'active');
  const completedPrescriptions = filteredPrescriptions.filter(rx => rx.status === 'completed' || rx.status === 'expired');

  const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Pill className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                {prescription.medication.name} {prescription.medication.strength}
              </h3>
              <Badge className={getStatusColor(prescription.status)}>
                {getStatusIcon(prescription.status)}
                <span className="ml-1">{prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}</span>
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {prescription.medication.genericName} • {prescription.medication.form}
            </p>
            
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Instructions:</strong> {prescription.instructions}</p>
              <p><strong>Quantity:</strong> {prescription.quantity} {prescription.dosage.unit}s</p>
              {prescription.refillsRemaining > 0 && (
                <p><strong>Refills Remaining:</strong> {prescription.refillsRemaining}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Prescribed: {prescription.prescribedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Expires: {prescription.expirationDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Dr. {user.role === 'patient' ? 'Smith' : 'Johnson'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Main Pharmacy</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            {prescription.status === 'active' && prescription.refillsRemaining > 0 && (
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleRefillRequest(prescription.id)}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Request Refill
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewDetails(prescription)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            {prescription.status === 'completed' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleReorder(prescription.id)}
              >
                Reorder
              </Button>
            )}
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
                {user.role === 'patient' ? 'My Prescriptions' : 
                 user.role === 'doctor' ? 'Patient Prescriptions' : 
                 'Prescription Management'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === 'patient' 
                  ? 'View and manage your current and past prescriptions'
                  : user.role === 'doctor'
                  ? 'Create and manage patient prescriptions'
                  : 'Process and fulfill prescription orders'
                }
              </p>
            </div>
            <Button className="flex items-center space-x-2" onClick={handleRequestPrescription}>
              <Plus className="w-4 h-4" />
              <span>{user.role === 'patient' ? 'Request Prescription' : 'New Prescription'}</span>
            </Button>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search prescriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as PrescriptionStatus | 'all')}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions Tabs */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="active">Active ({activePrescriptions.length})</TabsTrigger>
              <TabsTrigger value="history">History ({completedPrescriptions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activePrescriptions.length > 0 ? (
                activePrescriptions.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No active prescriptions
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You don't have any active prescriptions at the moment.
                    </p>
                    {user.role === 'patient' && (
                      <Button onClick={handleBookAppointment}>
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {completedPrescriptions.length > 0 ? (
                completedPrescriptions.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No prescription history
                    </h3>
                    <p className="text-gray-600">
                      Your prescription history will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Prescription Details Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Prescription Details</DialogTitle>
                <DialogDescription>
                  Complete information for {selectedPrescription?.medication.name}
                </DialogDescription>
              </DialogHeader>
              {selectedPrescription && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Medication</h3>
                      <p><strong>Name:</strong> {selectedPrescription.medication.name}</p>
                      <p><strong>Generic:</strong> {selectedPrescription.medication.genericName}</p>
                      <p><strong>Brand:</strong> {selectedPrescription.medication.brandName}</p>
                      <p><strong>Strength:</strong> {selectedPrescription.medication.strength}</p>
                      <p><strong>Form:</strong> {selectedPrescription.medication.form}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Dosage</h3>
                      <p><strong>Amount:</strong> {selectedPrescription.dosage.amount} {selectedPrescription.dosage.unit}</p>
                      <p><strong>Frequency:</strong> {selectedPrescription.dosage.frequency}</p>
                      <p><strong>Duration:</strong> {selectedPrescription.dosage.duration}</p>
                      <p><strong>Route:</strong> {selectedPrescription.dosage.route}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Instructions</h3>
                    <p className="text-gray-700">{selectedPrescription.instructions}</p>
                    {selectedPrescription.notes && (
                      <p className="text-gray-600 mt-2"><strong>Notes:</strong> {selectedPrescription.notes}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Warnings & Side Effects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-red-600">Contraindications:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {selectedPrescription.medication.contraindications.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-orange-600">Side Effects:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {selectedPrescription.medication.sideEffects.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-medium text-blue-600">Warnings:</p>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {selectedPrescription.medication.warnings.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}