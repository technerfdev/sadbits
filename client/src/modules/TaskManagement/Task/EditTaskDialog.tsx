import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UpdateTaskDocument,
  type UpdateTaskMutation,
  type UpdateTaskMutationVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import type { Task } from "../TaskManagement.interfaces";
import TaskForm, { TaskResolver, TaskSchema } from "./TaskForm";

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const [updateTask, { loading }] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(gql(UpdateTaskDocument.toString()), {
    update: (cache, { data: mutationData }) => {
      cache.modify({
        id: cache.identify({ __typename: "Task", id: task.id }),
        fields: {
          ...mutationData,
        },
      });
    },
  });

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: TaskResolver,
    defaultValues: {
      ...task,
      projectId: task.projects?.id,
    },
    shouldFocusError: true,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>
        <TaskForm
          form={form}
          loading={loading}
          task={task}
          onDiscard={() => onOpenChange(false)}
          onSubmit={async (values) => {
            try {
              await updateTask({
                variables: {
                  task: {
                    id: task.id,
                    title: values.title,
                    description: values.description,
                    priority: values.priority,
                    dueDate: values.dueDate?.toISOString(),
                    projectId: values.projectId,
                  },
                },
              });
              onOpenChange(false);
              form.reset();
            } catch (e: any) {
              toast.error(e?.message || "Failed to update task");
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
