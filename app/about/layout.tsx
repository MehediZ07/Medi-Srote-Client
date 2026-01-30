import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - MediStore',
  description: 'Learn about MediStore, your trusted online pharmacy connecting customers with verified sellers for safe, convenient healthcare solutions.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}