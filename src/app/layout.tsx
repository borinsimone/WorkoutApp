import './styles/globals.scss';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Workout App',
  description: 'Workout app',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Workout App',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#1f2127',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='it'>
      <body>
        <main className='appContainer'>{children}</main>
      </body>
    </html>
  );
}
