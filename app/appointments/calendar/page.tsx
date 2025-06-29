'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  User,
  Video,
  Phone,
  Filter,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Appointment, AppointmentStatus } from '@/types';
import { Input } from '@/components/ui/input';

export default function AppointmentsCalendarPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Mock appointments data for calendar
  const mockAppointments: Appointment[] = [
    {
      id: 'apt_1',
      patientId: 'patient_1',
      doctorId: 'doctor_1',
      hospitalId: 'hospital_1',
      type: 'in-person',
      status: 'scheduled',
      scheduledTime: new Date(2024, 11, 15, 9, 0), // Dec 15, 2024, 9:00 AM
      duration: 30,
      reason: 'Annual checkup',
      chiefComplaint: 'Routine physical examination',
      roomNumber: 'Room 205',
      followUpRequired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'apt_2',
      patientId: 'patient_2',
      doctorId: 'doctor_1',
      hospitalId: 'hospital_1',
      type: 'video',
      status: 'scheduled',
      scheduledTime: new Date(2024, 11, 15, 14, 30), // Dec 15, 2024, 2:30 PM
      duration: 45,
      reason: 'Follow-up consultation',
      chiefComplaint: 'Blood pressure monitoring',
      followUpRequired: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'apt_3',
      patientId: 'patient_3',
      doctorId: 'doctor_1',
      hospitalId: 'hospital_1',
      type: 'phone',
      status: 'scheduled',
      scheduledTime: new Date(2024, 11, 16, 10, 15), // Dec 16, 2024, 10:15 AM
      duration: 20,
      reason: 'Prescription review',
      chiefComplaint: 'Medication adjustment',
      followUpRequired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'apt_4',
      patientId: 'patient_4',
      doctorId: 'doctor_1',
      hospitalId: 'hospital_1',
      type: 'in-person',
      status: 'completed',
      scheduledTime: new Date(2024, 11, 12, 11, 0), // Dec 12, 2024, 11:00 AM
      duration: 60,
      reason: 'Consultation',
      chiefComplaint: 'Chest pain evaluation',
      roomNumber: 'Room 102',
      followUpRequired: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'no-show':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-3 h-3 text-blue-600" />;
      case 'phone':
        return <Phone className="w-3 h-3 text-green-600" />;
      default:
        return <User className="w-3 h-3 text-gray-600" />;
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date: Date) => {
    return mockAppointments.filter(apt => {
      const aptDate = new Date(apt.scheduledTime);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-100"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const appointments = getAppointmentsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 p-1 cursor-pointer hover:bg-blue-50 transition-colors ${
            isToday ? 'bg-blue-100' : ''
          } ${isSelected ? 'bg-blue-200' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {appointments.slice(0, 2).map((apt) => (
              <div
                key={apt.id}
                className="text-xs p-1 rounded bg-blue-500 text-white truncate flex items-center space-x-1"
              >
                {getTypeIcon(apt.type)}
                <span>{apt.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
            {appointments.length > 2 && (
              <div className="text-xs text-gray-500">
                +{appointments.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

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
                Appointment Calendar
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage appointments in calendar format
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Appointment</span>
              </Button>
            </div>
          </div>

          {/* Search and View Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                  >
                    Day
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>
                        {currentDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDate(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-0 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                    {renderCalendarGrid()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Date Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate 
                      ? selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'Select a Date'
                    }
                  </CardTitle>
                  <CardDescription>
                    {selectedDateAppointments.length > 0 
                      ? `${selectedDateAppointments.length} appointment${selectedDateAppointments.length > 1 ? 's' : ''}`
                      : 'No appointments scheduled'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDateAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateAppointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(appointment.type)}
                              <span className="font-medium text-sm">{appointment.reason}</span>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3" />
                              <span>
                                {appointment.scheduledTime.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} ({appointment.duration} min)
                              </span>
                            </div>
                            {appointment.roomNumber && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-3 h-3" />
                                <span>{appointment.roomNumber}</span>
                              </div>
                            )}
                            {user.role === 'doctor' && (
                              <div className="flex items-center space-x-2">
                                <User className="w-3 h-3" />
                                <span>Patient: John Doe</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 flex space-x-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              View Details
                            </Button>
                            {appointment.status === 'scheduled' && (
                              <Button variant="outline" size="sm" className="text-xs">
                                Reschedule
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <div className="text-center py-6">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No appointments on this date</p>
                      <Button size="sm" className="mt-2">
                        <Plus className="w-3 h-3 mr-1" />
                        Schedule Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click on a date to view appointments</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Appointments</span>
                      <span className="font-semibold">{mockAppointments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-semibold text-green-600">
                        {mockAppointments.filter(apt => apt.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scheduled</span>
                      <span className="font-semibold text-blue-600">
                        {mockAppointments.filter(apt => apt.status === 'scheduled').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cancelled</span>
                      <span className="font-semibold text-red-600">
                        {mockAppointments.filter(apt => apt.status === 'cancelled').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}