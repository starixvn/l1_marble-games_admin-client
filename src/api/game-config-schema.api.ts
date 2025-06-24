import { privateApiClient } from "./private.axios";

export type GameConfigSchemaListResponse = {
  id: string;
  name: string;
}[]

export const listGameConfigSchemas = async () => {
  return privateApiClient.get<GameConfigSchemaListResponse>('/api/gameConfigSchema/list')
}

export const getGameConfigSchema = async (id: string) => {
  return privateApiClient.get<GameConfigSchemaListResponse>(`/api/gameConfigSchema/get/${id}`)
}