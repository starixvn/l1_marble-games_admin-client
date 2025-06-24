import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { AdminLayout } from "@/components/layouts/admin.layout";
import type { RJSFSchema } from '@rjsf/utils';
import { GameConfigSchemaCombobox } from '@/components/game-config-schema-combobox';

const schema: RJSFSchema = {
    "title": "Marble soccer",
    "description": "Game config for the marble leagues",
    "type": "object",
    "properties": {
        "enabled": {
            "title": "Enabled",
            "type": "boolean",
        },
        "teams": {
            "type": "array",
            "title": "Teams",
            "items": {
                "type": "string"
            }
        },
        "numberOfVideos": {
            "title": "Number of videos",
            "type": "object",
            "additionalProperties": {
                "type": "number"
            }
        }
    },
    "required": ["enabled", "teams", "numberOfVideos"],
    "additionalProperties": false
}


export default function GameConfigsPage() {
    return (
        <AdminLayout>
            <div className="p-6">
                <GameConfigSchemaCombobox/>
                <div className="[&_form]:space-y-4 mt-4">
                    <Form schema={schema} validator={validator} onSubmit={(data) => console.log(data.formData)} />
                </div>
            </div>
        </AdminLayout>
    )
}