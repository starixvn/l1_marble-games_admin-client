import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { AuthContext } from '@/contexts/auth.context';
import { UnauthorizedError } from '@/shared/errors';
import { useContext } from 'react';
import type { UseAuthReturn } from './useAuth';

export function useErrorHandledQueryCall<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useContext(AuthContext) as UseAuthReturn;

  const wrappedOptions = {
    ...options,
    throwOnError: (error: TError) => {
      if (error instanceof UnauthorizedError && location.pathname !== '/login') {
        handleLogout();
        navigate('/login', { replace: true });
        return false;
      }
      return true;
    },
  };

  return useQuery(wrappedOptions);
}
