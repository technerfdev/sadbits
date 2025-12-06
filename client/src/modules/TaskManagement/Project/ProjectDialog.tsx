import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { type JSX } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const createProjectSchema = z.object({
  taskName: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

type ProjectType = z.infer<typeof createProjectSchema>;

const createProjectResolver = zodResolver(createProjectSchema);

export default function ProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}): JSX.Element {
  const form = useForm<ProjectType>({
    resolver: createProjectResolver,
    defaultValues: { taskName: "" },
    shouldFocusError: true,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              // Handle submit here
            })}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Never-End-123" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="..."
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  disabled={form.formState.isSubmitting}
                >
                  Discard
                </Button>
              </DialogClose>
              <Button type="submit">
                {/* {loading && <Spinner />} */}
                <Typography>Submit</Typography>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
