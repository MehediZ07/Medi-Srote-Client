import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";
import AuthProvider from "../components/AuthProvider";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import AIChatbot from '../components/AIChatbot';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MediStore - Your Trusted Online Pharmacy",
  description: "Your trusted online pharmacy connecting customers with verified sellers for safe, convenient healthcare solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
              <ConditionalLayout>{children}</ConditionalLayout>
              <AIChatbot />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  color: '#1f2937',
                  fontWeight: '500',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
