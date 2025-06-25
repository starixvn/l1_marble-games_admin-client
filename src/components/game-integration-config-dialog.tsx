import { useGameIntegrationWithId } from "@/hooks/useGameIntegration";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import Editor from "@monaco-editor/react";
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
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (gameIntegrationWithIdQuery.data?.data) {
            const initialJson = JSON.stringify(gameIntegrationWithIdQuery.data.data, null, 2);
            setJson(initialJson);
        } else if (!isExistingGameIntegration && isOpen) {
            setJson('{}');
        }
    }, [gameIntegrationWithIdQuery.data?.data, isExistingGameIntegration, isOpen]);



    const handleFileRead = (file: File) => {
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target?.result as string
                setJson(text)
            }
            reader.readAsText(file)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const x = e.clientX
        const y = e.clientY
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setIsDragging(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        
        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFileRead(files[0])
        }
    }

    function renderEditor() {
        if (gameIntegrationWithIdQuery.isLoading) {
            return <div>Loading...</div>
        }
        if (gameIntegrationWithIdQuery.isError) {
            return <div>Error</div>
        }
        return <section 
            className={`w-full min-w-0 relative border-2 border-dashed transition-colors ${
                isDragging ? 'border-blue-400 bg-blue-50/10' : 'border-transparent'
            }`}
            aria-label="JSON file drop zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-50/20 backdrop-blur-sm">
                    <div className="text-blue-600 font-medium">Drop JSON file here</div>
                </div>
            )}
            <Editor
                height="50vh"
                width="100%"
                defaultLanguage="json"
                value={json}
                theme="vs-dark"
                onChange={(value) => setJson(value ?? '')}
                options={{
                    automaticLayout: true,
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                }}
            />
        </section>
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-[1280px] w-[95vw]">
                <DialogHeader>
                    <DialogTitle>Game Integration Config</DialogTitle>
                    <DialogDescription>Game Integration config for game id {currentGameId} and operator id {currentOperatorId}</DialogDescription>
                    <DialogDescription>Paste json below or drag and drop file</DialogDescription>
                </DialogHeader>
                {renderEditor()}
                <DialogFooter>
                    <Button onClick={() => handleSubmit(json)}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}