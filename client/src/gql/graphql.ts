/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateTaskInputDto = {
  assignedTo?: InputMaybe<Array<Scalars['String']['input']>>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<PriorityType>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteTaskResponse = {
  __typename?: 'DeleteTaskResponse';
  success: Scalars['Boolean']['output'];
};

export type FilterBy = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  deletedOnly?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTask: Task;
  deleteTask: DeleteTaskResponse;
  updateTask: Task;
};


export type MutationCreateTaskArgs = {
  task: CreateTaskInputDto;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTaskArgs = {
  task: UpdateTaskInput;
};

/** Task priority levels */
export enum PriorityType {
  High = 'high',
  Low = 'low',
  Medium = 'medium'
}

export type Query = {
  __typename?: 'Query';
  projects: Scalars['String']['output'];
  task: Task;
  tasks: Array<Task>;
};


export type QueryTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTasksArgs = {
  filterBy?: InputMaybe<FilterBy>;
};

export type Task = {
  __typename?: 'Task';
  archived?: Maybe<Scalars['Boolean']['output']>;
  author?: Maybe<Scalars['String']['output']>;
  completed: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  priority?: Maybe<PriorityType>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UpdateTaskInput = {
  assignedTo?: InputMaybe<Array<Scalars['String']['input']>>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  priority?: InputMaybe<PriorityType>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  updatedBy?: InputMaybe<Scalars['String']['input']>;
};

export type TaskFragmentFragment = { __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null };

export type CreateTaskMutationVariables = Exact<{
  task: CreateTaskInputDto;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null } };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: { __typename?: 'DeleteTaskResponse', success: boolean } };

export type UpdateTaskMutationVariables = Exact<{
  task: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask: { __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null } };

export type GetTasksQueryVariables = Exact<{
  filterBy?: InputMaybe<FilterBy>;
}>;


export type GetTasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const TaskFragmentFragmentDoc = new TypedDocumentString(`
    fragment TaskFragment on Task {
  id
  title
  description
  priority
  completed
  dueDate
}
    `, {"fragmentName":"TaskFragment"}) as unknown as TypedDocumentString<TaskFragmentFragment, unknown>;
export const CreateTaskDocument = new TypedDocumentString(`
    mutation CreateTask($task: CreateTaskInputDto!) {
  createTask(task: $task) {
    ...TaskFragment
  }
}
    fragment TaskFragment on Task {
  id
  title
  description
  priority
  completed
  dueDate
}`) as unknown as TypedDocumentString<CreateTaskMutation, CreateTaskMutationVariables>;
export const DeleteTaskDocument = new TypedDocumentString(`
    mutation DeleteTask($id: ID!) {
  deleteTask(id: $id) {
    success
  }
}
    `) as unknown as TypedDocumentString<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const UpdateTaskDocument = new TypedDocumentString(`
    mutation UpdateTask($task: UpdateTaskInput!) {
  updateTask(task: $task) {
    ...TaskFragment
  }
}
    fragment TaskFragment on Task {
  id
  title
  description
  priority
  completed
  dueDate
}`) as unknown as TypedDocumentString<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const GetTasksDocument = new TypedDocumentString(`
    query GetTasks($filterBy: FilterBy) {
  tasks(filterBy: $filterBy) {
    ...TaskFragment
  }
}
    fragment TaskFragment on Task {
  id
  title
  description
  priority
  completed
  dueDate
}`) as unknown as TypedDocumentString<GetTasksQuery, GetTasksQueryVariables>;