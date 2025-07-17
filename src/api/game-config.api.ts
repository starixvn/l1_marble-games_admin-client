import { API_ENDPOINTS } from './api-endpoints'
import { privateApiClient } from './private.axios'

export type GameConfigUpsertRequest = object
export type GameConfigUpsertQuery = {
  gameId: number
  schemaId: string
}

export type GameConfigResponse = {
  gameId: number
  gameConfigSchema: string
  config: object
}

export type GameConfigUpsert = {
  request: GameConfigUpsertRequest
  query: GameConfigUpsertQuery
}

export const listGameConfigs = async () => {
  return privateApiClient.get(API_ENDPOINTS.GAME_CONFIG.LIST)
}

export const getGameConfig = async (id: number) => {
  return privateApiClient.get(API_ENDPOINTS.GAME_CONFIG.GET, {
    params: {
      gameId: id,
    },
  })
}

export const upsertGameConfig = async (upsert: GameConfigUpsert) => {
  return privateApiClient.post(API_ENDPOINTS.GAME_CONFIG.UPSERT, upsert.request, {
    params: upsert.query,
  })
}
