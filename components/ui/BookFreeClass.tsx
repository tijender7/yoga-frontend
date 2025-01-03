'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactConfetti from 'react-confetti'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { API_ROUTES } from '@/config';

type NotificationType = 'success' | 'error' | null;

interface Notification {
  type: NotificationType;
  message: string;
}

const countryCodes = [
  { code: '+1', country: 'US/CAN' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IND' },
  { code: '+49', country: 'GER' },
  // Add more country codes as needed
]

export default function BookFreeClass({ buttonText = "Book Your Free Class", isOpen, onOpenChange, buttonClassName }: { buttonText?: string, isOpen?: boolean, onOpenChange?: (isOpen: boolean) => void, buttonClassName?: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen || false);

  useEffect(() => {
    if (isOpen !== undefined) {
      setIsDialogOpen(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isDialogOpen);
    }
  }, [isDialogOpen, onOpenChange]);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [notification, setNotification] = useState<Notification | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isConfettiActive, setIsConfettiActive] = useState(false)
  const [healthConditions, setHealthConditions] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotification(null)
    setIsLoading(true)
    
    try {
      // Basic validation
      if (!name.trim() || !email.trim()) {
        throw new Error("Please fill in all required fields.")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.")
      }

      // Check if email already exists in users table
      const checkEmailResponse = await fetch(API_ROUTES.CHECK_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const { exists } = await checkEmailResponse.json();
      if (exists) {
        throw new Error("You have already booked a free class. Please check your email for details.");
      }

      // Create a new user account with email confirmation
      const response = await fetch(API_ROUTES.SIGNUP, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          name,
          phone: phone ? `${countryCode}${phone}` : null,
          healthConditions,
          source: 'get_started'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user in backend')
      }

      setNotification({ 
        type: 'success', 
        message: "Your account has been created. Please check your email to set your password and access your free class details." 
      })
      setIsDialogOpen(false)
      showConfirmation()

    } catch (error: unknown) {
      console.error('Free class booking form submission failed - Please try again');
      
      if (error instanceof Error) {
        setNotification({ 
          type: 'error', 
          message: "We couldn't process your free class booking. Please check your details and try again." 
        })
      } else {
        setNotification({ 
          type: 'error', 
          message: "We're having trouble processing your request. Please try again in a few minutes." 
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const showConfirmation = () => {
    setIsConfettiActive(true)
    toast.success("You're all set for Weekend's class! We've sent the class link to your email. Can't wait to see you there!", {
      duration: 5000,
      position: 'bottom-right',
      className: 'custom-toast',
    })
    setTimeout(() => {
      setIsConfettiActive(false)
      setNotification(null)
    }, 3000)
  }

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const confettiRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Add meta tag for mobile viewport
  useEffect(() => {
    // Add meta tag when dialog opens
    if (isDialogOpen) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
      document.head.appendChild(meta);

      // Remove meta tag when dialog closes
      return () => {
        document.head.removeChild(meta);
      };
    }
  }, [isDialogOpen]);

  return (
    <>
      {isConfettiActive && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
      <div className="relative">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className={buttonClassName || "bg-primary text-primary-foreground hover:bg-primary/90"}>
              {buttonText}
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] sm:w-[450px] max-h-[90vh] overflow-y-auto bg-white text-gray-800 rounded-lg shadow-lg [&>button]:hidden"
          >
            <div className="relative p-6">
              <DialogClose className="absolute top-2 right-2 rounded-full p-2 hover:bg-gray-100 transition-colors">
                <svg 
                  width="15" 
                  height="15" 
                  viewBox="0 0 15 15" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </DialogClose>

              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">Book Your Free Weekend Class</DialogTitle>
                <DialogDescription className="text-gray-600 text-sm md:text-base mt-2">
                  Enter your details below to secure your spot in our upcoming free yoga session.
                </DialogDescription>
              </DialogHeader>

              {notification && (
                <div className={`p-3 rounded-md mb-4 ${
                  notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                } text-sm`}>
                  {notification.message}
                </div>
              )}

              <form 
                id="bookingForm"
                onSubmit={handleSubmit} 
                className="space-y-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    
                    // Get all input fields
                    const form = e.currentTarget;
                    const inputs = Array.from(form.querySelectorAll('input:not([type="tel"]), select'));
                    const currentElement = document.activeElement;
                    
                    // Find current input index
                    const currentIndex = inputs.indexOf(currentElement as HTMLElement);
                    
                    // Check if current field is valid
                    if (currentElement instanceof HTMLInputElement && !currentElement.validity.valid) {
                      return; // Stay on current field if it's invalid
                    }
                    
                    // Check if all required fields are filled and valid
                    const allRequiredFieldsValid = inputs
                      .filter(input => input instanceof HTMLInputElement && input.required)
                      .every(input => (input as HTMLInputElement).validity.valid);
                    
                    if (allRequiredFieldsValid && currentIndex === inputs.length - 1) {
                      // If all required fields are valid and we're on the last field, submit the form
                      form.requestSubmit();
                    } else {
                      // Move to next input
                      const nextInput = inputs[currentIndex + 1] as HTMLElement;
                      if (nextInput) {
                        nextInput.focus();
                      }
                    }
                  }
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                    Name*
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary rounded-md px-3 py-2 text-base"
                    required
                    inputMode="text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                    Email*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary rounded-md px-3 py-2 text-base"
                    required
                    inputMode="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 block">
                    Phone (optional)
                  </Label>
                  <div className="flex space-x-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[100px] bg-gray-100 border-gray-300">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary rounded-md px-3 py-2 text-base"
                      inputMode="tel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="health-conditions" className="text-sm font-medium text-gray-700">
                    Health Conditions/Medical Issues
                  </Label>
                  <Input
                    id="health-conditions"
                    value={healthConditions}
                    onChange={(e) => setHealthConditions(e.target.value)}
                    className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="E.g., back pain, knee issues, pregnancy, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-info" className="text-sm font-medium text-gray-700">
                    Any other information you'd like us to know
                  </Label>
                  <Input
                    id="additional-info"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full bg-gray-100 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="E.g., specific goals, concerns, or preferences"
                  />
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  We respect your privacy. Your email is required to send you the Zoom link for the class. 
                  Phone number is optional. We are GDPR compliant and adhere to international data protection regulations.
                </p>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white hover:bg-primary/90 transition-colors py-3 rounded-md mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Booking...' : 'Book Now'}
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

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
          bg-primary text-primary-foreground hover:bg-primary/90
          transition-all duration-200 ease-out
          px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium
          ${isHovered ? 'shadow-lg' : 'shadow'}
        `}
      />
      {isHovered && (
        <div className="absolute inset-0 -z-10 bg-primary/20 blur-xl rounded-full transition-opacity duration-200 ease-out opacity-75" />
      )}
    </div>
  )
}
