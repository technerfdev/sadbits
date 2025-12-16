import type { GetProjectsQuery } from "@/gql/graphql";

export type ProjectType = NonNullable<
  NonNullable<GetProjectsQuery>["projects"]
>[number];
