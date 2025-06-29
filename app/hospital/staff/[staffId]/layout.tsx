export async function generateStaticParams() {
  // Return the staff IDs that should be pre-rendered
  // Include 'schedule' to handle the /hospital/staff/schedule route
  return [
    { staffId: 'staff_1' },
    { staffId: 'staff_2' },
    { staffId: 'staff_3' },
    { staffId: 'schedule' },
  ];
}

export default function StaffDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}