import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workout App',
  description: 'Base Next.js full-stack app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='it'>
      <body>
        <main className='container'>{children}</main>
      </body>
    </html>
  );
}
