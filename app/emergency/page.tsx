'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, useAppStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Activity,
  Truck,
  Shield,
  Heart,
  Zap,
  Users,
  Navigation
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EmergencyAlert, EmergencyStatus } from '@/types';

export default function EmergencyPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { emergencyAlerts, addEmergencyAlert, updateEmergencyAlert } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const triggerEmergency = async () => {
    console.log('🚨 Emergency: Triggering SOS alert');
    setIsEmergencyActive(true);

    const newAlert: EmergencyAlert = {
      id: `emergency_${Date.now()}`,
      patientId: user.id,
      type: 'medical',
      severity: 'critical',
      location: {
        latitude: currentLocation?.lat || 37.7749,
        longitude: currentLocation?.lng || -122.4194,
        address: '123 Main St, San Francisco, CA 94102'
      },
      timestamp: new Date(),
      status: 'active',
      description: 'Emergency SOS triggered by patient',
      respondersNotified: ['emergency_dispatch', 'nearest_hospital'],
    };

    addEmergencyAlert(newAlert);

    // Simulate emergency response workflow
    setTimeout(() => {
      updateEmergencyAlert(newAlert.id, { 
        status: 'dispatched',
        respondersNotified: [...newAlert.respondersNotified, 'ambulance_unit_1']
      });
    }, 3000);

    setTimeout(() => {
      updateEmergencyAlert(newAlert.id, { status: 'on-scene' });
    }, 8000);
  };

  const cancelEmergency = () => {
    console.log('❌ Emergency: Cancelling SOS alert');
    setIsEmergencyActive(false);
    
    const activeAlert = emergencyAlerts.find(alert => alert.status === 'active' || alert.status === 'dispatched');
    if (activeAlert) {
      updateEmergencyAlert(activeAlert.id, { status: 'cancelled' });
    }
  };

  const getStatusColor = (status: EmergencyStatus) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'dispatched':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-scene':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: EmergencyStatus) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4" />;
      case 'dispatched':
        return <Truck className="w-4 h-4" />;
      case 'on-scene':
        return <Activity className="w-4 h-4" />;
      case 'resolved':
        return <Shield className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const activeAlert = emergencyAlerts.find(alert => 
    alert.status === 'active' || alert.status === 'dispatched' || alert.status === 'on-scene'
  );

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', type: 'emergency' },
    { name: 'Hospital Emergency', number: '(555) 123-4567', type: 'hospital' },
    { name: 'Poison Control', number: '1-800-222-1222', type: 'poison' },
    { name: 'Mental Health Crisis', number: '988', type: 'mental' },
  ];

  const emergencyTypes = [
    { 
      type: 'medical', 
      title: 'Medical Emergency', 
      description: 'Heart attack, stroke, severe injury',
      icon: Heart,
      color: 'text-red-600'
    },
    { 
      type: 'trauma', 
      title: 'Trauma/Accident', 
      description: 'Car accident, fall, severe injury',
      icon: Zap,
      color: 'text-orange-600'
    },
    { 
      type: 'cardiac', 
      title: 'Cardiac Emergency', 
      description: 'Chest pain, heart attack symptoms',
      icon: Heart,
      color: 'text-red-600'
    },
    { 
      type: 'respiratory', 
      title: 'Breathing Problems', 
      description: 'Difficulty breathing, choking',
      icon: Activity,
      color: 'text-blue-600'
    },
  ];

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
                Emergency Services
              </h1>
              <p className="text-gray-600 mt-1">
                Quick access to emergency services and SOS alerts
              </p>
            </div>
          </div>

          {/* Active Emergency Alert */}
          {activeAlert && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Emergency Alert Active:</strong> {activeAlert.description}
                    <br />
                    <span className="text-sm">Status: {activeAlert.status} • {activeAlert.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={cancelEmergency}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Cancel Alert
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SOS Button */}
            <div className="lg:col-span-2">
              <Card className="border-red-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-red-600 flex items-center justify-center space-x-2">
                    <Phone className="w-6 h-6" />
                    <span>Emergency SOS</span>
                  </CardTitle>
                  <CardDescription>
                    Press and hold the button below to trigger an emergency alert
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      className={`w-32 h-32 rounded-full text-xl font-bold ${
                        isEmergencyActive 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'emergency-button animate-pulse-medical'
                      }`}
                      onClick={triggerEmergency}
                      disabled={isEmergencyActive || !!activeAlert}
                    >
                      {isEmergencyActive ? (
                        <div className="flex flex-col items-center">
                          <Activity className="w-8 h-8 mb-2 animate-spin" />
                          <span className="text-sm">ACTIVE</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Phone className="w-8 h-8 mb-2" />
                          <span className="text-sm">SOS</span>
                        </div>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>This will immediately:</p>
                    <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                      <li>Alert emergency services with your location</li>
                      <li>Notify your emergency contacts</li>
                      <li>Dispatch the nearest ambulance</li>
                      <li>Send your medical information to responders</li>
                    </ul>
                  </div>

                  {currentLocation && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-center space-x-2 text-blue-700">
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm font-medium">Location Services Active</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Your current location will be shared with emergency responders
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emergency Types */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Emergency Types</CardTitle>
                  <CardDescription>
                    Quick access to specific emergency protocols
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {emergencyTypes.map((emergency) => {
                      const Icon = emergency.icon;
                      return (
                        <Button
                          key={emergency.type}
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200"
                          disabled={!!activeAlert}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-5 h-5 ${emergency.color}`} />
                            <span className="font-medium">{emergency.title}</span>
                          </div>
                          <p className="text-xs text-gray-500 text-left">
                            {emergency.description}
                          </p>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Contacts & Recent Alerts */}
            <div className="space-y-6">
              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.number}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Emergency Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Recent Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {emergencyAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {emergencyAlerts.slice(0, 5).map((alert) => (
                        <div key={alert.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getStatusColor(alert.status)}>
                              {getStatusIcon(alert.status)}
                              <span className="ml-1">{alert.status}</span>
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {alert.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{alert.description}</p>
                          <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location.address}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No recent emergency alerts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}