import { listOperators, createOperator, updateOperatorName, generatePassword } from "@/api/operator.api";
import { useErrorHandledQueryCall } from "@/hooks/useErrorHandledQueryCall";
import { useErrorHandledMutationCall } from "@/hooks/useErrorHandledMutationCall";

export function useOperator() {
    
    const operatorsQuery = useErrorHandledQueryCall({
        queryKey: ['operators'],
        queryFn: () => listOperators(),
    });

    const createOperatorMutation = useErrorHandledMutationCall({
        mutationFn: createOperator,
        onSuccess: () => {
            operatorsQuery.refetch();
        },
    });

    const updateOperatorNameMutation = useErrorHandledMutationCall({
        mutationFn: updateOperatorName,
        onSuccess: () => {
            operatorsQuery.refetch();
        },
    });

    const generatePasswordMutation = useErrorHandledMutationCall({
        mutationFn: generatePassword,
    });

    return {
        operatorsQuery,
        createOperatorMutation,
        updateOperatorNameMutation,
        generatePasswordMutation,
    }
}