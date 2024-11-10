import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred')
        setLoading(false)
      }
    }

    getInitialSession()
  }, [])

  return { user, loading, error, setUser }
}
