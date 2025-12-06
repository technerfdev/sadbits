import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  UpdateTaskDocument,
  type UpdateTaskMutation,
  type UpdateTaskMutationVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import TaskForm, { TaskResolver, TaskSchema } from "./TaskForm";
import type { Task } from "../TaskManagement.interfaces";

interface EditTaskDialogProps {
  task: Task;
}

export default function EditTaskDialog({ task }: EditTaskDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [updateTask, { loading }] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(gql(UpdateTaskDocument.toString()));

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: TaskResolver,
    defaultValues: task,
    shouldFocusError: true,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <TaskForm
          form={form}
          loading={loading}
          task={task}
          onDiscard={() => setOpen(false)}
          onSubmit={async (values) => {
            try {
              await updateTask({
                variables: {
                  task: {
                    ...values,
                  },
                },
              });
              setOpen(false);
              form.reset();
            } catch (e) {
              toast.error(e?.message);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
