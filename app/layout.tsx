import './globals.css';
import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'MediCare Hospital System | Comprehensive Healthcare Management',
  description: 'Advanced multi-hospital medical system with patient portal, telemedicine, emergency management, and comprehensive healthcare workflows.',
  keywords: 'hospital management, healthcare system, telemedicine, patient portal, medical records, HIPAA compliant',
  authors: [{ name: 'MediCare System' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'MediCare Hospital System',
    description: 'Comprehensive healthcare management platform',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0066CC" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="font-roboto antialiased">
        <ErrorBoundary>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
                color: '#374151',
              },
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}