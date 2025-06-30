import { useParams } from 'react-router'
import { GameConfigTable } from '@/components/game-config-table'
import { AdminLayout } from '@/components/layouts/admin.layout'
import { useGameConfig } from '@/hooks/useGameConfig'
import { GameConfigForm } from '@/components/game-config-form'
import NewGameForm from '@/components/new-game-form'
import { FullpageSkeleton } from '@/components/full-page-skeleton'
import { ErrorTable } from '../components/error-table'

export default function GameConfigsPage() {
  const { gameConfigQuery } = useGameConfig()
  const { gameId } = useParams<{ gameId: string }>()

  function renderGameConfigTable() {
    if (gameConfigQuery.isLoading) {
      return <FullpageSkeleton />
    }

    if (gameConfigQuery.isError) {
      return <ErrorTable onClick={() => gameConfigQuery.refetch()} />
    }

    return <GameConfigTable data={gameConfigQuery.data?.data} />
  }

  function renderGameConfigForm() {
    if (!gameId) {
      return null
    }

    if (Number.isNaN(Number(gameId))) {
      return <NewGameForm />
    }

    return <GameConfigForm gameId={Number(gameId)} />
  }

  return (
    <AdminLayout>
      {renderGameConfigTable()}
      <div className="mx-2">{renderGameConfigForm()}</div>
    </AdminLayout>
  )
}
