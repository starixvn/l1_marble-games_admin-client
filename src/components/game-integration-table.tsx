import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { Combobox } from "./combobox";

export type GameIntegrationConfigParam = {
    gameId: number,
    operatorId: string,
}

export function GameIntegrationTable({
    data,
    gameIds,
    operatorIds,
    handleConfigClick,
    currentGameId,
    currentOperatorId,
    setCurrentGameId,
    setCurrentOperatorId,
}: Readonly<{
    data: {
        gameId: number,
        operatorId: string,
        operatorName?: string,
    }[],
    gameIds: number[],
    operatorIds: {
        id: string,
        name?: string
    }[],
    currentGameId: number | null,
    currentOperatorId: string | null,
    setCurrentGameId: (gameId: number | null) => void,
    setCurrentOperatorId: (operatorId: string | null) => void,
    handleConfigClick: (param: GameIntegrationConfigParam) => void,
}>) {
    return (
        <div className="overflow-hidden rounded-lg border m-2">
            <Table>
                <TableHeader>
                    <GameIntegrationTableHeader />
                </TableHeader>
                <TableBody>
                {data.map((item) => (
                    <GameIntegrationTableItem key={item.gameId} {...item} handleConfigClick={handleConfigClick} />
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
            <TableCell className="px-6">Game ID</TableCell>
            <TableCell className="px-6">Operator ID</TableCell>
            <TableCell className="">Action</TableCell>
        </TableRow>
    )
}

export function GameIntegrationTableItem({
    gameId,
    operatorId,
    operatorName,
    handleConfigClick,
}: Readonly<{
    gameId: number,
    operatorId: string,
    operatorName?: string,
    handleConfigClick: (param: GameIntegrationConfigParam) => void,
}>) {
    return (
        <TableRow key={gameId}>
          <TableCell className="px-6">{gameId}</TableCell>
          <TableCell className="px-6">{operatorId} {operatorName ? `(${operatorName})` : ''}</TableCell>
          <TableCell className="">
            <Button className="w-[100px]" variant="outline" onClick={() => handleConfigClick({gameId, operatorId})}>
              Config
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
    handleConfigClick: (param: GameIntegrationConfigParam) => void,
    gameIds: number[],
    operatorIds: {
        id: string,
        name?: string
    }[],
    currentGameId: number | null,
    currentOperatorId: string | null,
    setCurrentGameId: (gameId: number | null) => void,
    setCurrentOperatorId: (operatorId: string | null) => void,
}>) {

    const handleNewGameIntegration = () => {
        if (currentGameId && currentOperatorId) {
            handleConfigClick({gameId: currentGameId, operatorId: currentOperatorId});
        }
    }

    return (
        <TableRow>
            <TableCell className="px-6">
                <GameIdCombobox
                        gameIds={gameIds}
                        currentGameId={currentGameId}
                        setCurrentGameId={setCurrentGameId}
                    />
            </TableCell>
            <TableCell className="px-6">
                <OperatorIdCombobox
                        operatorIds={operatorIds}
                        currentOperatorId={currentOperatorId}
                        setCurrentOperatorId={setCurrentOperatorId}
                    />
            </TableCell>
            <TableCell className="">
            <Button className="w-[100px]" variant="outline" onClick={handleNewGameIntegration}>
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
    gameIds: number[],
    currentGameId: number | null,
    setCurrentGameId: (gameId: number | null) => void,
}>) {

    const setTest = (gameId: number | null) => {
        setCurrentGameId(gameId)
    }

    return (
        <Combobox
            list={gameIds.map((gameId) => ({
                id: gameId,
            }))}
            currentValue={currentGameId}
            setCurrentValue={setTest}
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
        id: string,
        name?: string
    }[],
    currentOperatorId: string | null,
    setCurrentOperatorId: (operatorId: string | null) => void,
}>) {

    return (
        <Combobox
            list={operatorIds.map((operatorId) => ({
                id: operatorId.id,
                name: operatorId.name ?? "",
            }))}
            currentValue={currentOperatorId}
            setCurrentValue={setCurrentOperatorId}
            keyProp="id"
            valueProp="id"
            className="w-[300px]"
            valueFormatter={(item) => `${item.id} ${formatName(item.name)}`}
        />
    )
}

export function formatName(name?: string) {
    return name ? `(${name})` : ''
}