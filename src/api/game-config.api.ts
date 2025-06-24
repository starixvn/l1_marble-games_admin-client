import { privateApiClient } from "./private.axios";

export type GameConfigUpsertRequest = object;
export type GameConfigUpsertQuery = {
    gameId: number;
    schemaId: string;
}

export type GameConfigResponse = {
    gameId: number;
    gameConfigSchema: string;
    config: object;
}

export const listGameConfigs = async () => {
  return privateApiClient.get('/api/gameConfig/list')
}

export const getGameConfig = async (id: number) => {
  return privateApiClient.get(`/api/gameConfig/get`, {
    params: {
        gameId: id
    }
  })
}

export const upsertGameConfig = async (request: GameConfigUpsertRequest, query: GameConfigUpsertQuery) => {
  return privateApiClient.post('/api/gameConfig/upsert', request, {
    params: query
  })
}