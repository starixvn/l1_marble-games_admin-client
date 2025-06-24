import { useState } from "react";
import { useGameConfigSchema } from "../hooks/useGameConfigSchema";
import { GameConfigSchemaCombobox } from "./game-config-schema-combobox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Form from "@rjsf/shadcn";
import validator from "@rjsf/validator-ajv8";
import { DEFAULT_SCHEMA } from "../shared/const";
import { useGameConfig } from "../hooks/useGameConfig";
import type { IChangeEvent } from "@rjsf/core";

export default function NewGameForm() {
    const { gameConfigSchemaListQuery, currentSchemaId, setCurrentSchemaId, gameConfigSchemaGetQuery } = useGameConfigSchema({});
    const [newGameId, setNewGameId] = useState<number | null>(null);
    const { gameConfigUpsertMutation } = useGameConfig();

    const handleSubmit = (data: IChangeEvent<object>) => {
       if (!newGameId || !currentSchemaId) {
        return;
       }

        gameConfigUpsertMutation.mutate({
            query: {
                gameId: newGameId,
                schemaId: currentSchemaId,
            },
            request: data.formData as object
        })
    }

    function renderCombobox() {
      if (gameConfigSchemaListQuery.isLoading) {
        return <div>Loading...</div>
      }

      return (
              <GameConfigSchemaCombobox 
                currentSchemaId={currentSchemaId} 
                setCurrentSchemaId={setCurrentSchemaId} 
                data={gameConfigSchemaListQuery.data?.data} 
              />
      )
    }

    function renderForm() {
      if (currentSchemaId === undefined) {
        return null;
      }

      if (gameConfigSchemaGetQuery.isLoading) {
        return <div>Loading...</div>
      }

      if (gameConfigSchemaGetQuery.isError) {
        return <div>Error</div>
      }

      if (!gameConfigSchemaGetQuery.data?.data) {
        return <div>No schema found</div>
      }

      return (
        <div className="[&_form]:space-y-4 mt-4">
          <Form schema={gameConfigSchemaGetQuery.data?.data?.schema ?? DEFAULT_SCHEMA} onSubmit={handleSubmit} validator={validator} />
        </div>
      )
    }
    

    return (
        <>
            <h5 className="scroll-m-20 text-2xl font-extrabold tracking-tight mb-4">
                New Game
            </h5>
            <Label htmlFor="newGameId" className="mb-2">Game ID</Label>
            <Input id="newGameId" className="mb-4 w-[200px]" type="number" value={newGameId ?? ""} onChange={(e) => setNewGameId(Number(e.target.value))} />
            {renderCombobox()}
            {renderForm()}
        </>
    )
}


