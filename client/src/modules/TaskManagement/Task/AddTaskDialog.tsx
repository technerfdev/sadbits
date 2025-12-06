import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreateTaskDocument,
  GetTasksDocument,
  PriorityType,
  type CreateTaskMutation,
  type CreateTaskMutationVariables,
} from "@/gql/graphql";
import { useCurrentTimezone } from "@/hooks/useCurrentTimezone";
import { gql } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { TZDate } from "@date-fns/tz";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import TaskForm from "./TaskForm";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .optional()
    .nullable(),
  priority: z.enum(PriorityType).nullable(),
  dueDate: z.coerce.date().nullable(),
});

const CreateTaskResolver = zodResolver(createTaskSchema);

export default function AddTaskDialog({
  open,
  onOpenChange,
  onError,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onError?: (e: unknown) => void;
}) {
  const client = useApolloClient();
  const { timezone } = useCurrentTimezone();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: CreateTaskResolver,
    shouldFocusError: true,
    defaultValues: {
      title: "",
      description: undefined,
      priority: PriorityType.Low,
      dueDate: null,
    },
  });

  const [createTask, { loading }] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(gql(CreateTaskDocument.toString())); // TODO: optimize by update cache instead of refrech

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>

        <TaskForm
          form={form}
          loading={loading}
          onSubmit={async (values) => {
            try {
              const newTask = {
                ...values,
                priority: values.priority,
                dueDate:
                  values.dueDate &&
                  new TZDate(values.dueDate, timezone).toISOString(),
              };
              const created = await createTask({
                variables: { task: newTask },
              });
              if (!created || !created.data?.createTask.id) {
                toast.error("Can not create new task");
                return;
              }
              await client.refetchQueries({
                include: [gql(GetTasksDocument.toString())],
              });
              onOpenChange(false);
              form.reset();
            } catch (e) {
              onError?.(e);
            }
          }}
          onDiscard={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
