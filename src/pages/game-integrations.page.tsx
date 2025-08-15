import { AdminLayout } from '@/components/layouts/admin.layout'
import { GameIntegrationTable, type GameIntegrationConfigParam } from '@/components/game-integration-table'
import { useState } from 'react'
import { GameIntegrationConfigDialog } from '@/components/game-integration-config-dialog'
import { toast } from 'sonner'
import { useGameIntegrationDelete, useGameIntegrationList, useGameIntegrationUpsert } from '@/hooks/useGameIntegration'
import { useOperator } from '@/hooks/useOperator'
import { useGameConfig } from '@/hooks/useGameConfig'
import type { GameIntegrationListResponse } from '@/api/game-integration.api'
import type { OperatorListResponse } from '@/api/operator.api'
import { API_ENDPOINTS } from '@/api/api-endpoints'
import { usePermission } from '@/hooks/usePermission'
import { ConfirmationPopup } from '@/components/confirmation-popup'

export function GameIntegrationsPage() {
  const { gameIntegrationListQuery } = useGameIntegrationList()
  const { operatorsQuery } = useOperator()
  const { gameConfigQuery } = useGameConfig()
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [currentComboboxOperatorId, setCurrentComboboxOperatorId] = useState<number | null>(null)
  const [currentComboboxOperatorName, setCurrentComboboxOperatorName] = useState<string | null>(null)
  const [currentDialogParam, setCurrentDialogParam] = useState<GameIntegrationConfigParam | null>(null)
  const { gameIntegrationUpsertMutation } = useGameIntegrationUpsert()
  const { gameIntegrationDeleteMutation } = useGameIntegrationDelete()
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const { isAllowed: getPermission } = usePermission({ 
    path: [ 
      API_ENDPOINTS.GAME_INTEGRATION.GET,
    ] 
  })
  const { isAllowed: deletePermission } = usePermission({ 
    path: [ 
      API_ENDPOINTS.GAME_INTEGRATION.DELETE,
    ] 
  })

  const mapGameIntegrationsWithOperatorNames = (
    integrations: GameIntegrationListResponse[],
    operators: OperatorListResponse[],
  ) => {
    return (
      integrations?.map((integration: GameIntegrationListResponse) => {
        const operator = operators?.find((op: OperatorListResponse) => op.id === integration.operatorId)
        return {
          ...integration,
          operatorName: operator?.name ?? undefined,
        }
      }) ?? []
    )
  }

  const handleConfigClick = (param: GameIntegrationConfigParam) => {
    setCurrentDialogParam(param)
    setIsConfigDialogOpen(true)
  }

  function handleDelete(param: GameIntegrationConfigParam) {
    gameIntegrationDeleteMutation.mutate(
      {
        gameId: param.gameId,
        operatorId: param.operatorId,
      },
      {
        onSuccess: () => {
          toast.success('Game integration deleted successfully')
          gameIntegrationListQuery.refetch()
        },
        onError: () => {
          toast.error('Failed to delete game integration')
        },
      },
    )
  }

  const handleDeleteClick = (param: GameIntegrationConfigParam) => {
    setCurrentDialogParam(param)
    setIsConfirmationPopupOpen(true)
  }

  const handleSubmit = async (json: string) => {
    try {
      if (!currentDialogParam?.gameId || !currentDialogParam?.operatorId) {
        return
      }

      const parsedJson = JSON.parse(json)
      const request = parsedJson
      const query = {
        gameId: currentDialogParam?.gameId,
        operatorId: currentDialogParam?.operatorId,
      }

      gameIntegrationUpsertMutation.mutate(
        {
          query,
          json: request,
        },
        {
          onSuccess: () => {
            toast.success('Game integration updated successfully');
            gameIntegrationListQuery.refetch();
            setIsConfigDialogOpen(false);
          },
          onError: () => {
            toast.error('Failed to update game integration')
          },
        },
      )
    } catch {
      toast.error('Invalid JSON format')
    }
  }

  function renderGameIntegrationTable() {
    if (gameIntegrationListQuery.isLoading || gameConfigQuery.isLoading || operatorsQuery.isLoading) {
      return <div>Loading...</div>
    }
    if (gameIntegrationListQuery.isError || gameConfigQuery.isError || operatorsQuery.isError) {
      return <div>Error</div>
    }

    const gameIntegrationDataWithOperatorNames = mapGameIntegrationsWithOperatorNames(
      gameIntegrationListQuery.data?.data ?? [],
      operatorsQuery.data?.data ?? [],
    )

    return (
      <GameIntegrationTable
        data={gameIntegrationDataWithOperatorNames}
        gameIds={gameConfigQuery.data?.data.map((game: { gameId: number }) => game.gameId)}
        operatorIds={operatorsQuery.data?.data ?? []}
        currentGameId={currentComboboxOperatorId}
        currentOperatorId={currentComboboxOperatorName}
        setCurrentGameId={setCurrentComboboxOperatorId}
        setCurrentOperatorId={setCurrentComboboxOperatorName}
        handleConfigClick={handleConfigClick}
        handleDeleteClick={handleDeleteClick}
        allowDelete={deletePermission}
      />
    )
  }
  return (
    <AdminLayout>
      {renderGameIntegrationTable()}
      {getPermission && <GameIntegrationConfigDialog
        isOpen={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        handleSubmit={handleSubmit}
        currentGameId={currentDialogParam?.gameId ?? null}
        currentOperatorId={currentDialogParam?.operatorId ?? null}
        existingGameIntegration={gameIntegrationListQuery.data?.data ?? []}
      />}
      {deletePermission && <ConfirmationPopup
        title={`Delete game integration for operator ${currentDialogParam?.operatorId ?? ''} and game id ${currentDialogParam?.gameId ?? ''}?`}
        description="This action cannot be undone. Operator can no longer get game data from this game unless you add it back"
        onConfirm={() => {
          if (currentDialogParam) {
            handleDelete(currentDialogParam)
          }
        }}
        onCancel={() => {
          setIsConfirmationPopupOpen(false)
        }}
        open={isConfirmationPopupOpen}
        onOpenChange={setIsConfirmationPopupOpen}
      />}
    </AdminLayout>
  )
}
