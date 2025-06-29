import { StaffDetailClient } from '@/components/hospital/staff-detail-client';

interface StaffDetailPageProps {
  params: { staffId: string };
}

export default function StaffDetailPage({ params }: StaffDetailPageProps) {
  return <StaffDetailClient params={params} />;
}