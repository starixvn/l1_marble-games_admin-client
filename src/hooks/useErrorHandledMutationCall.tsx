import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import { AuthContext } from '@/contexts/auth.context';
import { useContext } from 'react';
import { isUnauthorizedError } from '@/shared/errors';
import { isLoginPage } from '@/shared/location';

export function useErrorHandledMutationCall<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const location = useLocation();
  const { handleLogout } = useContext(AuthContext);

  const wrappedOptions = {
    ...options,
    throwOnError: (error: TError) => {
      if (isUnauthorizedError(error) && !isLoginPage(location.pathname)) {
        handleLogout();
        return false;
      }
      return true;
    },
    retry: (failureCount: number, error: TError) => {
      if (isUnauthorizedError(error)) {
        return false;
      }
      return failureCount < 3;
    },
  };

  return useMutation(wrappedOptions);
}