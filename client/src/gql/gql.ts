/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetCFAnalytics {\n  cloudflareAnalytics {\n    totals {\n      requests\n      bandwidth\n      threats\n      pageViews\n      uniques\n      cachedRequests\n    }\n    timeseries {\n      timestamp\n      requests\n      bandwidth\n      threats\n      pageViews\n      uniques\n    }\n  }\n}": typeof types.GetCfAnalyticsDocument,
    "mutation CreateProject($project: CreateProjectInput!) {\n  createProject(project: $project) {\n    id\n    name\n    description\n  }\n}": typeof types.CreateProjectDocument,
    "mutation DeleteProject($projectId: String!) {\n  deleteProject(projectId: $projectId) {\n    success\n  }\n}": typeof types.DeleteProjectDocument,
    "mutation DuplicateProject($projectId: String!) {\n  duplicateProject(projectId: $projectId) {\n    id\n  }\n}": typeof types.DuplicateProjectDocument,
    "mutation UpdateProject($project: UpdateProjectInput!) {\n  updateProject(project: $project) {\n    id\n  }\n}": typeof types.UpdateProjectDocument,
    "query GetProjects {\n  projects {\n    id\n    name\n    description\n    associatedTasks {\n      total\n    }\n  }\n}": typeof types.GetProjectsDocument,
    "fragment TaskFragment on Task {\n  id\n  title\n  description\n  priority\n  completed\n  dueDate\n  archived\n  projects {\n    id\n    name\n  }\n}": typeof types.TaskFragmentFragmentDoc,
    "mutation CreateTask($task: CreateTaskInputDto!) {\n  createTask(task: $task) {\n    ...TaskFragment\n  }\n}": typeof types.CreateTaskDocument,
    "mutation DeleteTask($id: ID!) {\n  deleteTask(id: $id) {\n    success\n  }\n}": typeof types.DeleteTaskDocument,
    "mutation UpdateTask($task: UpdateTaskInput!) {\n  updateTask(task: $task) {\n    ...TaskFragment\n  }\n}": typeof types.UpdateTaskDocument,
    "query GetTasks($filterBy: FilterBy) {\n  tasks(filterBy: $filterBy) {\n    ...TaskFragment\n  }\n}": typeof types.GetTasksDocument,
};
const documents: Documents = {
    "query GetCFAnalytics {\n  cloudflareAnalytics {\n    totals {\n      requests\n      bandwidth\n      threats\n      pageViews\n      uniques\n      cachedRequests\n    }\n    timeseries {\n      timestamp\n      requests\n      bandwidth\n      threats\n      pageViews\n      uniques\n    }\n  }\n}": types.GetCfAnalyticsDocument,
    "mutation CreateProject($project: CreateProjectInput!) {\n  createProject(project: $project) {\n    id\n    name\n    description\n  }\n}": types.CreateProjectDocument,
    "mutation DeleteProject($projectId: String!) {\n  deleteProject(projectId: $projectId) {\n    success\n  }\n}": types.DeleteProjectDocument,
    "mutation DuplicateProject($projectId: String!) {\n  duplicateProject(projectId: $projectId) {\n    id\n  }\n}": types.DuplicateProjectDocument,
    "mutation UpdateProject($project: UpdateProjectInput!) {\n  updateProject(project: $project) {\n    id\n  }\n}": types.UpdateProjectDocument,
    "query GetProjects {\n  projects {\n    id\n    name\n    description\n    associatedTasks {\n      total\n    }\n  }\n}": types.GetProjectsDocument,
    "fragment TaskFragment on Task {\n  id\n  title\n  description\n  priority\n  completed\n  dueDate\n  archived\n  projects {\n    id\n    name\n  }\n}": types.TaskFragmentFragmentDoc,
    "mutation CreateTask($task: CreateTaskInputDto!) {\n  createTask(task: $task) {\n    ...TaskFragment\n  }\n}": types.CreateTaskDocument,
    "mutation DeleteTask($id: ID!) {\n  deleteTask(id: $id) {\n    success\n  }\n}": types.DeleteTaskDocument,
    "mutation UpdateTask($task: UpdateTaskInput!) {\n  updateTask(task: $task) {\n    ...TaskFragment\n  }\n}": types.UpdateTaskDocument,
    "query GetTasks($filterBy: FilterBy) {\n  tasks(filterBy: $filterBy) {\n    ...TaskFragment\n  }\n}": types.GetTasksDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCFAnalytics {\n  cloudflareAnalytics {\n    totals {\n      requests\n      bandwidth\n      threats\n      pageViews\n      uniques\n      cachedRequests\n    }\n    timeseries {\n      timestamp\n      requests\n      bandwidth\n      threats\n      pageViews\n      uniques\n    }\n  }\n}"): typeof import('./graphql').GetCfAnalyticsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateProject($project: CreateProjectInput!) {\n  createProject(project: $project) {\n    id\n    name\n    description\n  }\n}"): typeof import('./graphql').CreateProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteProject($projectId: String!) {\n  deleteProject(projectId: $projectId) {\n    success\n  }\n}"): typeof import('./graphql').DeleteProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DuplicateProject($projectId: String!) {\n  duplicateProject(projectId: $projectId) {\n    id\n  }\n}"): typeof import('./graphql').DuplicateProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateProject($project: UpdateProjectInput!) {\n  updateProject(project: $project) {\n    id\n  }\n}"): typeof import('./graphql').UpdateProjectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProjects {\n  projects {\n    id\n    name\n    description\n    associatedTasks {\n      total\n    }\n  }\n}"): typeof import('./graphql').GetProjectsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment TaskFragment on Task {\n  id\n  title\n  description\n  priority\n  completed\n  dueDate\n  archived\n  projects {\n    id\n    name\n  }\n}"): typeof import('./graphql').TaskFragmentFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateTask($task: CreateTaskInputDto!) {\n  createTask(task: $task) {\n    ...TaskFragment\n  }\n}"): typeof import('./graphql').CreateTaskDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteTask($id: ID!) {\n  deleteTask(id: $id) {\n    success\n  }\n}"): typeof import('./graphql').DeleteTaskDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateTask($task: UpdateTaskInput!) {\n  updateTask(task: $task) {\n    ...TaskFragment\n  }\n}"): typeof import('./graphql').UpdateTaskDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTasks($filterBy: FilterBy) {\n  tasks(filterBy: $filterBy) {\n    ...TaskFragment\n  }\n}"): typeof import('./graphql').GetTasksDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
