'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

function VerifyEmailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [message, setMessage] = useState('Verifying your email...')

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const fullUrl = window.location.href
                
                if (fullUrl.includes('type=signup') || fullUrl.includes('type=recovery')) {
                    const { data, error } = await supabase.auth.getSession()
                    
                    if (error) throw error

                    if (data?.session) {
                        setVerificationStatus('success')
                        setMessage('Email verified successfully! Redirecting to login...')
                        
                        if (fullUrl.includes('type=signup')) {
                            setTimeout(() => router.push('/auth?tab=signin'), 3000)
                        } else {
                            setTimeout(() => router.push('/reset-password'), 3000)
                        }
                    }
                } else {
                    setVerificationStatus('error')
                    setMessage('Invalid verification link.')
                }
            } catch (error) {
                console.error('Verification error:', error)
                setVerificationStatus('error')
                setMessage('Failed to verify email. Please try again.')
            }
        }

        verifyEmail()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">
                        Email Verification
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {verificationStatus === 'verifying' && (
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        )}
                        <Alert variant={verificationStatus === 'error' ? 'destructive' : 'default'}>
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}