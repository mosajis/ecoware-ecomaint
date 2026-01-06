import { useEffect, useState, ReactNode } from 'react'
import { Outlet, redirect } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { atomAuth } from '@/pages/auth/auth.atom'
import { authorization } from '@/pages/auth/auth.api'
import Spinner from '@/shared/components/Spinner'
import { LOCAL_STORAGE } from '@/const'

type Props = {
  children: ReactNode
}

export default function AppAuthorization({ children }: Props) {
  const setAuth = useSetAtom(atomAuth)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAuth = async () => {
      const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY)
      if (!token) return

      try {
        const res = (await authorization()) as any
        setAuth({ authorized: !!res.authorized, user: res.user })
      } catch {
        setAuth({ authorized: false, user: null })
      } finally {
        setLoading(false)
      }
    }

    loadAuth()
  }, [setAuth])

  if (loading) return <Spinner />

  return <>{children || <Outlet />}</>
}
