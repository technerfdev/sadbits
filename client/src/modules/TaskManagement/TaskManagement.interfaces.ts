import type { Task as TaskType } from "@/gql/graphql";

export interface Task extends Omit<TaskType, "__typename"> {}
