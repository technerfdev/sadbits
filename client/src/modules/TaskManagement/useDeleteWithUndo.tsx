import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { DeleteTaskDocument, type Task } from "@/gql/graphql";
import { gql } from "@apollo/client";
import { UndoToastDefault } from "./UndoToastDefault";

const DELETE_TASK_TIMEOUT = 3000; // 3 seconds

interface UseDeleteWithUndoOptions {
  onDelete?: (taskId: string) => void;
}

export function useDeleteWithUndo(options?: UseDeleteWithUndoOptions) {
  const [deleteTask] = useMutation(gql(DeleteTaskDocument.toString()));

  const deleteWithUndo = async (task: Task) => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const toastId = toast(
      <UndoToastDefault
        timeout={DELETE_TASK_TIMEOUT}
        onUndo={() => {
          clearTimeout(timeoutId);
          toast.dismiss(toastId);
        }}
      />,
      {
        duration: DELETE_TASK_TIMEOUT,
        position: "bottom-left",
        dismissible: false,
      }
    );

    timeoutId = setTimeout(async () => {
      try {
        await deleteTask({
          variables: { id: task.id },
          update: (cache) => {
            cache.evict({
              id: cache.identify({ __typename: "Task", id: task.id }),
            });
            cache.gc();
          },
        });
        toast.dismiss(toastId);
        options?.onDelete?.(task.id);
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }, DELETE_TASK_TIMEOUT);
  };

  return { deleteWithUndo };
}
