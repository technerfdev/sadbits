import DatePicker from "@/components/GenericFields/DatePicker";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  GetProjectsDocument,
  PriorityType,
  type GetProjectsQuery,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag } from "lucide-react";
import { type JSX } from "react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import type { Task } from "../TaskManagement.interfaces";
import { useDeleteWithUndo } from "../useDeleteWithUndo";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  priority: z
    .enum(PriorityType)
    .optional()
    .nullable()
    .default(PriorityType.Low),
  dueDate: z.coerce.date().optional().nullable(),
  tag: z.array(z.string()).optional().nullable(),
  description: z
    .string()
    .min(1, "Description is required")
    .optional()
    .nullable(),
  projectId: z.string().optional().nullable(),
});

const resolver = zodResolver(schema);

export { resolver as TaskResolver, schema as TaskSchema };

export default function TaskForm({
  form,
  task,
  loading,
  onSubmit,
}: {
  form: UseFormReturn<z.infer<typeof schema>>;
  loading: boolean;
  task?: Task;
  onDiscard: () => void;
  onSubmit: (value: z.infer<typeof schema>) => void;
}): JSX.Element {
  const { data: projectsData } = useQuery<GetProjectsQuery>(
    gql(GetProjectsDocument.toString())
  );
  const { deleteWithUndo } = useDeleteWithUndo();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex-col gap-4 flex pt-4">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="flex items-center">
                    Title
                    <span className="text-red-500"> *</span>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-2 grid-cols-[10rem_1fr]">
            <FormField
              name="priority"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="low">
                            <Flag color="grey" fill="grey" />
                            Low
                          </SelectItem>
                          <SelectItem value="medium">
                            <Flag color="orange" fill="orange" />
                            Medium
                          </SelectItem>
                          <SelectItem value="high">
                            <Flag color="red" fill="red" />
                            High
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date</FormLabel>
                  <FormControl>
                    <DatePicker
                      fullWidth
                      date={field.value}
                      onDateChange={(d: Date) => {
                        console.log(d);
                        field.onChange(d);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="projectId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {projectsData?.projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-8">
          <Button
            variant={"destructive"}
            onClick={() => task && deleteWithUndo(task)}
            className="mr-auto"
            disabled={!task || loading}
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" disabled={form.formState.isSubmitting}>
              Discard
            </Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner />}
            {task ? (
              <Typography>Update</Typography>
            ) : (
              <Typography>Create new</Typography>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
