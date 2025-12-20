import {
  GetCfAnalyticsDocument,
  type GetCfAnalyticsQuery,
  type GetCfAnalyticsQueryVariables,
} from "@/gql/graphql";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  Database,
  Eye,
  Loader2,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { JSX } from "react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toLocaleString();
}

export default function CloudflareAnalytics(): JSX.Element {
  const { data, loading, error } = useQuery<
    GetCfAnalyticsQuery,
    GetCfAnalyticsQueryVariables
  >(gql(GetCfAnalyticsDocument.toString()), {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-xl bg-background border border-border/40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 p-8 rounded-xl bg-background border border-border/40">
        <Shield className="h-12 w-12 text-destructive/50" />
        <div className="flex flex-col items-center text-center">
          <span className="font-semibold">Analytics Unavailable</span>
          <span className="text-sm text-muted-foreground">{error.message}</span>
        </div>
      </div>
    );
  }

  const analytics = data?.cloudflareAnalytics;
  if (!analytics) return <div />;

  const { totals } = analytics;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <a
            className="text-2xl font-bold tracking-tight hover:underline cursor-pointer"
            href="https://albertnguyen.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            albertnguyen.com
          </a>
          <p className="text-sm text-muted-foreground">Last 24 hours</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-primary">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl transition-all group-hover:bg-blue-500/20" />
          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Total
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">
                {formatNumber(totals.requests)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Requests</div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl transition-all group-hover:bg-purple-500/20" />
          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Eye className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Visits
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">
                {formatNumber(totals.pageViews)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Page Views
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl transition-all group-hover:bg-cyan-500/20" />
          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Users className="h-5 w-5 text-cyan-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Unique
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">
                {formatNumber(totals.uniques)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Visitors</div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl transition-all group-hover:bg-green-500/20" />
          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Database className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Transferred
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">
                {formatBytes(totals.bandwidth)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Bandwidth
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl transition-all group-hover:bg-amber-500/20" />
          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Performance
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight">
                {totals.cachedRequests.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Cache Hit Rate
              </div>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 transition-all hover:shadow-lg hover:border-primary/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl transition-all group-hover:bg-red-500/20" />
          <div className="relative flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Security
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-red-500">
                {formatNumber(totals.threats)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Threats Blocked
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
