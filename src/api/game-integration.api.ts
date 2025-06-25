import { privateApiClient } from "./private.axios"

export type GameIntegrationQuery = {
    gameId: number,
    operatorId: string,
}

export const listGameIntegration = async () => {
    return privateApiClient.get('/gameIntegration/list')
}

export const getGameIntegration = async ({
    gameId,
    operatorId,
}: GameIntegrationQuery) => {
    return privateApiClient.get('/gameIntegration/get', {
        params: {
            gameId,
            operatorId,
        }
    })
}

export const upsertGameIntegration = async ({
    query,
    json,
}: {
    query: GameIntegrationQuery,
    json: object,
}) => {
    return privateApiClient.post('/gameIntegration/upsert', json, {
        params: query,
    })
}