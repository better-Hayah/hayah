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
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
  FileText,
  PieChart,
  Activity,
  CreditCard,
  Users,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  outstandingBalance: number;
  collectionRate: number;
  averagePaymentTime: number;
  monthlyTrend: number;
}

interface RevenueByDepartment {
  department: string;
  revenue: number;
  percentage: number;
}

interface PaymentMethodStats {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export default function FinancialReportsPage() {
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
    if (user.role !== 'admin' && user.role !== 'accountant') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'accountant')) {
    return null;
  }

  // Mock financial data
  const financialMetrics: FinancialMetrics = {
    totalRevenue: 2847650.00,
    totalExpenses: 1923400.00,
    netIncome: 924250.00,
    outstandingBalance: 156780.00,
    collectionRate: 94.5,
    averagePaymentTime: 18.5,
    monthlyTrend: 12.3
  };

  const revenueByDepartment: RevenueByDepartment[] = [
    { department: 'Emergency', revenue: 856295.00, percentage: 30.1 },
    { department: 'Cardiology', revenue: 569530.00, percentage: 20.0 },
    { department: 'Surgery', revenue: 483918.00, percentage: 17.0 },
    { department: 'Radiology', revenue: 341088.00, percentage: 12.0 },
    { department: 'Laboratory', revenue: 284765.00, percentage: 10.0 },
    { department: 'Pharmacy', revenue: 199383.00, percentage: 7.0 },
    { department: 'Other', revenue: 112671.00, percentage: 3.9 }
  ];

  const paymentMethodStats: PaymentMethodStats[] = [
    { method: 'Insurance', amount: 1708590.00, count: 1245, percentage: 60.0 },
    { method: 'Credit Card', amount: 569530.00, count: 892, percentage: 20.0 },
    { method: 'Cash', amount: 341118.00, count: 567, percentage: 12.0 },
    { method: 'Bank Transfer', amount: 227412.00, count: 234, percentage: 8.0 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 245000, expenses: 180000 },
    { month: 'Feb', revenue: 268000, expenses: 185000 },
    { month: 'Mar', revenue: 289000, expenses: 195000 },
    { month: 'Apr', revenue: 312000, expenses: 205000 },
    { month: 'May', revenue: 298000, expenses: 198000 },
    { month: 'Jun', revenue: 334000, expenses: 215000 },
    { month: 'Jul', revenue: 356000, expenses: 225000 },
    { month: 'Aug', revenue: 342000, expenses: 220000 },
    { month: 'Sep', revenue: 378000, expenses: 235000 },
    { month: 'Oct', revenue: 395000, expenses: 245000 },
    { month: 'Nov', revenue: 412000, expenses: 255000 },
    { month: 'Dec', revenue: 428000, expenses: 260000 }
  ];

  const handleExportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
    alert(`${reportType} report export would be implemented here`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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
                Financial Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive financial reporting and business intelligence
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
                      <option value="pharmacy">Pharmacy</option>
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

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(financialMetrics.totalRevenue)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+{formatPercentage(financialMetrics.monthlyTrend)}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Net Income</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(financialMetrics.netIncome)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm text-blue-600">+8.5%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Collection Rate</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatPercentage(financialMetrics.collectionRate)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-sm text-purple-600">+2.1%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Outstanding</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(financialMetrics.outstandingBalance)}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="w-4 h-4 text-orange-600 mr-1" />
                      <span className="text-sm text-orange-600">-5.2%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports Tabs */}
          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
              <TabsTrigger value="departments">By Department</TabsTrigger>
              <TabsTrigger value="payments">Payment Methods</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Monthly Revenue vs Expenses</span>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport('Monthly Revenue')}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {monthlyRevenue.slice(-6).map((month) => (
                        <div key={month.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{month.month}</span>
                            <span>{formatCurrency(month.revenue)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(month.revenue / 450000) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Expenses: {formatCurrency(month.expenses)}</span>
                            <span>Net: {formatCurrency(month.revenue - month.expenses)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(financialMetrics.totalRevenue)}
                          </p>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(financialMetrics.totalExpenses)}
                          </p>
                          <p className="text-sm text-gray-600">Total Expenses</p>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {formatCurrency(financialMetrics.netIncome)}
                        </p>
                        <p className="text-sm text-gray-600">Net Income</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Profit Margin: {formatPercentage((financialMetrics.netIncome / financialMetrics.totalRevenue) * 100)}
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
                    <span>Revenue by Department</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Department Revenue')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueByDepartment.map((dept) => (
                      <div key={dept.department} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{dept.department}</span>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(dept.revenue)}</div>
                            <div className="text-sm text-gray-500">{formatPercentage(dept.percentage)}</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Payment Methods</span>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport('Payment Methods')}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethodStats.map((method) => (
                        <div key={method.method} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{method.method}</span>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(method.amount)}</div>
                              <div className="text-sm text-gray-500">{method.count} transactions</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${method.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">
                          {financialMetrics.averagePaymentTime}
                        </p>
                        <p className="text-sm text-gray-600">Average Payment Time (days)</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Collection Rate</span>
                          <span className="font-semibold">{formatPercentage(financialMetrics.collectionRate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Outstanding Balance</span>
                          <span className="font-semibold text-orange-600">
                            {formatCurrency(financialMetrics.outstandingBalance)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bad Debt Rate</span>
                          <span className="font-semibold text-red-600">2.1%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Financial Trends & Projections</span>
                    <Button variant="outline" size="sm" onClick={() => handleExportReport('Financial Trends')}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">+12.3%</p>
                      <p className="text-sm text-gray-600">Revenue Growth (YoY)</p>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">+8.7%</p>
                      <p className="text-sm text-gray-600">Patient Volume Growth</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">32.4%</p>
                      <p className="text-sm text-gray-600">Profit Margin</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Revenue has grown consistently over the past 12 months</li>
                      <li>• Emergency department generates the highest revenue (30.1%)</li>
                      <li>• Insurance payments account for 60% of total revenue</li>
                      <li>• Collection rate has improved by 2.1% this quarter</li>
                      <li>• Average payment time has decreased to 18.5 days</li>
                    </ul>
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