import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - MediStore',
  description: 'Read our privacy policy to understand how MediStore collects, uses, and protects your personal information.',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}