import { useErrorHandledQueryCall } from '@/hooks/useErrorHandledQueryCall'
import { getProfile } from '@/api/auth.api'
import { useCallback, useEffect } from 'react'
import { globalAuthEventEmitter } from '../api/private.axios'

export function useProfile() {

  const profileQuery = useErrorHandledQueryCall({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { data, isLoading, isError, error } = profileQuery

  const refetch = useCallback(() => {
    profileQuery.refetch()
  }, [profileQuery])

  useEffect(() => {
    globalAuthEventEmitter.addEventListener('logout', refetch)

    return () => {
      globalAuthEventEmitter.removeEventListener('logout', refetch)
    }
  }, [refetch])

  return { data, isLoading, isError, error }
}