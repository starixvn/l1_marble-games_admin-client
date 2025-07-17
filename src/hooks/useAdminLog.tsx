import { getAdminLogs, type AdminLogQuery } from "@/api/admin-log.api";
import { useErrorHandledQueryCall } from "@/hooks/useErrorHandledQueryCall";

export const useAdminLog = ({
    startDate,
    endDate,
    author,
    resource,
    action,
}: AdminLogQuery) => {
    const { isLoading, isError, isSuccess, data, error } = useErrorHandledQueryCall({
        queryKey: ['adminLog', startDate, endDate, author, resource, action],
        queryFn: () => getAdminLogs({ startDate, endDate, author, resource, action }),
    });

    return { isLoading, isError, isSuccess, data, error }
}