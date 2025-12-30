import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ItemGroup } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import {
  GetProjectsDocument,
  GetTasksDocument,
  type GetProjectsQuery,
  type GetProjectsQueryVariables,
  type GetTasksQuery,
  type GetTasksQueryVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { FolderIcon, FolderOpenIcon, PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import ProjectDialog from "./Project/ProjectDialog";
import ProjectItemRow from "./Project/ProjectItemRow";
import AddTaskDialog from "./Task/AddTaskDialog";
import TaskRow from "./TaskRow";
import EmptyTasksIllustration from "@/components/illustrations/EmptyTasksIllustration";

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
  const [openAddTask, setOpenAddTask] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [folderOpening, setFolderOpening] = useState<string | null>(null);

  const { data, refetch, loading } = useQuery<
    GetTasksQuery,
    GetTasksQueryVariables
  >(gql(GetTasksDocument.toString()), {
    fetchPolicy: "cache-and-network",
  });

  const { data: projectsData } = useQuery<
    GetProjectsQuery,
    GetProjectsQueryVariables
  >(gql(GetProjectsDocument.toString()), {
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
      <div className="grid grid-cols-[10rem_1fr]">
        {projectsData?.projects && (
          <ul>
            {projectsData?.projects.map((p) => (
              <ProjectItemRow
                key={p.id}
                project={p}
                onClick={() => {
                  if (folderOpening === p.id) {
                    setFolderOpening(null);
                    return;
                  }
                  setFolderOpening(p.id);
                }}
                icon={
                  folderOpening === p.id ? <FolderOpenIcon /> : <FolderIcon />
                }
              />
            ))}
          </ul>
        )}
        <ItemGroup className="gap-2">
          {!data?.tasks.length ? (
            <div data-testid="no-task-ctn" className="p-6">
              <EmptyTasksIllustration />
              <div className="flex justify-center mt-4">
                <Button onClick={() => setOpenAddTask(true)}>
                  Create Task
                </Button>
              </div>
              <AddTaskDialog
                open={openAddTask}
                onOpenChange={(open) => setOpenAddTask(open === true)}
              />
            </div>
          ) : (
            !loading &&
            data?.tasks?.map((task) => <TaskRow key={task.id} task={task} />)
          )}
        </ItemGroup>
      </div>
    </div>
  );
}
