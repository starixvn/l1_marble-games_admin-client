import { useGameConfig, useGameConfigWithId } from "@/hooks/useGameConfig"
import { useGameConfigSchema } from "@/hooks/useGameConfigSchema"
import Form from '@rjsf/shadcn';
import { validatorWithDataSupport } from "@/lib/validator";
import { GameConfigSchemaCombobox } from "@/components/game-config-schema-combobox";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { IChangeEvent } from "@rjsf/core";
import { DEFAULT_SCHEMA } from "@/shared/const";
import { Button } from "@/components/ui/button";
import { CodeXml } from "lucide-react";
import { JsonEditorDialog } from "@/components/json-editor-dialog";
import { apply } from "json-merge-patch"

export function GameConfigForm({
    gameId
}: Readonly<{
    gameId: number
}>) {
    const { gameConfigWithIdQuery } = useGameConfigWithId({ gameId })

    if (gameConfigWithIdQuery.isLoading) {
        return <div>Loading...</div>
    }

    if (gameConfigWithIdQuery.isError) {
        return <div>Error</div>
    }

    if (gameConfigWithIdQuery.isSuccess) {
        return <GameConfigSchemaForm gameId={gameId} gameConfigSchemaId={gameConfigWithIdQuery.data?.data?.gameConfigSchema} gameConfig={gameConfigWithIdQuery.data?.data?.config} />
    }

    return null;
}



function GameConfigSchemaForm({
    gameId,
    gameConfigSchemaId,
    gameConfig
}: Readonly<{
    gameId: number
    gameConfigSchemaId: string
    gameConfig: object
}>) {

    const { gameConfigSchemaGetQuery, gameConfigSchemaListQuery, currentSchemaId, setCurrentSchemaId } = useGameConfigSchema({ id: gameConfigSchemaId })
    const { gameConfigUpsertMutation } = useGameConfig();
    const [currentFormData, setCurrentFormData] = useState<object>(gameConfig);
    const [formKey, setFormKey] = useState<number>(0);

    useEffect(() => {
        setCurrentSchemaId(gameConfigSchemaId)
    }, [gameConfigSchemaId, setCurrentSchemaId])

    useEffect(() => {
        setCurrentFormData(gameConfig);
        setFormKey(prev => prev + 1);
    }, [gameConfig])

    const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
    const [json, setJson] = useState<string>('{}');
    
    const handleFormChange = (data: IChangeEvent<object>) => {
        setCurrentFormData({ ...data.formData as object });
    }

    const handleSubmit = (data: IChangeEvent<object>) => {
        if (!currentSchemaId) {
            return;
        }

        const fullRequest = {
            query: {
                gameId,
                schemaId: currentSchemaId,
            },
            request: data.formData as object
        }

        gameConfigUpsertMutation.mutate(fullRequest, {
            onSuccess: () => {
                toast.success("Game config updated")
            },
            onError: () => {
                toast.error("Failed to update game config")
            }
        })
    }

    const handleJsonEditorSubmit = (jsonString: string) => {
        setCurrentFormData({...apply(currentFormData, JSON.parse(jsonString))});
        setFormKey(prev => prev + 1); // fix bug form data not updated when form data is changed, this is library bug
        setJson('{}');
    }

    function renderForm() {
        if (gameConfigSchemaGetQuery.isLoading) {
            return <div>Loading...</div>
        }
    
        return (<div className="[&_form]:space-y-4 mt-4">
            <Form 
                key={formKey}
                formData={currentFormData} 
                schema={gameConfigSchemaGetQuery.data?.data?.schema ?? DEFAULT_SCHEMA} 
                validator={validatorWithDataSupport} 
                onSubmit={handleSubmit} 
                onChange={handleFormChange}
                liveValidate
            />
            <JsonEditorDialog
                isOpen={isJsonEditorOpen}
                onOpenChange={setIsJsonEditorOpen}
                initialValue={json}
                onSubmit={handleJsonEditorSubmit}
                title="Game Config"
                description="Paste json below or drag and drop file"
                isLoading={gameConfigSchemaGetQuery.isLoading}
                isError={gameConfigSchemaGetQuery.isError}
            />
        </div>)
    }

    function renderComboboxAndJsonEditor() {
        if (gameConfigSchemaListQuery.isLoading) {
            return <div>Loading...</div>
        }
        
        return (
            <div className="flex items-center gap-2">
                <GameConfigSchemaCombobox currentSchemaId={currentSchemaId} setCurrentSchemaId={setCurrentSchemaId} data={gameConfigSchemaListQuery.data?.data} />
                <Button variant="outline" size="icon" onClick={() => setIsJsonEditorOpen(true)}>
                    <CodeXml className="h-4 w-4 text-blue-500 drop-shadow-lg" strokeWidth={3} style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))' }} />
                </Button>
            </div>
        )
    }

    return (
        <div>
            <h5 className="scroll-m-20 text-2xl font-extrabold tracking-tight mb-4">
                Game Config for game id {gameId}
            </h5>
            {renderComboboxAndJsonEditor()}
            {renderForm()}
        </div>
    )
}
