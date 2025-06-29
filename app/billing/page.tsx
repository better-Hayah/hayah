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
import { 
  CreditCard, 
  Search, 
  Filter,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Bill, PaymentStatus } from '@/types';

export default function BillingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'all'>('all');
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

  // Mock billing data
  const mockBills: Bill[] = [
    {
      id: 'bill_1',
      patientId: 'patient_1',
      hospitalId: 'hospital_1',
      billNumber: 'INV-2024-001',
      items: [
        {
          id: 'item_1',
          description: 'Consultation - Cardiology',
          code: '99213',
          quantity: 1,
          unitPrice: 250.00,
          totalPrice: 250.00,
          category: 'consultation'
        },
        {
          id: 'item_2',
          description: 'ECG Test',
          code: '93000',
          quantity: 1,
          unitPrice: 150.00,
          totalPrice: 150.00,
          category: 'test'
        }
      ],
      totalAmount: 400.00,
      paidAmount: 400.00,
      balanceAmount: 0.00,
      status: 'paid',
      issueDate: new Date(Date.now() - 2592000000), // 30 days ago
      dueDate: new Date(Date.now() - 2332800000), // 27 days ago
      payments: [
        {
          id: 'pay_1',
          billId: 'bill_1',
          amount: 400.00,
          method: 'card',
          status: 'completed',
          transactionDate: new Date(Date.now() - 2332800000),
          transactionId: 'txn_abc123',
          processedBy: 'system'
        }
      ],
      insuranceClaims: []
    },
    {
      id: 'bill_2',
      patientId: 'patient_1',
      hospitalId: 'hospital_1',
      billNumber: 'INV-2024-002',
      items: [
        {
          id: 'item_3',
          description: 'Video Consultation',
          code: '99214',
          quantity: 1,
          unitPrice: 180.00,
          totalPrice: 180.00,
          category: 'consultation'
        },
        {
          id: 'item_4',
          description: 'Prescription Fee',
          code: 'PRESC001',
          quantity: 1,
          unitPrice: 25.00,
          totalPrice: 25.00,
          category: 'medication'
        }
      ],
      totalAmount: 205.00,
      paidAmount: 0.00,
      balanceAmount: 205.00,
      status: 'pending',
      issueDate: new Date(Date.now() - 604800000), // 7 days ago
      dueDate: new Date(Date.now() + 2332800000), // 27 days from now
      payments: [],
      insuranceClaims: []
    },
    {
      id: 'bill_3',
      patientId: 'patient_1',
      hospitalId: 'hospital_1',
      billNumber: 'INV-2024-003',
      items: [
        {
          id: 'item_5',
          description: 'Emergency Room Visit',
          code: '99284',
          quantity: 1,
          unitPrice: 850.00,
          totalPrice: 850.00,
          category: 'consultation'
        },
        {
          id: 'item_6',
          description: 'X-Ray Chest',
          code: '71020',
          quantity: 1,
          unitPrice: 200.00,
          totalPrice: 200.00,
          category: 'test'
        }
      ],
      totalAmount: 1050.00,
      paidAmount: 525.00,
      balanceAmount: 525.00,
      status: 'partial',
      issueDate: new Date(Date.now() - 1209600000), // 14 days ago
      dueDate: new Date(Date.now() + 1728000000), // 20 days from now
      payments: [
        {
          id: 'pay_2',
          billId: 'bill_3',
          amount: 525.00,
          method: 'insurance',
          status: 'completed',
          transactionDate: new Date(Date.now() - 864000000),
          processedBy: 'insurance_provider'
        }
      ],
      insuranceClaims: []
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'partial':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    }
  };

  const handlePayBill = (billId: string) => {
    console.log('Processing payment for bill:', billId);
    router.push('/billing/payments');
  };

  const handleDownloadBill = (billId: string) => {
    console.log('Downloading bill:', billId);
    alert('Bill download would be implemented here');
  };

  const filteredBills = mockBills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bill.items.some(item => item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || bill.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingBills = filteredBills.filter(bill => bill.status === 'pending' || bill.status === 'partial' || bill.status === 'overdue');
  const paidBills = filteredBills.filter(bill => bill.status === 'paid');

  const BillCard = ({ bill }: { bill: Bill }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                {bill.billNumber}
              </h3>
              <Badge className={getStatusColor(bill.status)}>
                {getStatusIcon(bill.status)}
                <span className="ml-1">{bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}</span>
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              {bill.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.description}</span>
                  <span>${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              {bill.items.length > 2 && (
                <div className="text-gray-500">
                  +{bill.items.length - 2} more items
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Issued: {bill.issueDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Due: {bill.dueDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Total: ${bill.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Balance: ${bill.balanceAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            {bill.balanceAmount > 0 && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handlePayBill(bill.id)}
              >
                <CreditCard className="w-4 h-4 mr-1" />
                Pay Now
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownloadBill(bill.id)}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const totalBalance = mockBills.reduce((sum, bill) => sum + bill.balanceAmount, 0);

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
                Billing & Finance
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your medical bills and payment history
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600">${totalBalance.toFixed(2)}</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Outstanding</p>
                    <p className="text-2xl font-bold text-red-600">${totalBalance.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Paid This Year</p>
                    <p className="text-2xl font-bold text-green-600">$925.00</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Bills</p>
                    <p className="text-2xl font-bold text-orange-600">{pendingBills.length}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
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
                    placeholder="Search bills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus | 'all')}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bills Tabs */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="pending">Outstanding ({pendingBills.length})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({paidBills.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingBills.length > 0 ? (
                pendingBills.map((bill) => (
                  <BillCard key={bill.id} bill={bill} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      All bills are paid!
                    </h3>
                    <p className="text-gray-600">
                      You have no outstanding bills at the moment.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="paid" className="space-y-4">
              {paidBills.length > 0 ? (
                paidBills.map((bill) => (
                  <BillCard key={bill.id} bill={bill} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No payment history
                    </h3>
                    <p className="text-gray-600">
                      Your payment history will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}