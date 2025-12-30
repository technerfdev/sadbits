import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  DeleteProjectDocument,
  DuplicateProjectDocument,
  GetProjectsDocument,
  UpdateProjectDocument,
  type DeleteProjectMutation,
  type DeleteProjectMutationVariables,
  type DuplicateProjectMutation,
  type DuplicateProjectMutationVariables,
  type UpdateProjectMutation,
  type UpdateProjectMutationVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CopyIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProjectType } from "./project.type";

interface ProjectItemRowProps {
  project: Pick<ProjectType, "name" | "description" | "id">;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactNode;
}

export default function ProjectItemRow({
  project,
  onClick,
  icon,
}: ProjectItemRowProps) {
  const [mode, setMode] = useState<"renaming" | "duplicating" | null>(null);
  const [tempName, setTempName] = useState<string>(project.name);

  const [updateProject] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(gql(UpdateProjectDocument.toString()), {
    optimisticResponse: (variables) => ({
      updateProject: {
        __typename: "Project",
        name: tempName,
        id: variables.project.id,
        description: variables.project.description,
      },
    }),
    update: (cache, { data }) => {
      if (!data?.updateProject.id) return;
      cache.modify({
        id: cache.identify(data.updateProject),
        fields: {
          name() {
            return tempName;
          },
        },
      });
    },
  });

  const [deleteProject, { loading: deleting }] = useMutation<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >(gql(DeleteProjectDocument.toString()), {
    update: (cache, { data: deleteData }) => {
      if (!deleteData?.deleteProject.success) return;
      cache.evict({
        id: cache.identify({ __typename: "Project", id: project.id }),
      });
    },
  });

  const [duplicateProject] = useMutation<
    DuplicateProjectMutation,
    DuplicateProjectMutationVariables
  >(gql(DuplicateProjectDocument.toString()), {
    refetchQueries: [
      {
        query: gql(GetProjectsDocument.toString()),
      },
    ],
  });

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === "function") {
      const IconComponent = icon as React.ComponentType<
        React.SVGProps<SVGSVGElement>
      >;
      return <IconComponent className="mr-2 h-4 w-4" />;
    }

    return <span className="mr-2">{icon}</span>;
  };

  useEffect(() => {
    const handleExistWhileRenaming = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Escape" && mode === "renaming") {
      }
    };
    window.addEventListener("keydown", handleExistWhileRenaming);

    return () => {
      window.removeEventListener("keydown", handleExistWhileRenaming);
    };
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {mode === "renaming" ? (
          <div className="px-3 py-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <div className="flex gap-0.5 pt-1.5">
              <Button
                size={"tiny"}
                variant={"ghost"}
                onClick={() => {
                  setMode(null);
                }}
              >
                Cancel
              </Button>
              <Button
                size="tiny"
                onClick={async () => {
                  await updateProject({
                    variables: { project: { id: project.id, name: tempName } },
                  });
                  setMode(null);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer border border-transparent hover:border-border/40">
            <button
              onClick={onClick}
              className="flex items-center gap-2 w-full text-left"
            >
              {renderIcon()}
              <span>{project.name}</span>
            </button>
          </div>
        )}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setMode("renaming")}>
          Rename
        </ContextMenuItem>
        <ContextMenuItem
          onClick={async () => {
            await duplicateProject({ variables: { projectId: project.id } });
          }}
        >
          <CopyIcon />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          className="hover:text-red-500"
          onClick={() =>
            deleteProject({ variables: { projectId: project.id } })
          }
          disabled={deleting}
        >
          <TrashIcon />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
