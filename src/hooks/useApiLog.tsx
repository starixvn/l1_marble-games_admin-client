import { getApiLogs, type ApiLogQuery } from "../api/api-log.api"
import { useErrorHandledQueryCall } from "./useErrorHandledQueryCall"

export const useApiLog = ({
  startDate,
  endDate,
  operator,
  endpoint,
  gameId,
  eventId,
}: ApiLogQuery) => {
  const { isLoading, isError, isSuccess, data, error } = useErrorHandledQueryCall({
    queryKey: ['apiLog', startDate, endDate, operator, endpoint, gameId, eventId],
    queryFn: () => getApiLogs({ startDate, endDate, operator, endpoint, gameId, eventId }),
  });

  return { isLoading, isError, isSuccess, data, error }
}