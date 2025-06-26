import { privateApiClient } from "./private.axios";

export type GameConfigSchemaListResponse = {
  id: string;
  name: string;
}[]

export type UpsertGameConfigSchemaQuery = {
  id?: string;
}

export type UpsertGameConfigSchemaRequest = {
  schema: object;
  name: string;
  uiSchema?: object
}

export type GameConfigSchema = {
  name: string;
  schema: object;
}

export type UpsertGameConfigSchemaFullRequest = {
  query: UpsertGameConfigSchemaQuery;
  request: UpsertGameConfigSchemaRequest;
}

export const listGameConfigSchemas = async () => {
  return privateApiClient.get<GameConfigSchemaListResponse>('/gameConfigSchema/list')
}

export const getGameConfigSchema = async (id: string) => {
  return privateApiClient.get<GameConfigSchema>(`/gameConfigSchema/get`, {
    params: {
      id,
    },
  })
}

export const upsertGameConfigSchema = async ({ request, query }: UpsertGameConfigSchemaFullRequest) => {
  return privateApiClient.post<GameConfigSchema>(`/gameConfigSchema/upsert`, request, {
    params: query,
  })
}