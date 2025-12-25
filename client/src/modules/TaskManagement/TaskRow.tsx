import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DeleteTaskDocument,
  GetProjectsDocument,
  PriorityType,
  UpdateTaskDocument,
  type GetProjectsQuery,
  type UpdateTaskMutation,
  type UpdateTaskMutationVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Flag, FolderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditTaskDialog from "./Task/EditTaskDialog";
import type { Task } from "./TaskManagement.interfaces";
import { ContextMenuSub } from "@radix-ui/react-context-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePomodoroContext } from "../Pomodoro/PomodoroContext";
import { Button } from "@/components/ui/button";

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
  const { onStart: startPomodoro, state } = usePomodoroContext();
  const [hovering, setHovering] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [pendingSession, setPendingSession] = useState<number | null>(null);
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
          projects: () => mutationData?.updateTask.projects,
        },
      });
    },
  });

  const { data: projectsData } = useQuery<GetProjectsQuery>(
    gql(GetProjectsDocument.toString())
  );

  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date() && !task.completed
    : false;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger
          asChild
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          data-testid="task-row-trigger"
        >
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
                      {task.priority.toUpperCase()}
                    </span>
                  </>
                )}
                {isOverdue && (
                  <>
                    <span>•</span>
                    <span className="text-red-500">Overdue</span>
                  </>
                )}
                {task.projects && (
                  <>
                    <span>•</span>
                    <span className="flex gap-1 items-center justify-center">
                      <FolderIcon className="w-4" />
                      {task.projects.name}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="ml-auto justify-center items-center flex">
              {hovering && (
                <Popover>
                  <PopoverTrigger>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer"
                          data-testid="start-pomodoro-icon"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.694a1.125 1.125 0 010 1.972l-11.54 6.694c-.75.412-1.667-.13-1.667-.986V5.653z"
                          />
                        </svg>
                      </TooltipTrigger>
                      <TooltipContent>Start session</TooltipContent>
                    </Tooltip>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="space-y-1.5">
                      {Array.from([25, 30, 45, 60]).map((mins) => (
                        <div
                          key={mins}
                          className="px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent transition-colors outline-none"
                          onClick={() => {
                            if (state !== "completed") {
                              setPendingSession(mins);
                            } else {
                              startPomodoro(mins as any, task.id, task.title);
                            }
                          }}
                        >
                          {mins}m
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-40 rounded-lg border border-border/50 bg-popover p-1 shadow-lg">
          <ContextMenuItem
            inset
            className="px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent focus:bg-accent transition-colors outline-none"
            onClick={() => setEditing(true)}
          >
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            inset
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
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Move</ContextMenuSubTrigger>
            <ContextMenuContent className="min-w-40 rounded-lg border border-border/50 bg-popover p-1 shadow-lg">
              <ContextMenuGroup>
                <ContextMenuLabel>Projects</ContextMenuLabel>
                <Separator />
                {projectsData?.projects.map((project) => (
                  <ContextMenuItem
                    key={project.id}
                    className="px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent focus:bg-accent transition-colors outline-none"
                    onClick={async () => {
                      const res = await updateTask({
                        variables: {
                          task: {
                            id: task.id,
                            projectId: project.id,
                          },
                        },
                      });

                      if (!res.data) {
                        toast.error("Failed to move task");
                        return;
                      }

                      toast.success(`Moved to ${project.name}`);
                    }}
                  >
                    {project.name}
                  </ContextMenuItem>
                ))}
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
      {pendingSession && (
        <Dialog
          open={!!pendingSession}
          onOpenChange={() => setPendingSession(null)}
        >
          <DialogContent>
            <p>A Pomodoro session is already running. Start a new one?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setPendingSession(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  startPomodoro(pendingSession as any, task.id, task.title);
                  setPendingSession(null);
                }}
              >
                Start New
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <EditTaskDialog task={task} open={editing} onOpenChange={setEditing} />
    </>
  );
}
