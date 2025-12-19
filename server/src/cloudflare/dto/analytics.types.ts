import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsTimeseries {
  @Field()
  timestamp: string;

  @Field(() => Int)
  requests: number;

  @Field(() => Int)
  bandwidth: number;

  @Field(() => Int)
  threats: number;

  @Field(() => Int)
  pageViews: number;

  @Field(() => Int)
  uniques: number;
}

@ObjectType()
export class AnalyticsTotals {
  @Field(() => Int)
  requests: number;

  @Field(() => Int)
  bandwidth: number;

  @Field(() => Int)
  threats: number;

  @Field(() => Int)
  pageViews: number;

  @Field(() => Int)
  uniques: number;

  @Field(() => Float)
  cachedRequests: number;
}

@ObjectType()
export class Analytics {
  @Field(() => [AnalyticsTimeseries])
  timeseries: AnalyticsTimeseries[];

  @Field(() => AnalyticsTotals)
  totals: AnalyticsTotals;
}
