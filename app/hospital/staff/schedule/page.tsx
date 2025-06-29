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
  Calendar, 
  Clock, 
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StaffSchedule {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  shifts: Shift[];
  totalHours: number;
  status: 'active' | 'on-leave' | 'sick' | 'vacation';
}

interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'regular' | 'overtime' | 'on-call' | 'emergency';
  location: string;
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
}

export default function StaffSchedulePage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [currentWeek, setCurrentWeek] = useState(new Date());
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

  // Mock staff schedule data
  const mockSchedules: StaffSchedule[] = [
    {
      id: 'schedule_1',
      staffId: 'staff_1',
      staffName: 'Dr. Sarah Wilson',
      role: 'Cardiologist',
      department: 'Cardiology',
      totalHours: 40,
      status: 'active',
      shifts: [
        {
          id: 'shift_1',
          date: new Date(),
          startTime: '08:00',
          endTime: '16:00',
          type: 'regular',
          location: 'Cardiology Wing',
          status: 'scheduled'
        },
        {
          id: 'shift_2',
          date: new Date(Date.now() + 86400000),
          startTime: '08:00',
          endTime: '16:00',
          type: 'regular',
          location: 'Cardiology Wing',
          status: 'scheduled'
        }
      ]
    },
    {
      id: 'schedule_2',
      staffId: 'staff_2',
      staffName: 'Nurse Jennifer Martinez',
      role: 'Registered Nurse',
      department: 'Emergency',
      totalHours: 36,
      status: 'active',
      shifts: [
        {
          id: 'shift_3',
          date: new Date(),
          startTime: '12:00',
          endTime: '20:00',
          type: 'regular',
          location: 'Emergency Department',
          status: 'scheduled'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-leave':
        return 'bg-blue-100 text-blue-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'vacation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'regular':
        return 'bg-blue-100 text-blue-800';
      case 'overtime':
        return 'bg-orange-100 text-orange-800';
      case 'on-call':
        return 'bg-purple-100 text-purple-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSchedules = mockSchedules.filter(schedule => {
    const matchesSearch = schedule.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         schedule.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || schedule.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentWeek(newDate);
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

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
                Staff Schedule Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage staff schedules and shift assignments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Export Schedule
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Shift
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search staff by name or role..."
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
                    <option value="Emergency">Emergency</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Week Navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Weekly Schedule</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium px-4">
                    {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Header */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="p-2 text-sm font-medium text-gray-600">Staff</div>
                {weekDates.map((date, index) => (
                  <div key={index} className="p-2 text-center text-sm font-medium text-gray-600 border-b">
                    <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</div>
                    <div className="text-xs text-gray-500">{date.getDate()}</div>
                  </div>
                ))}
              </div>

              {/* Schedule Grid */}
              <div className="space-y-2">
                {filteredSchedules.map((schedule) => (
                  <div key={schedule.id} className="grid grid-cols-8 gap-2 items-center border rounded-lg p-2 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{schedule.staffName}</p>
                        <p className="text-xs text-gray-500">{schedule.role}</p>
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {weekDates.map((date, dayIndex) => {
                      const dayShifts = schedule.shifts.filter(shift => 
                        shift.date.toDateString() === date.toDateString()
                      );
                      
                      return (
                        <div key={dayIndex} className="min-h-16 p-1">
                          {dayShifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={`text-xs p-2 rounded mb-1 ${getShiftTypeColor(shift.type)}`}
                            >
                              <div className="font-medium">{shift.startTime} - {shift.endTime}</div>
                              <div className="text-xs opacity-75">{shift.location}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff List */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Overview</CardTitle>
              <CardDescription>
                Current staff status and schedule summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{schedule.staffName}</h3>
                        <p className="text-sm text-gray-600">{schedule.role} • {schedule.department}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status === 'active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                            {schedule.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {schedule.totalHours}h/week
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}