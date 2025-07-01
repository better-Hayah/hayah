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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download,
  Filter,
  Calendar,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Stethoscope,
  Heart,
  TestTube,
  Pill,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClinicalMetrics {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageWaitTime: number;
  patientSatisfaction: number;
  readmissionRate: number;
  mortalityRate: number;
}

interface DepartmentStats {
  department: string;
  patientCount: number;
  appointmentCount: number;
  averageStay: number;
  satisfaction: number;
}

interface DiagnosisData {
  diagnosis: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export default function ClinicalReportsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 2592000000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const router = useRouter();

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

  // Mock clinical data
  const clinicalMetrics: ClinicalMetrics = {
    totalPatients: 2847,
    totalAppointments: 4521,
    completedAppointments: 4267,
    cancelledAppointments: 254,
    averageWaitTime: 18.5,
    patientSatisfaction: 4.6,
    readmissionRate: 8.2,
    mortalityRate: 1.4
  };

  const departmentStats: DepartmentStats[] = [
    { department: 'Emergency', patientCount: 856, appointmentCount: 1245, averageStay: 4.2, satisfaction: 4.3 },
    { department: 'Cardiology', patientCount: 569, appointmentCount: 892, averageStay: 2.8, satisfaction: 4.7 },
    { department: 'Surgery', patientCount: 483, appointmentCount: 567, averageStay: 5.6, satisfaction: 4.5 },
    { department: 'Radiology', patientCount: 341, appointmentCount: 1234, averageStay: 1.2, satisfaction: 4.4 },
    { department: 'Laboratory', patientCount: 284, appointmentCount: 2156, averageStay: 0.5, satisfaction: 4.2 },
    { department: 'Pediatrics', patientCount: 314, appointmentCount: 427, averageStay: 3.1, satisfaction: 4.8 }
  ];

  const topDiagnoses: DiagnosisData[] = [
    { diagnosis: 'Hypertension', count: 342, percentage: 12.0, trend: 'up' },
    { diagnosis: 'Type 2 Diabetes', count: 298, percentage: 10.5, trend: 'stable' },
    { diagnosis: 'Coronary Artery Disease', count: 256, percentage: 9.0, trend: 'down' },
    { diagnosis: 'Pneumonia', count: 189, percentage: 6.6, trend: 'up' },
    { diagnosis: 'Chronic Kidney Disease', count: 167, percentage: 5.9, trend: 'stable' },
    { diagnosis: 'Depression', count: 145, percentage: 5.1, trend: 'up' },
    { diagnosis: 'Asthma', count: 134, percentage: 4.7, trend: 'stable' },
    { diagnosis: 'Osteoarthritis', count: 123, percentage: 4.3, trend: 'down' }
  ];

  const monthlyTrends = [
    { month: 'Jan', patients: 245, appointments: 389, satisfaction: 4.4 },
    { month: 'Feb', patients: 268, appointments: 412, satisfaction: 4.5 },
    { month: 'Mar', patients: 289, appointments: 445, satisfaction: 4.3 },
    { month: 'Apr', patients: 312, appointments: 478, satisfaction: 4.6 },
    { month: 'May', patients: 298, appointments: 456, satisfaction: 4.7 },
    { month: 'Jun', patients: 334, appointments: 501, satisfaction: 4.5 }
  ];

  const handleExportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
    alert(`${reportType} report export would be implemented here`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

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
                Clinical Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive clinical performance metrics and patient care analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All Reports
              </Button>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Generate Custom Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <select
                      id="department"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Departments</option>
                      <option value="emergency">Emergency</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="surgery">Surgery</option>
                      <option value="radiology">Radiology</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="pediatrics">Pediatrics</option>
                    </select>
                  </div>
                </div>
                <Button>
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Clinical Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-blue-600">{clinicalMetrics.totalPatients.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+8.2%</span>
                    </div>
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
                    <p className="text-sm text-gray-600">Patient Satisfaction</p>
                    <p className="text-2xl font-bold text-green-600">{clinicalMetrics.patientSatisfaction}/5.0</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+0.3</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Wait Time</p>
                    <p className="text-2xl font-bold text-orange-600">{clinicalMetrics.averageWaitTime} min</p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">-2.1 min</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Readmission Rate</p>
                    <p className="text-2xl font-bold text-red-600">{clinicalMetrics.readmissionRate}%</p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">-1.2%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Appointment Completion Rate</span>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport('Appointment Completion')}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {((clinicalMetrics.completedAppointments / clinicalMetrics.totalAppointments) * 100).toFixed(1)}%
                        </div>
                        <p className="text-gray-600">
                          {clinicalMetrics.completedAppointments.toLocaleString()} of {clinicalMetrics.totalAppointments.toLocaleString()} appointments completed
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completed</span>
                          <span>{clinicalMetrics.completedAppointments.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(clinicalMetrics.completedAppointments / clinicalMetrics.totalAppointments) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Cancelled</span>
                          <span>{clinicalMetrics.cancelledAppointments.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${(clinicalMetrics.cancelledAppointments / clinicalMetrics.totalAppointments) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {clinicalMetrics.patientSatisfaction}/5.0
                          </p>
                          <p className="text-sm text-gray-600">Patient Satisfaction</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">
                            {clinicalMetrics.mortalityRate}%
                          </p>
                          <p className="text-sm text-gray-600">Mortality Rate</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg text-center">
                        <p className="text-3xl font-bold text-orange-600">
                          {clinicalMetrics.readmissionRate}%
                        </p>
                        <p className="text-sm text-gray-600">30-Day Readmission Rate</p>
                        <p className="text-xs text-orange-600 mt-1">
                          Target: &lt;10%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Department Performance</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Department Performance')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentStats.map((dept) => (
                      <div key={dept.department} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{dept.patientCount} patients</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Appointments</p>
                            <p className="font-semibold">{dept.appointmentCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Avg Stay (days)</p>
                            <p className="font-semibold">{dept.averageStay}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Satisfaction</p>
                            <p className="font-semibold text-green-600">{dept.satisfaction}/5.0</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Utilization</p>
                            <p className="font-semibold">{((dept.patientCount / clinicalMetrics.totalPatients) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diagnoses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Top Diagnoses</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Top Diagnoses')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDiagnoses.map((diagnosis, index) => (
                      <div key={diagnosis.diagnosis} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{diagnosis.diagnosis}</p>
                            <p className="text-sm text-gray-500">{diagnosis.count} cases ({diagnosis.percentage}%)</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(diagnosis.trend)}
                          <span className={`text-sm ${getTrendColor(diagnosis.trend)}`}>
                            {diagnosis.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Monthly Trends</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Monthly Trends')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {monthlyTrends.map((month) => (
                      <div key={month.month} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{month.month} 2024</span>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {month.patients} patients • {month.appointments} appointments
                            </div>
                            <div className="text-sm font-semibold text-green-600">
                              Satisfaction: {month.satisfaction}/5.0
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(month.patients / 350) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}