'use client';

import dynamic from 'next/dynamic';

// Disable SSR here (allowed because this is a Client Component)
const Navbar = dynamic(
  () => import('./page'),
  { ssr: false }
);

export default function NavbarClient() {
  return <Navbar />;
}
