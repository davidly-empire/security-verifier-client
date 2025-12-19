'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, Shield } from 'lucide-react'

import { Button } from '@/app/components/ui/button'

const Navbar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  /* ================= NAV ITEMS ================= */

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Scanpoints', href: '/scan-points' },
    { name: 'QR', href: '/dashboard/qr-crud' },
    { name: 'Security Activities', href: '/security-activity' },
    { name: 'Security Info', href: '/security-info' },
    { name: 'Add Users', href: '/user-crud' },
    { name: 'Reports', href: '/report-download' },
  ]

  /* ================= ACTIVE ROUTE ================= */

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname === href
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080883] shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* ================= LOGO (HOME) ================= */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/20">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">Security-Verifier</span>
        </Link>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <Button
          variant="ghost"
          size="icon"
          className="max-[1050px]:flex hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </Button>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden min-[1051px]:flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-full transition
                ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-[#080883]'
                    : 'text-gray-600 hover:text-[#080883]'
                }
              `}
            >
              {item.name}
            </Link>
          ))}

          {/* ================= USER AVATAR (HOME) ================= */}
          <div className="relative ml-1">
            <button
              onClick={() => router.push('/')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#080883]/10 hover:shadow"
            >
              <User className="h-5 w-5 text-[#080883]" />
            </button>
          </div>
        </nav>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="max-[1050px]:block hidden border-t bg-white">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 font-medium
                  ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}

            <div className="border-t pt-3">
              <button
                onClick={() => router.push('/')}
                className="block w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                Home
              </button>
              <button className="block w-full text-left px-3 py-2 hover:bg-gray-50">
                Settings
              </button>
              <button className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50">
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
