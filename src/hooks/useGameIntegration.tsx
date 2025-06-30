import {
  deleteGameIntegration,
  getGameIntegration,
  listGameIntegration,
  upsertGameIntegration,
} from '@/api/game-integration.api'
import { useErrorHandledQueryCall } from '@/hooks/useErrorHandledQueryCall'
import { useErrorHandledMutationCall } from '@/hooks/useErrorHandledMutationCall'

export const useGameIntegrationList = () => {
  const gameIntegrationListQuery = useErrorHandledQueryCall({
    queryKey: ['gameIntegrations'],
    queryFn: () => listGameIntegration(),
  })

  return { gameIntegrationListQuery }
}

export const useGameIntegrationWithId = ({
  gameId,
  operatorId,
  listExisting,
}: {
  gameId: number
  operatorId: string
  listExisting?: boolean
}) => {
  const gameIntegrationWithIdQuery = useErrorHandledQueryCall({
    queryKey: ['gameIntegration', gameId, operatorId],
    queryFn: () => getGameIntegration({ gameId, operatorId }),
    retry: false,
    enabled: listExisting && !!gameId && !!operatorId,
  })

  return { gameIntegrationWithIdQuery }
}

export const useGameIntegrationUpsert = () => {
  const gameIntegrationUpsertMutation = useErrorHandledMutationCall({
    mutationFn: upsertGameIntegration,
  })

  return { gameIntegrationUpsertMutation }
}

export const useGameIntegrationDelete = () => {
  const gameIntegrationDeleteMutation = useErrorHandledMutationCall({
    mutationFn: deleteGameIntegration,
  })

  return { gameIntegrationDeleteMutation }
}
