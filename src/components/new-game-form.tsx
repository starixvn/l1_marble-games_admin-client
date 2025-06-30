import { useState } from 'react'
import { useGameConfigSchema } from '@/hooks/useGameConfigSchema'
import { GameConfigSchemaCombobox } from '@/components/game-config-schema-combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Form from '@rjsf/shadcn'
import { validatorWithDataSupport } from '@/lib/validator'
import { DEFAULT_SCHEMA } from '@/shared/const'
import { useGameConfig } from '@/hooks/useGameConfig'
import type { IChangeEvent } from '@rjsf/core'
import { Button } from './ui/button'
import { CodeXml } from 'lucide-react'
import { JsonEditorDialog } from '@/components/json-editor-dialog'
import { apply } from 'json-merge-patch'
import { toast } from 'sonner'

export default function NewGameForm() {
  const { gameConfigSchemaListQuery, currentSchemaId, setCurrentSchemaId, gameConfigSchemaGetQuery } =
    useGameConfigSchema({})
  const [newGameId, setNewGameId] = useState<number | null>(null)
  const { gameConfigUpsertMutation } = useGameConfig()
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false)
  const [json, setJson] = useState<string>('{}')
  const [currentFormData, setCurrentFormData] = useState<object>({})
  const [formKey, setFormKey] = useState<number>(0)

  const handleSubmit = () => {
    if (!newGameId || !currentSchemaId) {
      return
    }

    const request = {
      query: {
        gameId: newGameId,
        schemaId: currentSchemaId,
      },
      request: currentFormData,
    }
    console.log(request)

    gameConfigUpsertMutation.mutate(request, {
      onSuccess: () => {
        toast.success('Game config created')
      },
      onError: () => {
        toast.error('Failed to create game config')
      },
    })
  }

  const handleJsonEditorSubmit = (jsonString: string) => {
    setCurrentFormData({ ...apply(currentFormData, JSON.parse(jsonString)) })
    setFormKey((prev) => prev + 1) // fix bug form data not updated when form data is changed, this is library bug
    setJson('{}')
  }

  const handleFormChange = (data: IChangeEvent<object>) => {
    setCurrentFormData({ ...(data.formData as object) })
  }

  function renderComboboxAndJsonEditor() {
    if (gameConfigSchemaListQuery.isLoading) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <div className="flex items-center gap-2">
          <GameConfigSchemaCombobox
            currentSchemaId={currentSchemaId as string}
            setCurrentSchemaId={setCurrentSchemaId as (id: string | null) => void}
            data={gameConfigSchemaListQuery.data?.data}
          />
          <Button variant="outline" size="icon" onClick={() => setIsJsonEditorOpen(true)}>
            <CodeXml
              className="h-4 w-4 text-blue-500 drop-shadow-lg"
              strokeWidth={3}
              style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))' }}
            />
          </Button>
        </div>
        <JsonEditorDialog
          isOpen={isJsonEditorOpen}
          onOpenChange={setIsJsonEditorOpen}
          initialValue={json}
          onSubmit={handleJsonEditorSubmit}
          title="New Game Config"
          description="Paste json below or drag and drop file"
          isLoading={gameConfigSchemaGetQuery.isLoading}
          isError={gameConfigSchemaGetQuery.isError}
        />
      </div>
    )
  }

  function renderForm() {
    if (currentSchemaId === undefined) {
      return null
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
        <Form
          key={formKey}
          formData={currentFormData}
          onChange={handleFormChange}
          schema={gameConfigSchemaGetQuery.data?.data?.schema ?? DEFAULT_SCHEMA}
          validator={validatorWithDataSupport}
          onSubmit={handleSubmit}
          liveValidate
        />
      </div>
    )
  }

  return (
    <>
      <h5 className="scroll-m-20 text-2xl font-extrabold tracking-tight mb-4">New Game</h5>
      <Label htmlFor="newGameId" className="mb-2">
        Game ID
      </Label>
      <Input
        id="newGameId"
        className="mb-4 w-[200px]"
        type="number"
        value={newGameId ?? ''}
        onChange={(e) => setNewGameId(Number(e.target.value))}
      />
      {renderComboboxAndJsonEditor()}
      {renderForm()}
    </>
  )
}
