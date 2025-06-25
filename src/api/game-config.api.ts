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

export type GameConfigUpsert = {
  request: GameConfigUpsertRequest;
  query: GameConfigUpsertQuery;
}

export const listGameConfigs = async () => {
  return privateApiClient.get('/gameConfig/list')
}

export const getGameConfig = async (id: number) => {
  return privateApiClient.get(`/gameConfig/get`, {
    params: {
        gameId: id
    }
  })
}

export const upsertGameConfig = async (upsert: GameConfigUpsert) => {
  return privateApiClient.post('/gameConfig/upsert', upsert.request, {
    params: upsert.query
  })
}