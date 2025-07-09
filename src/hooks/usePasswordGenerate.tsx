import { useErrorHandledMutationCall } from "@/hooks/useErrorHandledMutationCall";
import { changePassword } from "@/api/auth.api";

export function usePasswordGenerate() {
  const { isPending, mutate, data } = useErrorHandledMutationCall({
    mutationFn: changePassword,
  })

  return {
    isPending,
    mutate,
    data,
  }
}