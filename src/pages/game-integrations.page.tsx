import { AdminLayout } from "@/components/layouts/admin.layout";
import { GameIntegrationTable, type GameIntegrationConfigParam } from "../components/game-integration-table";
import { useState } from "react";
import { GameIntegrationConfigDialog } from "../components/game-integration-config-dialog";
import { toast } from "sonner";
import { useGameIntegrationList, useGameIntegrationUpsert } from "../hooks/useGameIntegration";
import { useOperator } from "../hooks/useOperator";
import { useGameConfig } from "../hooks/useGameConfig";


export function GameIntegrationsPage() {

    const { gameIntegrationListQuery } = useGameIntegrationList()
    const { operatorsQuery } = useOperator()
    const { gameConfigQuery } = useGameConfig()
    const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
    const [currentComboboxOperatorId, setCurrentComboboxOperatorId] = useState<number | null>(null);
    const [currentComboboxOperatorName, setCurrentComboboxOperatorName] = useState<string | null>(null);
    const [currentDialogParam, setCurrentDialogParam] = useState<GameIntegrationConfigParam | null>(null);

    const { gameIntegrationUpsertMutation } = useGameIntegrationUpsert();

    const handleConfigClick = (param: GameIntegrationConfigParam) => {
        setCurrentDialogParam(param)
        setIsConfigDialogOpen(true)
    }


    const handleSubmit = async (json: string) => {
        try {

            if (!currentDialogParam?.gameId || !currentDialogParam?.operatorId) {
                return;
            }

            const parsedJson = JSON.parse(json);
            const request = parsedJson;
            const query = {
                gameId: currentDialogParam?.gameId,
                operatorId: currentDialogParam?.operatorId,
            }

            gameIntegrationUpsertMutation.mutate({
                query,
                json: request
            }, {
                onSuccess: () => {
                    toast.success('Game integration updated successfully');
                    gameIntegrationListQuery.refetch();
                },
                onError: () => {
                    toast.error('Failed to update game integration');
                }
            })

        } catch {
            toast.error('Invalid JSON format');
        }
    }

    function renderGameIntegrationTable() {

        if (gameIntegrationListQuery.isLoading || gameConfigQuery.isLoading || operatorsQuery.isLoading) {
            return <div>Loading...</div>
        }
        if (gameIntegrationListQuery.isError || gameConfigQuery.isError || operatorsQuery.isError) {
            return <div>Error</div>
        }
        return <GameIntegrationTable 
            data={gameIntegrationListQuery.data?.data} 
            gameIds={gameConfigQuery.data?.data.map((game: any) => game.gameId)}
            operatorIds={operatorsQuery.data?.data}
            currentGameId={currentComboboxOperatorId}
            currentOperatorId={currentComboboxOperatorName}
            setCurrentGameId={setCurrentComboboxOperatorId}
            setCurrentOperatorId={setCurrentComboboxOperatorName}
            handleConfigClick={handleConfigClick}
        />
    }
    return (
        <AdminLayout>
            {renderGameIntegrationTable()}
            <GameIntegrationConfigDialog
                isOpen={isConfigDialogOpen}
                onOpenChange={setIsConfigDialogOpen}
                handleSubmit={handleSubmit}
                currentGameId={currentDialogParam?.gameId ?? null}
                currentOperatorId={currentDialogParam?.operatorId ?? null}
                existingGameIntegration={gameIntegrationListQuery.data?.data ?? []}
                
            />
        </AdminLayout>
    )
}