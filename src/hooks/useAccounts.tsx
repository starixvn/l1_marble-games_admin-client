import { createAccount, getAllAccounts, type Account } from "@/api/auth.api";
import { useErrorHandledQueryCall } from "./useErrorHandledQueryCall";
import { useErrorHandledMutationCall } from "./useErrorHandledMutationCall";

export function useAccounts() {
  const { data, isLoading, error } = useErrorHandledQueryCall<Account[]>({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
  })

  return { data, isLoading, error }
}

export function useCreateAccount() {
  const { mutate, isPending, reset, data } = useErrorHandledMutationCall({
    mutationFn: createAccount,
  })

  return { mutate, isPending, reset, data }
}