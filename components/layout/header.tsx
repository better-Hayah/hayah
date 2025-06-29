'use client';

import { useState } from 'react';
import { Bell, Menu, Search, User, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useAppStore } from '@/lib/store';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { notifications } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    console.log('🚪 Header: Logging out user');
    try {
      await authService.logout();
      logout();
      router.push('/');
    } catch (error) {
      console.error('❌ Header: Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    console.log('👤 Header: Navigating to profile');
    router.push('/profile');
  };

  const handleSettingsClick = () => {
    console.log('⚙️ Header: Navigating to settings');
    router.push('/settings');
  };

  const handleNotificationsClick = () => {
    console.log('🔔 Header: Opening notifications');
    // For now, just log - could open a notifications panel
    alert('Notifications panel would open here');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('🔍 Header: Searching for:', searchQuery);
      // Navigate to search results or perform search
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      patient: 'bg-blue-100 text-blue-800',
      doctor: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
      pharmacy: 'bg-orange-100 text-orange-800',
      accountant: 'bg-teal-100 text-teal-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: Shield,
      doctor: User,
      patient: User,
      pharmacy: User,
      accountant: User,
    };
    const Icon = icons[role as keyof typeof icons] || User;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-medical rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-inter font-semibold text-gray-900">
                MediCare System
              </h1>
              <p className="text-xs text-gray-500">Multi-Hospital Platform</p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search patients, appointments, prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </form>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" onClick={handleNotificationsClick}>
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profile.avatar} alt={user?.profile.firstName} />
                  <AvatarFallback>
                    {user?.profile.firstName?.[0]}{user?.profile.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.profile.firstName} {user?.profile.lastName}
                  </p>
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(user?.role || '')}
                    <Badge variant="secondary" className={`text-xs ${getRoleColor(user?.role || '')}`}>
                      {user?.role?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.profile.firstName} {user?.profile.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}