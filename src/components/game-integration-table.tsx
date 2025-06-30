import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table'
import { Combobox } from './combobox'
import { IconSettings, IconTrash } from '@tabler/icons-react'

export type GameIntegrationConfigParam = {
  gameId: number
  operatorId: string
}

export function GameIntegrationTable({
  data,
  gameIds,
  operatorIds,
  handleConfigClick,
  handleDeleteClick,
  currentGameId,
  currentOperatorId,
  setCurrentGameId,
  setCurrentOperatorId,
}: Readonly<{
  data: {
    gameId: number
    operatorId: string
    operatorName?: string
  }[]
  gameIds: number[]
  operatorIds: {
    id: string
    name?: string
  }[]
  currentGameId: number | null
  currentOperatorId: string | null
  setCurrentGameId: (gameId: number | null) => void
  setCurrentOperatorId: (operatorId: string | null) => void
  handleConfigClick: (param: GameIntegrationConfigParam) => void
  handleDeleteClick: (param: GameIntegrationConfigParam) => void
}>) {
  return (
    <div className="overflow-hidden rounded-lg border m-2">
      <Table>
        <TableHeader>
          <GameIntegrationTableHeader />
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <GameIntegrationTableItem
              key={`${item.gameId}-${item.operatorId}`}
              handleConfigClick={handleConfigClick}
              handleDeleteClick={handleDeleteClick}
              {...item}
            />
          ))}
          <NewGameIntegrationTableItem
            handleConfigClick={handleConfigClick}
            gameIds={gameIds}
            operatorIds={operatorIds}
            currentGameId={currentGameId}
            currentOperatorId={currentOperatorId}
            setCurrentGameId={setCurrentGameId}
            setCurrentOperatorId={setCurrentOperatorId}
          />
        </TableBody>
      </Table>
    </div>
  )
}

export function GameIntegrationTableHeader() {
  return (
    <TableRow>
      <TableCell className="px-6 font-bold">Game ID</TableCell>
      <TableCell className="px-6 font-bold">Operator ID</TableCell>
      <TableCell className="font-bold">Actions</TableCell>
    </TableRow>
  )
}

export function GameIntegrationTableItem({
  gameId,
  operatorId,
  operatorName,
  handleConfigClick,
  handleDeleteClick,
}: Readonly<{
  gameId: number
  operatorId: string
  operatorName?: string
  handleConfigClick: (param: GameIntegrationConfigParam) => void
  handleDeleteClick: (param: GameIntegrationConfigParam) => void
}>) {
  return (
    <TableRow key={gameId}>
      <TableCell className="px-6">{gameId}</TableCell>
      <TableCell className="px-6">
        {operatorId} {operatorName ? `(${operatorName})` : ''}
      </TableCell>
      <TableCell className="flex gap-2">
        <Button className="h-9 w-9 p-0" variant="outline" onClick={() => handleConfigClick({ gameId, operatorId })}>
          <IconSettings className="h-4 w-4" />
        </Button>
        <Button
          className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          variant="outline"
          onClick={() => handleDeleteClick({ gameId, operatorId })}
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function NewGameIntegrationTableItem({
  handleConfigClick,
  gameIds,
  operatorIds,
  currentGameId,
  currentOperatorId,
  setCurrentGameId,
  setCurrentOperatorId,
}: Readonly<{
  handleConfigClick: (param: GameIntegrationConfigParam) => void
  gameIds: number[]
  operatorIds: {
    id: string
    name?: string
  }[]
  currentGameId: number | null
  currentOperatorId: string | null
  setCurrentGameId: (gameId: number | null) => void
  setCurrentOperatorId: (operatorId: string | null) => void
}>) {
  const handleNewGameIntegration = () => {
    if (currentGameId && currentOperatorId) {
      handleConfigClick({ gameId: currentGameId, operatorId: currentOperatorId })
    }
  }

  return (
    <TableRow>
      <TableCell className="px-6">
        <GameIdCombobox gameIds={gameIds} currentGameId={currentGameId} setCurrentGameId={setCurrentGameId} />
      </TableCell>
      <TableCell className="px-6">
        <OperatorIdCombobox
          operatorIds={operatorIds}
          currentOperatorId={currentOperatorId}
          setCurrentOperatorId={setCurrentOperatorId}
        />
      </TableCell>
      <TableCell className="">
        <Button className="w-[5rem]" variant="outline" onClick={handleNewGameIntegration}>
          New
        </Button>
      </TableCell>
    </TableRow>
  )
}

export function GameIdCombobox({
  gameIds,
  currentGameId,
  setCurrentGameId,
}: Readonly<{
  gameIds: number[]
  currentGameId: number | null
  setCurrentGameId: (gameId: number | null) => void
}>) {
  return (
    <Combobox
      list={gameIds.map((gameId) => ({
        id: gameId,
      }))}
      currentValue={currentGameId}
      setCurrentValue={setCurrentGameId as (value: string | number | null) => void}
      keyProp="id"
      valueProp="id"
      className="w-[100px]"
      valueFormatter={(item) => `${item.id}`}
    />
  )
}

export function OperatorIdCombobox({
  operatorIds,
  currentOperatorId,
  setCurrentOperatorId,
}: Readonly<{
  operatorIds: {
    id: string
    name?: string
  }[]
  currentOperatorId: string | null
  setCurrentOperatorId: (operatorId: string | null) => void
}>) {
  return (
    <Combobox
      list={operatorIds.map((operatorId) => ({
        id: operatorId.id,
        name: operatorId.name ?? '',
      }))}
      currentValue={currentOperatorId}
      setCurrentValue={setCurrentOperatorId as (value: string | number | null) => void}
      keyProp="id"
      valueProp="id"
      className="w-[300px]"
      valueFormatter={(item) => `${item.id} ${formatName(item.name as string)}`}
    />
  )
}

function formatName(name?: string) {
  return name ? `(${name})` : ''
}
