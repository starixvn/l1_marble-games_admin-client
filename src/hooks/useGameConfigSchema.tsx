import { useErrorHandledQueryCall } from "@/hooks/useErrorHandledQueryCall";
import { getGameConfigSchema, listGameConfigSchemas } from "@/api/game-config-schema.api";

export function useGameConfigSchemaList() {
    const gameConfigSchemaListQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfigSchemaList'],
        queryFn: () => listGameConfigSchemas(),
    });

    return {
        gameConfigSchemaListQuery,
    }
}

export function useGameConfigSchemaWithId({ id }: { id: string }) {
    const gameConfigSchemaGetQuery = useErrorHandledQueryCall({
        queryKey: ['gameConfigSchemaGet', id],
        queryFn: () => getGameConfigSchema(id),
    });

    return {
        gameConfigSchemaGetQuery,
    }
}