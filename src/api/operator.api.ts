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

export const createOperator = async (request: CreateOperatorRequest) => {
  return privateApiClient.post('/operator/create', request)
}

export const listOperators = async () => {
  return privateApiClient.get('/operator/list')
}

export const getOperator = async (query: OperatorQuery) => {
  validateOperatorQuery(query)
  return privateApiClient.get('/operator/get', { params: query })
}

export const updateOperatorName = async (request: UpdateOperatorNameRequest) => {
  return privateApiClient.post('/operator/updateName', request)
}

export const generatePassword = async (query: OperatorQuery) => {
  validateOperatorQuery(query)
  return privateApiClient.post('/operator/generatePassword', {}, { params: query })
}

const validateOperatorQuery = (query: OperatorQuery) => {
  if (!query.operatorId && !query.name) {
    throw new Error('operatorId or name is required')
  }
}
