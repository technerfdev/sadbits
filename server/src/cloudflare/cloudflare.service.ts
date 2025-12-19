/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Analytics } from './dto/analytics.types';

@Injectable()
export class CloudflareService {
  private readonly apiToken: string;
  private readonly zoneId: string;
  private readonly graphqlUrl = 'https://api.cloudflare.com/client/v4/graphql';

  constructor(private configService: ConfigService) {
    this.apiToken =
      this.configService.get<string>('CLOUDFLARE_API_TOKEN') || '';
    this.zoneId = this.configService.get<string>('CLOUDFLARE_ZONE_ID') || '';
  }

  async getAnalytics(
    since?: string,
    until?: string,
  ): Promise<Analytics | null> {
    if (!this.apiToken || !this.zoneId) {
      throw new HttpException(
        'Cloudflare credentials not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // httpRequests1hGroups max range is 3 days (259200 seconds)
    const sinceDate =
      since || new Date(Date.now() - 3 * 24 * 59 * 60 * 1000).toISOString();
    const untilDate = until || new Date().toISOString();

    const query = `
      query GetZoneAnalytics($zoneTag: string, $start: Time, $end: Time) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            httpRequests1hGroups(
              orderBy: [datetime_ASC]
              limit: 70
              filter: { datetime_geq: $start, datetime_lt: $end }
            ) {
              dimensions {
                datetime
              }
              sum {
                requests
                bytes
                cachedBytes
                cachedRequests
                pageViews
                threats
              }
              uniq {
                uniques
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(this.graphqlUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            zoneTag: this.zoneId,
            start: sinceDate,
            end: untilDate,
          },
        }),
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to fetch Cloudflare analytics',
          response.status,
        );
      }

      const data = await response.json();
      if (data.errors) {
        console.log({ errors: data.errors });
      }

      if (!data?.data?.viewer?.zones?.[0]) {
        return {
          timeseries: [],
          totals: {
            requests: 0,
            bandwidth: 0,
            threats: 0,
            pageViews: 0,
            uniques: 0,
            cachedRequests: 0,
          },
        };
      }

      const zone = data.data.viewer.zones[0];
      const timeseries = zone.httpRequests1hGroups || [];

      // Calculate totals from timeseries
      const totals = timeseries.reduce(
        (acc: any, item: any) => ({
          requests: acc.requests + (item.sum.requests || 0),
          bytes: acc.bytes + (item.sum.bytes || 0),
          threats: acc.threats + (item.sum.threats || 0),
          pageViews: acc.pageViews + (item.sum.pageViews || 0),
          uniques: acc.uniques + (item.uniq.uniques || 0),
          cachedRequests: acc.cachedRequests + (item.sum.cachedRequests || 0),
        }),
        {
          requests: 0,
          bytes: 0,
          threats: 0,
          pageViews: 0,
          uniques: 0,
          cachedRequests: 0,
        },
      );

      return {
        timeseries: timeseries.map((item: any) => ({
          timestamp: item.dimensions.datetime,
          requests: item.sum.requests || 0,
          bandwidth: item.sum.bytes || 0,
          threats: item.sum.threats || 0,
          pageViews: item.sum.pageViews || 0,
          uniques: item.uniq.uniques || 0,
        })),
        totals: {
          requests: totals.requests,
          bandwidth: totals.bytes,
          threats: totals.threats,
          pageViews: totals.pageViews,
          uniques: totals.uniques,
          cachedRequests:
            totals.requests > 0
              ? (totals.cachedRequests / totals.requests) * 100
              : 0,
        },
      };
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch analytics';
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
