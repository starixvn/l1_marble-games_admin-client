import { useErrorHandledQueryCall } from "@/hooks/useErrorHandledQueryCall";
import { getGameConfigSchema, listGameConfigSchemas } from "@/api/game-config-schema.api";
import { useState } from "react";

export function useGameConfigSchemaList() {
    const gameConfigSchemaListQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfigSchemaList'],
        queryFn: () => listGameConfigSchemas(),
    });

    return {
        gameConfigSchemaListQuery,
    }
}

export function useGameConfigSchemaWithId({ id }: { id: string | null }) {
    const gameConfigSchemaGetQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfigSchemaGet', id],
        queryFn: () => getGameConfigSchema(id!),
        enabled: id !== null,
    });

    return {
        gameConfigSchemaGetQuery,
    }
}

export function useGameConfigSchema() {
    const { gameConfigSchemaListQuery } = useGameConfigSchemaList();
    const [currentSchemaId, setCurrentSchemaId] = useState<string | null>(null);

    const { gameConfigSchemaGetQuery } = useGameConfigSchemaWithId({ id: currentSchemaId! });

    return {
        gameConfigSchemaListQuery,
        currentSchemaId,
        setCurrentSchemaId,
        gameConfigSchemaGetQuery,
    }
}