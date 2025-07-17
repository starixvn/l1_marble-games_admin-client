export const API_ENDPOINTS = {
  AUTH: {
    PROFILE: '/auth/profile',
    LOGIN: '/auth/login',
    ONE_TIME_REGISTER: '/auth/oneTimeRegister',
    CHANGE_PASSWORD: '/auth/changePassword',
    CREATE_ACCOUNT: '/auth/createAccount',
    GET_ALL_ACCOUNTS: '/auth/getAllAccounts'
  },
  OPERATOR: {
    CREATE: '/operator/create',
    UPDATE_NAME: '/operator/updateName',
    GENERATE_PASSWORD: '/operator/generatePassword',
    GET: '/operator/get',
    LIST: '/operator/list',
  },
  GAME_INTEGRATION: {
    UPSERT: '/gameIntegration/upsert',
    GET: '/gameIntegration/get',
    DELETE: '/gameIntegration/delete',
  },
  GAME_CONFIG: {
    UPSERT: '/gameConfig/upsert',
    GET: '/gameConfig/get',
    LIST: '/gameConfig/list',
  },
  GAME_CONFIG_SCHEMA: {
    LIST: '/gameConfigSchema/list',
    GET: '/gameConfigSchema/get',
    UPSERT: '/gameConfigSchema/upsert',
  },
  API_LOG: '/apiLog/',
  ADMIN_LOG: '/adminLog/',
}