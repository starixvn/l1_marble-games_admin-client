import Form from '@rjsf/shadcn';
import validator from '@rjsf/validator-ajv8';
import { AdminLayout } from "@/components/layouts/admin.layout";
import type { RJSFSchema } from '@rjsf/utils';

const schema: RJSFSchema = {
    "title": "Marble soccer",
    "description": "Game config for the marble leagues",
    "type": "object",
    "properties": {
        "enabled": {
            "type": "boolean",
            "description": "Whether the game is enabled"
        },
        "teams": {
            "type": "array",
            "description": "List of team names",
            "items": {
                "type": "string"
            }
        },
        "numberOfVideos": {
            "type": "object",
            "description": "Number of videos for each result sequence",
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
                <div className="[&_form]:space-y-4">
                    <Form schema={schema} validator={validator} onSubmit={(data) => console.log(data.formData)} />
                </div>
            </div>
        </AdminLayout>
    )
}