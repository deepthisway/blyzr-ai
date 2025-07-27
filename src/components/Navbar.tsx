'use client'

import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import { UserControl } from '@/components/user-control'
import Link from 'next/link'
import Image from 'next/image'

interface NavbarProps {
  showFeatures?: boolean;
}

export function Navbar({ showFeatures = true }: NavbarProps) {
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl mx-auto px-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full shadow-2xl">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <Image
                src="/logo.png"
                alt="Blyzr AI Logo"
                width={120}
                height={80}
                className="transition-transform hover:scale-105"
                priority
                />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {showFeatures && (
                <a 
                  href="#features" 
                  className="text-gray-300 hover:text-white transition-all duration-300 font-medium"
                >
                  Features
                </a>
              )}
              <Link 
                href="/pricing" 
                className="text-gray-300 hover:text-white transition-all duration-300 font-medium"
              >
                Pricing
              </Link>

              {/* Authentication Buttons */}
              <SignedOut>
                <SignInButton>
                  <Button className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white border-0 rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white border-0 rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserControl showName={true} />
              </SignedIn>
            </div>

            {/* Mobile Menu Button (for future implementation) */}
            <div className="md:hidden">
              <SignedOut>
                <SignInButton>
                  <Button size="sm" className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white border-0 rounded-full px-4 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserControl showName={false} />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
