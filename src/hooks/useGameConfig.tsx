import { listGameConfigs } from "@/api/game-config.api";
import { useErrorHandledQueryCall } from "./useErrorHandledQueryCall";
import { useState } from "react";
import { getGameConfigSchema } from "@/api/game-config-schema.api";

export function useGameConfig() {

    const [currentSchemaId, setCurrentSchemaId] = useState<string | null>(null);

    const gameConfigQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfigs'],
        queryFn: () => listGameConfigs(),
    });

    const gameConfigSchemaQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfigSchema', currentSchemaId],
        queryFn: () => getGameConfigSchema(currentSchemaId!),
        enabled: currentSchemaId !== null,
    });

    return {
        gameConfigQuery,
        currentSchemaId,
        setCurrentSchemaId,
        gameConfigSchemaQuery,
    }
}