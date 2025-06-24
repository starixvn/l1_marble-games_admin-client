import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { AdminLayout } from "@/components/layouts/admin.layout";
import type { RJSFSchema } from '@rjsf/utils';
import { GameConfigSchemaCombobox } from '@/components/game-config-schema-combobox';
import { useGameConfigSchema } from '@/hooks/useGameConfigSchema';


export default function GameConfigsPage() {

    const { gameConfigSchemaGetQuery, currentSchemaId, setCurrentSchemaId, gameConfigSchemaListQuery } = useGameConfigSchema();

    function renderSchemaCombobox() {
        if (gameConfigSchemaListQuery.isLoading) {
            return <div>Loading...</div>
        }

        return <GameConfigSchemaCombobox
            currentSchemaId={currentSchemaId}
            setCurrentSchemaId={setCurrentSchemaId}
            data={gameConfigSchemaListQuery.data?.data}
        />
    }

    function renderSchemaForm() {
        if (currentSchemaId === null) {
            return <div>No schema selected</div>
        }
    
        if (gameConfigSchemaGetQuery.isLoading) {
            return <div>Loading...</div>
        }
    
        return <div className="[&_form]:space-y-4 mt-4">
                <Form schema={gameConfigSchemaGetQuery.data?.data?.schema as RJSFSchema} validator={validator} onSubmit={(data) => console.log(data.formData)} />
            </div>

    }


    return (
        <AdminLayout>
            <div className="p-6">
                {renderSchemaCombobox()}
                {renderSchemaForm()}
            </div>
        </AdminLayout>
    )
}