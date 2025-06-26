import { useGameIntegrationWithId } from "@/hooks/useGameIntegration";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JsonEditorWithDragDrop } from "@/components/json-editor-with-drag-drop";
import { useEffect, useState } from "react";

export const GameIntegrationConfigDialog = ({
    isOpen,
    onOpenChange,
    handleSubmit,
    currentGameId,
    currentOperatorId,
    existingGameIntegration,
}: {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    handleSubmit: (json: string) => Promise<void>,
    currentGameId: number | null,
    currentOperatorId: string | null,
    existingGameIntegration: {
        gameId: number,
        operatorId: string,
        data: any
    }[]
}) => {
    const isExistingGameIntegration = existingGameIntegration.some(gameIntegration => gameIntegration.gameId === currentGameId && gameIntegration.operatorId === currentOperatorId)
    const { gameIntegrationWithIdQuery } = useGameIntegrationWithId({ gameId: currentGameId!, operatorId: currentOperatorId!, listExisting: isExistingGameIntegration })
    
    const [json, setJson] = useState<string>('{}');

    useEffect(() => {
        if (gameIntegrationWithIdQuery.data?.data) {
            const initialJson = JSON.stringify(gameIntegrationWithIdQuery.data.data, null, 2);
            setJson(initialJson);
        } else if (!isExistingGameIntegration && isOpen) {
            setJson('{}');
        }
    }, [gameIntegrationWithIdQuery.data?.data, isExistingGameIntegration, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[1280px] w-[95vw]">
                <DialogHeader>
                    <DialogTitle>Game Integration Config</DialogTitle>
                    <DialogDescription>Game Integration config for game id {currentGameId} and operator id {currentOperatorId}</DialogDescription>
                    <DialogDescription>Paste json below or drag and drop file</DialogDescription>
                </DialogHeader>
                <JsonEditorWithDragDrop
                    value={json}
                    onChange={setJson}
                    isLoading={gameIntegrationWithIdQuery.isLoading}
                    isError={gameIntegrationWithIdQuery.isError}
                />
                <DialogFooter>
                    <Button onClick={() => handleSubmit(json)}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}