import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DeleteTaskDocument,
  PriorityType,
  UpdateTaskDocument,
  type UpdateTaskMutation,
  type UpdateTaskMutationVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { ContextMenuItem } from "@radix-ui/react-context-menu";
import { Flag } from "lucide-react";
import EditTaskDialog from "./Task/EditTaskDialog";
import type { Task } from "./TaskManagement.interfaces";
import { toast } from "sonner";

function PriorityFlag({ priority }: { priority: PriorityType }) {
  switch (priority) {
    case PriorityType.High:
      return <Flag color="red" size="0.8rem" fill="red" />;
    case PriorityType.Medium:
      return <Flag color="orange" size="0.8rem" fill="orange" />;
    default:
      return <Flag color="grey" size="0.8rem" fill="grey" />;
  }
}

export default function TaskRow({ task }: { task: Task; selected?: boolean }) {
  const [deleteTask] = useMutation(gql(DeleteTaskDocument.toString()), {
    update: (cache) => {
      cache.evict({
        id: cache.identify({ __typename: "Task", id: task.id }),
      });
      cache.gc();
    },
  });

  const [updateTask, { loading: updating }] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(gql(UpdateTaskDocument.toString()), {
    update: (cache, { data: mutationData }) => {
      cache.modify({
        id: cache.identify({ __typename: "Task", id: task.id }),
        fields: {
          completed: () => Boolean(mutationData?.updateTask.completed),
        },
      });
    },
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="group flex items-start gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors border border-transparent hover:border-border/40">
          <Checkbox
            id={task.id}
            checked={task.completed}
            disabled={updating}
            className="mt-0.5"
            onCheckedChange={async (checked) => {
              await updateTask({
                variables: {
                  task: {
                    id: task.id,
                    completed: Boolean(checked),
                  },
                },
              });
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm leading-tight">
              {task.title}
            </div>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </span>
              {task.priority && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <PriorityFlag priority={task.priority} />
                    {task.priority}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-40 rounded-lg border border-border/50 bg-popover p-1 shadow-lg">
        <ContextMenuItem className="px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent focus:bg-accent transition-colors outline-none">
          <EditTaskDialog task={task} />
        </ContextMenuItem>
        <ContextMenuItem
          className="px-2 py-1.5 rounded-md cursor-pointer hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors outline-none"
          onClick={async () => {
            const res = await deleteTask({ variables: { id: task.id } });
            if (!res.data) {
              toast.error("failed");
              return;
            }

            toast.success("deleted");
          }}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
