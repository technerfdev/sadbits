import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  DeleteTaskDocument,
  GetTasksDocument,
  PriorityType,
  UpdateTaskDocument,
  type GetTasksQuery,
  type GetTasksQueryVariables,
  type UpdateTaskMutation,
  type UpdateTaskMutationVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Flag, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { toast } from "sonner";
import AddTaskDialog from "./Task/AddTaskDialog";
import EditTaskDialog from "./Task/EditTaskDialog";
import type { Task } from "./TaskManagement.interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Typography from "@/components/Typography";
import ProjectDialog from "./Project/ProjectDialog";

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

function TaskRow({ task }: { task: Task; selected?: boolean }): JSX.Element {
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
    <Item
      key={`${task.id}-${task.updatedAt}`}
      variant="outline"
      size="sm"
      className="flex justify-center items-start"
    >
      <ItemActions>
        <Checkbox
          id={task.id}
          checked={task.completed}
          disabled={updating}
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
      </ItemActions>
      <ItemContent>
        <Label htmlFor={task.id} className="font-semibold">
          {task.title}
        </Label>
        {task.description && <p className="text-sm">{task.description}</p>}
        <p className="text-xs text-gray-500 flex whitespace-nowrap gap-0.5">
          Due:{" "}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"} |
          <span className="flex items-center gap-0.5">
            Priority:
            {task.priority ? (
              <span className="flex items-center gap-0.5">
                <PriorityFlag priority={task.priority} />
                {task.priority.toUpperCase()}
              </span>
            ) : (
              "N/A"
            )}
          </span>
        </p>
      </ItemContent>
      <ItemActions>
        <div className="flex gap-1">
          <EditTaskDialog task={task} />
          <Button
            size="icon-sm"
            variant="ghost"
            className="hover:text-red-600"
            onClick={async () => {
              const res = await deleteTask({ variables: { id: task.id } });
              if (!res.data) {
                toast.error("failed");
                return;
              }

              toast.success("deleted");
            }}
          >
            <Trash2Icon />
          </Button>
        </div>
      </ItemActions>
    </Item>
  );
}

function NewActions(): JSX.Element {
  const [opening, setOpening] = useState<"task" | "project" | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <PlusCircleIcon />
            <Typography>Create New</Typography>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpening("task")}>
            Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpening("project")}>
            Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddTaskDialog
        open={opening === "task"}
        onOpenChange={(open) => setOpening(open === true ? "task" : null)}
      />
      <ProjectDialog
        open={opening === "project"}
        onOpenChange={(open) => setOpening(open === true ? "project" : null)}
      />
    </>
  );
}

export default function TaskManagement(): JSX.Element {
  const [search, setSearch] = useState<string | null>(null);

  const { data, refetch, loading } = useQuery<
    GetTasksQuery,
    GetTasksQueryVariables
  >(gql(GetTasksDocument.toString()), {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(() => {
      refetch({
        filterBy: {
          search,
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);
  return (
    <div className="flex-1 flex-col pl-2 pr-2 space-y-4">
      <div className="flex flex-1 items-center gap-2">
        <NewActions />
        <div className="flex ">
          <InputGroup>
            <InputGroupInput
              placeholder="Task title ... "
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading && (
              <InputGroupAddon align="inline-end">
                <Spinner />
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>
      </div>
      <ItemGroup className="gap-2">
        {!data?.tasks.length ? (
          <span>No task</span>
        ) : (
          !loading &&
          data?.tasks?.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </ItemGroup>
    </div>
  );
}
