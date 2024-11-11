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
                const token = searchParams.get('token')
                const type = searchParams.get('type')

                if (!token || !type) {
                    setVerificationStatus('error')
                    setMessage('Invalid verification link.')
                    return
                }

                const { error } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: 'signup'
                })

                if (error) {
                    throw error
                }

                setVerificationStatus('success')
                setMessage('Email verified successfully! Redirecting to login...')
                
                setTimeout(() => {
                    router.push('/auth?tab=signin')
                }, 3000)

            } catch (error) {
                console.error('Verification error:', error)
                setVerificationStatus('error')
                setMessage('Failed to verify email. Please try again.')
            }
        }

        verifyEmail()
    }, [router, searchParams])

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