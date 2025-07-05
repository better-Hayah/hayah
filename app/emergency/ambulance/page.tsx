'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Truck, 
  MapPin, 
  Clock,
  User,
  Activity,
  Navigation,
  Radio,
  Fuel,
  Wrench,
  Search,
  Filter,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Ambulance {
  id: string;
  vehicleNumber: string;
  status: 'available' | 'dispatched' | 'on-scene' | 'transporting' | 'at-hospital' | 'out-of-service' | 'maintenance';
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  crew: CrewMember[];
  currentCall?: {
    id: string;
    type: string;
    priority: string;
    destination: string;
    eta?: number;
  };
  equipment: Equipment[];
  maintenance: {
    lastService: Date;
    nextService: Date;
    mileage: number;
    fuelLevel: number;
  };
  shift: {
    startTime: Date;
    endTime: Date;
    supervisor: string;
  };
}

interface CrewMember {
  id: string;
  name: string;
  role: 'paramedic' | 'emt' | 'driver' | 'supervisor';
  certification: string;
  experience: number;
}

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'defective';
  lastChecked: Date;
}

export default function AmbulanceTrackingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
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

  // Mock ambulances data
  const mockAmbulances: Ambulance[] = [
    {
      id: 'amb_1',
      vehicleNumber: 'AMB-001',
      status: 'available',
      location: {
        address: 'Station 1 - 123 Fire Station Rd, Downtown',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      crew: [
        { id: 'crew_1', name: 'John Smith', role: 'paramedic', certification: 'NREMT-P', experience: 8 },
        { id: 'crew_2', name: 'Sarah Johnson', role: 'emt', certification: 'NREMT-B', experience: 3 }
      ],
      equipment: [
        { id: 'eq_1', name: 'Defibrillator', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_2', name: 'Oxygen Tank', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_3', name: 'Stretcher', status: 'operational', lastChecked: new Date(Date.now() - 86400000) }
      ],
      maintenance: {
        lastService: new Date(Date.now() - 2592000000), // 30 days ago
        nextService: new Date(Date.now() + 2592000000), // 30 days from now
        mileage: 45230,
        fuelLevel: 85
      },
      shift: {
        startTime: new Date(Date.now() - 28800000), // 8 hours ago
        endTime: new Date(Date.now() + 28800000), // 8 hours from now
        supervisor: 'Captain Mike Wilson'
      }
    },
    {
      id: 'amb_2',
      vehicleNumber: 'AMB-002',
      status: 'dispatched',
      location: {
        address: 'En route to 456 Oak Avenue',
        coordinates: { lat: 37.7849, lng: -122.4094 }
      },
      crew: [
        { id: 'crew_3', name: 'Mike Wilson', role: 'paramedic', certification: 'NREMT-P', experience: 12 },
        { id: 'crew_4', name: 'Lisa Brown', role: 'emt', certification: 'NREMT-B', experience: 5 }
      ],
      currentCall: {
        id: 'call_1',
        type: 'Cardiac Emergency',
        priority: 'Critical',
        destination: '456 Oak Avenue',
        eta: 8
      },
      equipment: [
        { id: 'eq_4', name: 'Defibrillator', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_5', name: 'Oxygen Tank', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_6', name: 'Stretcher', status: 'operational', lastChecked: new Date(Date.now() - 86400000) }
      ],
      maintenance: {
        lastService: new Date(Date.now() - 1296000000), // 15 days ago
        nextService: new Date(Date.now() + 3888000000), // 45 days from now
        mileage: 38750,
        fuelLevel: 72
      },
      shift: {
        startTime: new Date(Date.now() - 21600000), // 6 hours ago
        endTime: new Date(Date.now() + 36000000), // 10 hours from now
        supervisor: 'Captain Mike Wilson'
      }
    },
    {
      id: 'amb_3',
      vehicleNumber: 'AMB-003',
      status: 'on-scene',
      location: {
        address: '789 Pine Street - Motor Vehicle Accident',
        coordinates: { lat: 37.7649, lng: -122.4294 }
      },
      crew: [
        { id: 'crew_5', name: 'David Lee', role: 'paramedic', certification: 'NREMT-P', experience: 6 },
        { id: 'crew_6', name: 'Emma Davis', role: 'emt', certification: 'NREMT-B', experience: 4 }
      ],
      currentCall: {
        id: 'call_2',
        type: 'Trauma',
        priority: 'High',
        destination: '789 Pine Street'
      },
      equipment: [
        { id: 'eq_7', name: 'Defibrillator', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_8', name: 'Oxygen Tank', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_9', name: 'Stretcher', status: 'maintenance', lastChecked: new Date(Date.now() - 172800000) }
      ],
      maintenance: {
        lastService: new Date(Date.now() - 3888000000), // 45 days ago
        nextService: new Date(Date.now() + 1296000000), // 15 days from now
        mileage: 52100,
        fuelLevel: 45
      },
      shift: {
        startTime: new Date(Date.now() - 25200000), // 7 hours ago
        endTime: new Date(Date.now() + 32400000), // 9 hours from now
        supervisor: 'Captain Sarah Thompson'
      }
    },
    {
      id: 'amb_4',
      vehicleNumber: 'AMB-004',
      status: 'transporting',
      location: {
        address: 'En route to General Hospital',
        coordinates: { lat: 37.7549, lng: -122.4394 }
      },
      crew: [
        { id: 'crew_7', name: 'Robert Taylor', role: 'paramedic', certification: 'NREMT-P', experience: 10 },
        { id: 'crew_8', name: 'Jennifer White', role: 'emt', certification: 'NREMT-B', experience: 7 }
      ],
      currentCall: {
        id: 'call_3',
        type: 'Medical Emergency',
        priority: 'Medium',
        destination: 'General Hospital',
        eta: 12
      },
      equipment: [
        { id: 'eq_10', name: 'Defibrillator', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_11', name: 'Oxygen Tank', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_12', name: 'Stretcher', status: 'operational', lastChecked: new Date(Date.now() - 86400000) }
      ],
      maintenance: {
        lastService: new Date(Date.now() - 1728000000), // 20 days ago
        nextService: new Date(Date.now() + 2592000000), // 30 days from now
        mileage: 41890,
        fuelLevel: 68
      },
      shift: {
        startTime: new Date(Date.now() - 32400000), // 9 hours ago
        endTime: new Date(Date.now() + 25200000), // 7 hours from now
        supervisor: 'Captain Sarah Thompson'
      }
    },
    {
      id: 'amb_5',
      vehicleNumber: 'AMB-005',
      status: 'maintenance',
      location: {
        address: 'Maintenance Facility - 999 Service Center Dr',
        coordinates: { lat: 37.7449, lng: -122.4494 }
      },
      crew: [],
      equipment: [
        { id: 'eq_13', name: 'Defibrillator', status: 'maintenance', lastChecked: new Date(Date.now() - 259200000) },
        { id: 'eq_14', name: 'Oxygen Tank', status: 'operational', lastChecked: new Date(Date.now() - 86400000) },
        { id: 'eq_15', name: 'Stretcher', status: 'defective', lastChecked: new Date(Date.now() - 259200000) }
      ],
      maintenance: {
        lastService: new Date(Date.now() - 86400000), // 1 day ago
        nextService: new Date(Date.now() + 5184000000), // 60 days from now
        mileage: 67450,
        fuelLevel: 95
      },
      shift: {
        startTime: new Date(),
        endTime: new Date(),
        supervisor: 'Maintenance Team'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'dispatched':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'on-scene':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'transporting':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'at-hospital':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'out-of-service':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'defective':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level >= 70) return 'text-green-600';
    if (level >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAmbulances = mockAmbulances.filter(ambulance => {
    const matchesSearch = 
      ambulance.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ambulance.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ambulance.crew.some(member => member.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || ambulance.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const AmbulanceCard = ({ ambulance }: { ambulance: Ambulance }) => (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => setSelectedAmbulance(ambulance)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{ambulance.vehicleNumber}</h3>
              <p className="text-sm text-gray-600">Mileage: {ambulance.maintenance.mileage.toLocaleString()}</p>
            </div>
          </div>
          <Badge className={getStatusColor(ambulance.status)}>
            {ambulance.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{ambulance.location.address}</span>
          </div>
          
          {ambulance.currentCall && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-red-800">{ambulance.currentCall.type}</span>
                <Badge className="bg-red-500 text-white text-xs">
                  {ambulance.currentCall.priority}
                </Badge>
              </div>
              <div className="text-xs text-red-700">
                Destination: {ambulance.currentCall.destination}
                {ambulance.currentCall.eta && (
                  <span className="ml-2">• ETA: {ambulance.currentCall.eta} min</span>
                )}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{ambulance.crew.length} crew members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-gray-400" />
              <span className={getFuelLevelColor(ambulance.maintenance.fuelLevel)}>
                {ambulance.maintenance.fuelLevel}% fuel
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-gray-500">
              Supervisor: {ambulance.shift.supervisor}
            </span>
            <div className="flex space-x-1">
              <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                <Navigation className="w-3 h-3 mr-1" />
                Track
              </Button>
              <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                <Radio className="w-3 h-3 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                Ambulance Fleet Tracking
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage ambulance fleet operations in real-time
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Live Map View
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Ambulance
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Fleet</p>
                    <p className="text-2xl font-bold text-gray-900">{mockAmbulances.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mockAmbulances.filter(amb => amb.status === 'available').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">On Call</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {mockAmbulances.filter(amb => ['dispatched', 'on-scene', 'transporting'].includes(amb.status)).length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Radio className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {mockAmbulances.filter(amb => amb.status === 'maintenance').length}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Wrench className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                    <p className="text-2xl font-bold text-purple-600">6.2 min</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by vehicle number, location, or crew..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="on-scene">On Scene</option>
                    <option value="transporting">Transporting</option>
                    <option value="at-hospital">At Hospital</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-service">Out of Service</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ambulance List */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                {filteredAmbulances.map((ambulance) => (
                  <AmbulanceCard key={ambulance.id} ambulance={ambulance} />
                ))}
              </div>
            </div>

            {/* Selected Ambulance Details */}
            <div className="space-y-6">
              {selectedAmbulance ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{selectedAmbulance.vehicleNumber} Details</span>
                        <Button variant="outline" size="sm" onClick={() => setSelectedAmbulance(null)}>
                          <span className="w-4 h-4">X</span> 
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                        <Badge className={getStatusColor(selectedAmbulance.status)}>
                          {selectedAmbulance.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                        <p className="text-sm text-gray-600">{selectedAmbulance.location.address}</p>
                      </div>
                      
                      {selectedAmbulance.currentCall && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Current Call</h4>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-red-800">{selectedAmbulance.currentCall.type}</span>
                              <Badge className="bg-red-500 text-white text-xs">
                                {selectedAmbulance.currentCall.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-red-700">
                              Destination: {selectedAmbulance.currentCall.destination}
                            </p>
                            {selectedAmbulance.currentCall.eta && (
                              <p className="text-xs text-red-700">
                                ETA: {selectedAmbulance.currentCall.eta} minutes
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Crew ({selectedAmbulance.crew.length})</h4>
                        <div className="space-y-2">
                          {selectedAmbulance.crew.map((member) => (
                            <div key={member.id} className="flex items-center justify-between text-sm">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-gray-500">{member.role} • {member.certification}</p>
                              </div>
                              <span className="text-gray-500">{member.experience}y exp</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Vehicle Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Mileage:</span>
                            <span>{selectedAmbulance.maintenance.mileage.toLocaleString()} miles</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Fuel Level:</span>
                            <span className={getFuelLevelColor(selectedAmbulance.maintenance.fuelLevel)}>
                              {selectedAmbulance.maintenance.fuelLevel}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Service:</span>
                            <span>{selectedAmbulance.maintenance.lastService.toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Next Service:</span>
                            <span>{selectedAmbulance.maintenance.nextService.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Equipment Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedAmbulance.equipment.map((equipment) => (
                          <div key={equipment.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{equipment.name}</span>
                            <Badge className={getEquipmentStatusColor(equipment.status)}>
                              {equipment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select an Ambulance
                    </h3>
                    <p className="text-gray-600">
                      Click on an ambulance card to view detailed information.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}