import { useGameConfig, useGameConfigWithId } from "../hooks/useGameConfig"
import { useGameConfigSchema } from "../hooks/useGameConfigSchema"
import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { GameConfigSchemaCombobox } from "./game-config-schema-combobox";
import { useEffect } from "react";
import { toast } from "sonner";
import type { IChangeEvent } from "@rjsf/core";
import { DEFAULT_SCHEMA } from "../shared/const";

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

    useEffect(() => {
        setCurrentSchemaId(gameConfigSchemaId)
    }, [gameConfigSchemaId, setCurrentSchemaId])
    

    const handleSubmit = (data: IChangeEvent<object>) => {
        if (!currentSchemaId) {
            return;
        }

        gameConfigUpsertMutation.mutate({
            query: {
                gameId,
                schemaId: currentSchemaId,
            },
            request: data.formData as object
        }, {
            onSuccess: () => {
                toast.success("Game config updated")
            },
            onError: (err) => {
                toast.error("Failed to update game config")
                console.error(err)
            }
        })
    }


    function renderForm() {
        if (gameConfigSchemaGetQuery.isLoading) {
            return <div>Loading...</div>
        }
    
        return <div className="[&_form]:space-y-4 mt-4">
            <Form formData={gameConfig} schema={gameConfigSchemaGetQuery.data?.data?.schema ?? DEFAULT_SCHEMA} validator={validator} onSubmit={handleSubmit} />
        </div>
    }

    function renderCombobox() {
        if (gameConfigSchemaListQuery.isLoading) {
            return <div>Loading...</div>
        }
        
        return <GameConfigSchemaCombobox currentSchemaId={currentSchemaId} setCurrentSchemaId={setCurrentSchemaId} data={gameConfigSchemaListQuery.data?.data} />
    }

    return (
        <div>
            <h5 className="scroll-m-20 text-2xl font-extrabold tracking-tight mb-4">
                Game Config for game id {gameId}
            </h5>
            {renderCombobox()}
            {renderForm()}
        </div>
    )
}
