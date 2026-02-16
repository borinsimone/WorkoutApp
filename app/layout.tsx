import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkoutApp - Track Your Fitness Journey",
  description: "Track your workouts, exercises, and fitness progress with WorkoutApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
