import { API_ENDPOINTS } from './api-endpoints'
import { privateApiClient } from './private.axios'

export type GameConfigSchemaListResponse = {
  id: string
  name: string
}

export type UpsertGameConfigSchemaQuery = {
  id?: string
}

export type UpsertGameConfigSchemaRequest = {
  schema: object
  name: string
  uiSchema?: object
}

export type GameConfigSchema = {
  name: string
  schema: object
}

export type UpsertGameConfigSchemaFullRequest = {
  query: UpsertGameConfigSchemaQuery
  request: UpsertGameConfigSchemaRequest
}

export const listGameConfigSchemas = async () => {
  return privateApiClient.get<GameConfigSchemaListResponse[]>(API_ENDPOINTS.GAME_CONFIG_SCHEMA.LIST)
}

export const getGameConfigSchema = async (id: string) => {
  return privateApiClient.get<GameConfigSchema>(API_ENDPOINTS.GAME_CONFIG_SCHEMA.GET, {
    params: {
      id,
    },
  })
}

export const upsertGameConfigSchema = async ({ request, query }: UpsertGameConfigSchemaFullRequest) => {
  return privateApiClient.post<GameConfigSchema>(API_ENDPOINTS.GAME_CONFIG_SCHEMA.UPSERT, request, {
    params: query,
  })
}
