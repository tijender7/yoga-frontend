'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'  // Add this import
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, CreditCard, LogOut, Menu, X } from 'lucide-react'  // Add Menu and X here
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'
import BookFreeClass from '@/components/ui/BookFreeClass'

// GlowButton component
function GlowButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <BookFreeClass 
        buttonText="Free Trial"
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        buttonClassName={`
          bg-primary text-white font-medium
          hover:bg-primary/90 shadow-lg hover:shadow-xl
          transition-all duration-200 ease-out
          px-4 py-1.5 rounded-full text-xs sm:text-sm min-w-[80px]
          border-2 border-primary
          ${isHovered ? 'scale-105' : 'scale-100'}
        `}
      />
      {isHovered && (
        <div className="absolute inset-0 -z-10 bg-primary/20 blur-xl rounded-full transition-opacity duration-200 ease-out opacity-75" />
      )}
    </div>
  )
}

type HeaderProps = {
  showNavLinks?: boolean;
};

export default function Header({ showNavLinks = true }: HeaderProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navigation = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="px-2 sm:px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
      <Link className="flex items-center justify-center" href="/">
        <span className="text-lg sm:text-xl font-bold text-primary">YogForever</span>
      </Link>
      <div className="flex items-center gap-3 sm:gap-4">
        {showNavLinks && (
          <nav className="hidden md:flex items-center gap-4 mr-4">
            <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="/#about">About</Link>
            <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="/#services">Services</Link>
            <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="/#pricing">Pricing</Link>
            <Link className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4" href="/#contact">Contact</Link>
          </nav>
        )}
        {!loading && !user && (
          <Link href="/auth">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full border-2 border-primary text-primary hover:bg-primary/5 transition-colors min-w-[80px]"
            >
              Sign In
            </Button>
          </Link>
        )}
        <GlowButton />
        {loading ? (
          <Button variant="ghost" size="icon" disabled>
            <span className="sr-only">Loading</span>
          </Button>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-black" />
                <span className="sr-only">Open profile menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-black" />
          ) : (
            <Menu className="h-5 w-5 text-black" />
          )}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md py-2 md:hidden">
          <Link className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" href="#about">About</Link>
          <Link className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" href="#services">Services</Link>
          <Link className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" href="#pricing">Pricing</Link>
          <Link className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" href="#contact">Contact</Link>
        </div>
      )}
    </header>
  )
}
