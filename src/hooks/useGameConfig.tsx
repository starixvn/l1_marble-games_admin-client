import { upsertGameConfig, listGameConfigs, getGameConfig } from "@/api/game-config.api";
import { useErrorHandledQueryCall } from "./useErrorHandledQueryCall";
import { useErrorHandledMutationCall } from "./useErrorHandledMutationCall";
import { useState } from "react";

export function useGameConfig() {

    const [currentGameId, setCurrentGameId] = useState<number | null>(null);

    const gameConfigQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfigs'],
        queryFn: () => listGameConfigs(),
    });


    const gameConfigUpsertMutation = useErrorHandledMutationCall({
        mutationFn: upsertGameConfig,
        onSuccess: () => {
            gameConfigQuery.refetch()
        },
    });

    const gameConfigWithIdQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfig', currentGameId],
        queryFn: () => getGameConfig(currentGameId!),
        enabled: currentGameId !== null,
    });

    return {
        gameConfigQuery,
        gameConfigUpsertMutation,
        currentGameId,
        setCurrentGameId,
        gameConfigWithIdQuery,
    }
}

export function useGameConfigWithId({ gameId }: { gameId: number }) {
    const gameConfigWithIdQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfig', gameId],
        queryFn: () => getGameConfig(gameId),
    });

    return {
        gameConfigWithIdQuery,
    }
}