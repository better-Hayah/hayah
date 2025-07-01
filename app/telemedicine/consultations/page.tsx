"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Filter,
  Phone,
  Search,
  User,
  FileText,
  StickyNote,
} from "lucide-react";

interface Consultation {
  id: string;
  patientName: string;
  avatar?: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  phone: string;
  datetime: string;
  status: "Upcoming" | "Completed";
  bookingNote: string;
  patientId: string;
}

const dummyConsultations: Consultation[] = [
  {
    id: "c1",
    patientName: "Ahmed Youssef",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    gender: "male",
    dateOfBirth: "1985-03-15",
    phone: "+201001234567",
    datetime: "2025-07-01 10:00 AM",
    status: "Upcoming",
    bookingNote: "Frequent headaches and blurred vision.",
    patientId: "patient_001",
  },
  {
    id: "c2",
    patientName: "Salma Fathy",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    gender: "female",
    dateOfBirth: "1992-07-22",
    phone: "+201002345678",
    datetime: "2025-06-28 2:00 PM",
    status: "Completed",
    bookingNote: "Follow-up on previous blood test.",
    patientId: "patient_002",
  },
  {
    id: "c3",
    patientName: "Mohamed Ali",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    gender: "male",
    dateOfBirth: "1991-05-10",
    phone: "+201003456789",
    datetime: "2025-07-02 1:00 PM",
    status: "Upcoming",
    bookingNote: "Lower back pain for 3 weeks.",
    patientId: "patient_003",
  },
];

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function ConsultationsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Upcoming" | "Completed"
  >("all");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }
    if (user.role !== "doctor") {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || user.role !== "doctor") {
    return null;
  }

  const filteredConsultations = dummyConsultations.filter((c) => {
    const matchesSearch = c.patientName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
            <p className="text-gray-600 mt-1">
              Manage your telemedicine appointments
            </p>
          </div>

          {/* Search & Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search patients by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultations */}
          <div className="space-y-4">
            {filteredConsultations.length > 0 ? (
              filteredConsultations.map((c) => (
                <Card key={c.id}>
                  <CardHeader className="flex flex-row items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={c.avatar} alt={c.patientName} />
                      <AvatarFallback>{c.patientName[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{c.patientName}</CardTitle>
                        <Badge
                          variant={
                            c.status === "Upcoming" ? "default" : "secondary"
                          }
                        >
                          {c.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-gray-600">
                        {c.gender}, {calculateAge(c.dateOfBirth)} years old
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Left Info Grid */}
                      <div className="flex-col space-y-3 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{c.datetime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{c.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 md:col-span-2">
                          <StickyNote className="w-4 h-4" />
                          <span>{c.bookingNote}</span>
                        </div>
                      </div>

                      {/* Right Actions (Buttons) */}
                      <div className="flex flex-col space-y-2 w-full sm:w-64">
                        <Link
                          href={`/patients/${c.patientId}/records`}
                          className="block w-full"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Records
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => alert("Join Meeting (coming soon)")}
                          disabled={c.status !== "Upcoming"}
                        >
                          Join Meeting
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No consultations found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter settings.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
