import { API_ENDPOINTS } from './api-endpoints'
import { privateApiClient } from './private.axios'

interface CreateOperatorRequest {
  name: string
}

interface UpdateOperatorNameRequest {
  name: string
  operatorId: string
}

interface OperatorQuery {
  operatorId?: string
  name?: string
}

export interface OperatorListResponse {
  id: string
  name: string
}

export const createOperator = async (request: CreateOperatorRequest) => {
  return privateApiClient.post(API_ENDPOINTS.OPERATOR.CREATE, request)
}

export const listOperators = async () => {
  return privateApiClient.get<OperatorListResponse[]>(API_ENDPOINTS.OPERATOR.LIST)
}

export const getOperator = async (query: OperatorQuery) => {
  validateOperatorQuery(query)
  return privateApiClient.get(API_ENDPOINTS.OPERATOR.GET, { params: query })
}

export const updateOperatorName = async (request: UpdateOperatorNameRequest) => {
  return privateApiClient.post(API_ENDPOINTS.OPERATOR.UPDATE_NAME, request)
}

export const generatePassword = async (query: OperatorQuery) => {
  validateOperatorQuery(query)
  return privateApiClient.post(API_ENDPOINTS.OPERATOR.GENERATE_PASSWORD, {}, { params: query })
}

const validateOperatorQuery = (query: OperatorQuery) => {
  if (!query.operatorId && !query.name) {
    throw new Error('operatorId or name is required')
  }
}
