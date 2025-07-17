import { IconHome, IconUser, IconSettings, IconCode } from '@tabler/icons-react'
import { API_ENDPOINTS } from '../api/api-endpoints'
import { useProfile } from './useProfile'

const allMenus = [
  {
    title: 'Home',
    url: '/',
    icon: IconHome,
    loader: [API_ENDPOINTS.AUTH.PROFILE],
  },
  {
    title: 'Account',
    url: '/accounts',
    icon: IconUser,
    loader: [API_ENDPOINTS.AUTH.GET_ALL_ACCOUNTS],
  },
  {
    title: 'Operators',
    url: '/operators',
    icon: IconUser,
    loader: [API_ENDPOINTS.OPERATOR.LIST, API_ENDPOINTS.OPERATOR.GET],
  },
  {
    title: 'Game Configs',
    url: '/game-configs',
    icon: IconSettings,
    loader: [API_ENDPOINTS.GAME_CONFIG.LIST, API_ENDPOINTS.GAME_CONFIG.GET],
  },
  {
    title: 'Game Integrations',
    url: '/game-integrations',
    icon: IconCode,
    loader: [API_ENDPOINTS.GAME_CONFIG.LIST, API_ENDPOINTS.OPERATOR.LIST],
  },
  {
    title: 'Game Config Schemas',
    url: '/game-config-schemas',
    icon: IconCode,
    loader: [API_ENDPOINTS.GAME_CONFIG_SCHEMA.LIST],
  },
  {
    title: 'Api Logs',
    url: '/logs-api',
    icon: IconCode,
    loader: [API_ENDPOINTS.API_LOG],
  },
  {
    title: 'Admin Log',
    url: '/admin-log',
    icon: IconCode,
    loader: [API_ENDPOINTS.ADMIN_LOG],
  },
]

export function useMenu() {
  const { data, isLoading } = useProfile()
  const menu = allMenus.filter((menu) => menu.loader.every((loader) => data?.allowedEndpoints.includes(loader)))
  const profile = data?.username

  return { menu, isLoading, profile }
}