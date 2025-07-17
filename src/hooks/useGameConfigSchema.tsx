import { useErrorHandledQueryCall } from '@/hooks/useErrorHandledQueryCall'
import { getGameConfigSchema, listGameConfigSchemas, upsertGameConfigSchema } from '@/api/game-config-schema.api'
import { useState } from 'react'
import { useErrorHandledMutationCall } from './useErrorHandledMutationCall'

export const useGameConfigSchemaList = () => {
  const gameConfigSchemaListQuery = useErrorHandledQueryCall({
    queryKey: ['gameConfigSchemaList'],
    queryFn: () => listGameConfigSchemas(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    gameConfigSchemaListQuery,
  }
}

export function useGameConfigSchemaWithId({ id }: { id?: string }) {
  const gameConfigSchemaGetQuery = useErrorHandledQueryCall({
    queryKey: ['gameConfigSchemaGet', id],
    queryFn: () => getGameConfigSchema(id!),
    enabled: id !== undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    gameConfigSchemaGetQuery,
  }
}

export function useGameConfigSchema({ id }: { id?: string }) {
  const { gameConfigSchemaListQuery } = useGameConfigSchemaList()
  const [currentSchemaId, setCurrentSchemaId] = useState<string | null>(id ?? null)

  const { gameConfigSchemaGetQuery } = useGameConfigSchemaWithId({ id: currentSchemaId ?? undefined })

  return {
    gameConfigSchemaListQuery,
    currentSchemaId,
    setCurrentSchemaId,
    gameConfigSchemaGetQuery,
  }
}

export function useGameConfigSchemaUpsert() {
  const gameConfigSchemaUpsertMutation = useErrorHandledMutationCall({
    mutationFn: upsertGameConfigSchema,
  })

  return {
    gameConfigSchemaUpsertMutation,
  }
}
