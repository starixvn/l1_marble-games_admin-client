import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from './ui/button'
import { useNavigate } from 'react-router'

export function GameConfigTable({
  data,
}: Readonly<{
  data: {
    id: number
    gameId: number
    config: object
    gameConfigSchema: string
  }[]
}>) {

  const navigate = useNavigate();

  const handleConfigClick = (gameId: number) => {
    navigate(`/game-configs/${gameId}`);
  }

  const handleNewGameClick = () => {
    navigate(`/game-configs/new`);
  }

  return (
        <div className="overflow-hidden rounded-lg border m-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] px-6">Game Id</TableHead>
                <TableHead className="px-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((gameConfig) => (
                <GameConfigTableItem key={gameConfig.gameId} gameId={gameConfig.gameId} handleConfigClick={handleConfigClick} />
              ))}

              <NewGameConfigTableItem handleConfigClick={handleNewGameClick} />

            </TableBody>
          </Table>
        </div>
  )
}

export function GameConfigTableItem({
  gameId,
  handleConfigClick,
}: Readonly<{
  gameId: number
  handleConfigClick: (gameId: number) => void
}>) {

    return (
    <TableRow key={gameId}>
      <TableCell className="px-6">{gameId}</TableCell>
      <TableCell className="">
        <Button className="w-[100px]" variant="outline" onClick={() => handleConfigClick(gameId)}>
          Config
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function NewGameConfigTableItem(
  {
    handleConfigClick,
  }: Readonly<{
    handleConfigClick: () => void
  }>
) {
  return (
    <TableRow>
      <TableCell className="px-6">New</TableCell>
      <TableCell className="">
        <Button className="w-[100px] text-green-500" variant="outline" onClick={() => handleConfigClick()}>
          New
        </Button>
      </TableCell>
    </TableRow>
  )
}