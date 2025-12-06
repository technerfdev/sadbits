import DatePickerWithLabel from "@/components/FormFields/DatePickerWithLabel";
import InputWithLabel from "@/components/FormFields/InputWithLabel";
import TextareaWithLabel from "@/components/FormFields/TextareaWithLabel";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { JSX } from "react/jsx-runtime";
import { toast } from "sonner";
import { z } from "zod";
import type { Task } from "../TaskManagement.interfaces";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  completed: z.boolean().optional(),
  priority: z.string().optional().nullable(),
  dueDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  assignedTo: z.array(z.string()).optional(),
  author: z.string().optional().nullable(),
});

const resolver = zodResolver(schema);

const standardizeInput = (task: Task) => {
  return {
    ...task,
    title: task.title || "",
    description: task.description || "",
  };
};

/** @deprecated */
export default function TaskDialog({
  task = undefined,
  open,
  onClose,
}: {
  task?: Task;
  open: boolean;
  onClose?: (needRefresh?: boolean) => void;
}): JSX.Element | null {
  const form = useForm<z.input<typeof schema>>({
    resolver,
    defaultValues: task ? standardizeInput(task) : undefined,
    shouldFocusError: true,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.input<typeof schema>> = async (data) => {
    // handle submit
    try {
      // await createTask(data);
      // onClose?.(true);
      console.log(data);
      // Added
    } catch (e) {
      toast(e.message);
    }
  };

  const handleClose = () => {
    if (isDirty && !window.confirm("Discard changes?")) {
      window.confirm("Discard changes?") && onClose?.();
    }
    onClose?.();
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open}>
      <form id="task-edit-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent aria-describedby="task-edit-form">
          <DialogHeader>
            <DialogTitle>{task ? "Edit" : "Create new task"}</DialogTitle>
          </DialogHeader>
          <div className="flex-col gap-4 flex">
            <InputWithLabel label="Title" name="title" control={control} />
            <DatePickerWithLabel
              label="Due date"
              name="dueDate"
              control={control}
            />
            <TextareaWithLabel
              label="Description"
              name="description"
              control={control}
            />
          </div>

          <div className="flex gap-2 align-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {task ? (
                <Typography>Submit</Typography>
              ) : (
                <Typography>Create new</Typography>
              )}
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
