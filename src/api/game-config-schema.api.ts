import { privateApiClient } from "./private.axios";

export type GameConfigSchemaListResponse = {
  id: string;
  name: string;
}[]

export type GameConfigSchema = {
  name: string;
  schema: object;
}

export const listGameConfigSchemas = async () => {
  return privateApiClient.get<GameConfigSchemaListResponse>('/api/gameConfigSchema/list')
}

export const getGameConfigSchema = async (id: string) => {
  return privateApiClient.get<GameConfigSchema>(`/api/gameConfigSchema/get`, {
    params: {
      id,
    },
  })
}