import { useParams } from "react-router";
import { GameConfigTable } from "../components/game-config-table";
import { AdminLayout } from "../components/layouts/admin.layout";
import { useGameConfig } from "@/hooks/useGameConfig";
import { GameConfigForm } from "../components/game-config-form";
import NewGameForm from "../components/new-game-form";

export default function GameConfigsPage() {
    const { gameConfigQuery } = useGameConfig();
    const { gameId } = useParams<{ gameId: string }>();

    function renderGameConfigTable() {
        if (gameConfigQuery.isLoading) {
            return <div>Loading...</div>
        }
        
        return <GameConfigTable data={gameConfigQuery.data?.data} />
    }

    function renderGameConfigForm() {
        if (!gameId) {
            return null
        }

        if (Number.isNaN(Number(gameId))) {
            return <NewGameForm />
        }

        return <GameConfigForm gameId={Number(gameId)} />
    }

    return (
        <AdminLayout>
                {renderGameConfigTable()}
            <div className="mx-2">
                {renderGameConfigForm()}
            </div>
        </AdminLayout>
    )
}