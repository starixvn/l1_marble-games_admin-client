import { useContext } from 'react';
import { useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AuthContext } from '@/contexts/auth.context';
import type { UseAuthReturn } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/shared/errors';
import { isLoginPage } from '@/shared/location';

export function useErrorHandledQueryCall<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const location = useLocation();
  const { handleLogout } = useContext(AuthContext) as UseAuthReturn;

  const wrappedOptions = {
    ...options,
    throwOnError: (error: TError) => {
      if (isUnauthorizedError(error) && !isLoginPage(location.pathname)) {
        handleLogout();
        return false;
      }
      return true;
    },
  };

  return useQuery(wrappedOptions);
}
