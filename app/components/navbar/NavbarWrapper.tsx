'use client';

import { usePathname } from 'next/navigation';

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export default function NavbarWrapper({ children }: NavbarWrapperProps) {
  const pathname = usePathname();

  // Hide navbar on home page and login page
  if (pathname === '/' || pathname === '/login') return null;

  return <>{children}</>;
}
