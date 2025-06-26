import { AdminLayout } from "@/components/layouts/admin.layout";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { JsonEditorWithDragDrop } from "../components/json-editor-with-drag-drop";
import { useState, useEffect } from "react";
import { useGameConfigSchemaWithId, useGameConfigSchemaList, useGameConfigSchemaUpsert } from "@/hooks/useGameConfigSchema";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

export default function GameConfigSchemaPage() {
  return (
    <AdminLayout>
      <GameConfigSchemaTable />
    </AdminLayout>
  )
}


function GameConfigSchemaTable() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | undefined>(undefined);
  const { gameConfigSchemaListQuery } = useGameConfigSchemaList();
  const { gameConfigSchemaUpsertMutation } = useGameConfigSchemaUpsert();
  
  function handleEdit(id?: string) {
    setSelectedSchemaId(id);
    setEditDialogOpen(true);
  }

  function handleSubmit(json: object, name: string) {
    const fullRequest = {
      query: {
        id: selectedSchemaId
      },
      request: {
        name: name,
        schema: json,
      }
    }
    console.log(fullRequest);
    gameConfigSchemaUpsertMutation.mutate(fullRequest, {
      onSuccess: () => {
        toast.success('Schema updated successfully');
        setEditDialogOpen(false);
        gameConfigSchemaListQuery.refetch();
  
      },
      onError: () => {
        toast.error('Failed to update schema');
      }
    });
  }

  const schemas = gameConfigSchemaListQuery.data?.data || [];

  return (
    <>
      <div className="overflow-hidden rounded-lg border m-2">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableCell className="px-6 font-bold">Schema Id</TableCell>
                          <TableCell className="px-6 font-bold">Name</TableCell>
                          <TableCell className="font-bold">Actions</TableCell>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                  {schemas.map((item: any) => (
                      <TableRow key={item.id}>
                          <TableCell className="px-6">{item.id}</TableCell>
                          <TableCell className="px-6">{item.name}</TableCell>
                          <TableCell className="flex gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleEdit(item.id)}>
                                  <IconEdit />
                              </Button>
                          </TableCell>
                      </TableRow>
                  ))}
                                     <TableRow>
                   <TableCell className="px-6">New</TableCell>
                   <TableCell className="px-6">New</TableCell>
                   <TableCell className="flex gap-2">
                                           <Button variant="outline" size="icon" onClick={() => handleEdit()}>
                        <IconPlus className="text-green-500" />
                      </Button>
                   </TableCell>
                   </TableRow>
                  </TableBody>
              </Table>
          </div>
      
      <GameConfigSchemaEditDialog
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        id={selectedSchemaId}
        onSubmit={handleSubmit}
      />
    </>
  )
}

function GameConfigSchemaEditDialog({
  isOpen,
  onOpenChange,
  id,
  onSubmit,
}: Readonly<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  onSubmit: (json: object, name: string) => void;
}>) {
  const { gameConfigSchemaGetQuery } = useGameConfigSchemaWithId({ id: id });
  const [json, setJson] = useState<string>('{}');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (gameConfigSchemaGetQuery.data?.data?.schema && id && gameConfigSchemaGetQuery.data?.data?.name) {
      const initialJson = JSON.stringify(gameConfigSchemaGetQuery.data.data.schema, null, 2);
      setJson(initialJson);
      setName(gameConfigSchemaGetQuery.data.data.name);
    } 
    else if (isOpen) {
      setJson('{}');
      setName('');
    }
  }, [gameConfigSchemaGetQuery.data?.data?.schema, isOpen]);

  const handleSubmit = () => {
    try {
      if (name.trim() === '') {
        toast.error('Name is required');
        return;
      }
      const schema = JSON.parse(json);
      onSubmit(schema, name);
      if (id) {
        gameConfigSchemaGetQuery.refetch();
      }
    } catch {
      toast.error('Invalid JSON format');
    }
  }

  function renderNameTextBox() {
    if (gameConfigSchemaGetQuery.isLoading) {
      return <div className="flex flex-col gap-2 mb-4">
        <Skeleton className="h-10 w-full" />
      </div>
    }

    if (gameConfigSchemaGetQuery.isError) {
      return <div> Error</div>
    }

    return (
      <div className="flex flex-col gap-2 mb-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1280px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>Game Config Schema Editor</DialogTitle>
          <DialogDescription>Game Config Schema for schema id {id}</DialogDescription>
          <DialogDescription>Paste json below or drag and drop file</DialogDescription>
        </DialogHeader>
        {renderNameTextBox()}
        <JsonEditorWithDragDrop
          value={json}
          onChange={setJson}
          isLoading={gameConfigSchemaGetQuery.isLoading}
          isError={gameConfigSchemaGetQuery.isError}
        />
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
