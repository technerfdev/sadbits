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

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
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
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  createTask: Task;
  deleteTask: DeleteTaskResponse;
  duplicateProject: Project;
  updateProject: Project;
  updateTask: Task;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationCreateTaskArgs = {
  task: CreateTaskInputDto;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDuplicateProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type MutationUpdateProjectArgs = {
  project: UpdateProjectInput;
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

export type Project = {
  __typename?: 'Project';
  created_at: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  projects: Array<Project>;
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

export type UpdateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
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

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', id: string, name: string, description?: string | null } };

export type UpdateProjectMutationVariables = Exact<{
  project: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: { __typename?: 'Project', id: string } };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, name: string, description?: string | null }> };

export type TaskFragmentFragment = { __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null, archived?: boolean | null };

export type CreateTaskMutationVariables = Exact<{
  task: CreateTaskInputDto;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask: { __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null, archived?: boolean | null } };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask: { __typename?: 'DeleteTaskResponse', success: boolean } };

export type UpdateTaskMutationVariables = Exact<{
  task: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask: { __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null, archived?: boolean | null } };

export type GetTasksQueryVariables = Exact<{
  filterBy?: InputMaybe<FilterBy>;
}>;


export type GetTasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'Task', id: string, title: string, description?: string | null, priority?: PriorityType | null, completed: boolean, dueDate?: any | null, archived?: boolean | null }> };

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
  archived
}
    `, {"fragmentName":"TaskFragment"}) as unknown as TypedDocumentString<TaskFragmentFragment, unknown>;
export const CreateProjectDocument = new TypedDocumentString(`
    mutation CreateProject($project: CreateProjectInput!) {
  createProject(project: $project) {
    id
    name
    description
  }
}
    `) as unknown as TypedDocumentString<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = new TypedDocumentString(`
    mutation UpdateProject($project: UpdateProjectInput!) {
  updateProject(project: $project) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const GetProjectsDocument = new TypedDocumentString(`
    query GetProjects {
  projects {
    id
    name
    description
  }
}
    `) as unknown as TypedDocumentString<GetProjectsQuery, GetProjectsQueryVariables>;
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
  archived
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
  archived
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
  archived
}`) as unknown as TypedDocumentString<GetTasksQuery, GetTasksQueryVariables>;