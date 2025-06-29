'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, Shield, Stethoscope, Users, Pill, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '@/lib/auth';
import { useAuthStore } from '@/lib/store';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 LoginForm: Attempting login for:', formData.email);
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setLoading(true);
    setError('');

    try {
      const { user, token } = await authService.login(formData.email, formData.password);
      console.log('✅ LoginForm: Login successful, setting user');
      setUser(user);
    } catch (error) {
      console.error('❌ LoginForm: Login failed:', error);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const demoUsers = [
    {
      role: 'patient',
      email: 'patient@demo.com',
      icon: Users,
      title: 'Patient Portal',
      description: 'Access appointments, medical records, and billing'
    },
    {
      role: 'doctor',
      email: 'doctor@demo.com',
      icon: Stethoscope,
      title: 'Doctor Dashboard',
      description: 'Manage patients, consultations, and prescriptions'
    },
    {
      role: 'admin',
      email: 'admin@demo.com',
      icon: Shield,
      title: 'Hospital Admin',
      description: 'Oversee operations, staff, and emergency management'
    },
    {
      role: 'pharmacy',
      email: 'pharmacy@demo.com',
      icon: Pill,
      title: 'Pharmacy System',
      description: 'Process prescriptions and manage inventory'
    },
    {
      role: 'accountant',
      email: 'accountant@demo.com',
      icon: Calculator,
      title: 'Financial Portal',
      description: 'Handle billing, payments, and financial reports'
    }
  ];

  const fillDemoCredentials = (email: string) => {
    setFormData({ email, password: 'demo123' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Tabs defaultValue="login" className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-inter font-bold text-gray-900">
                MediCare Hospital System
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive healthcare management platform
              </p>
            </div>
          </div>

          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6">
            <Card className="max-w-md mx-auto">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-center">Sign in</CardTitle>
                <CardDescription>
                  Enter your credentials to access the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Try Demo Accounts
              </h2>
              <p className="text-gray-600 text-sm">
                Explore different user roles with pre-configured demo accounts
              </p>
            </div>

            <div className="grid gap-4 max-w-4xl mx-auto">
              {demoUsers.map((user) => {
                const Icon = user.icon;
                return (
                  <Card 
                    key={user.role} 
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => fillDemoCredentials(user.email)}
                  >
                    <CardContent className="flex items-center p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{user.title}</h3>
                        <p className="text-sm text-gray-600">{user.description}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {user.email} • Password: demo123
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Try Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                All demo accounts use the password: <span className="font-mono font-semibold">demo123</span>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">HIPAA Compliant</h3>
            <p className="text-sm text-gray-600">
              End-to-end encryption and secure data handling
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <Stethoscope className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Telemedicine Ready</h3>
            <p className="text-sm text-gray-600">
              Built-in video consultations and remote care
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Multi-Role Support</h3>
            <p className="text-sm text-gray-600">
              Patients, doctors, admins, pharmacy, and accounting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}