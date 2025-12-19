import axios from "axios";
import { CloudIcon, Loader2, TrendingUp, Eye, Shield } from "lucide-react";
import type { JSX } from "react";
import { useState, useEffect } from "react";

interface CloudflareStats {
  requests: number;
  bandwidth: number;
  threats: number;
  pageviews: number;
}

export default function CloudflareAnalytics(): JSX.Element {
  const [stats, setStats] = useState<CloudflareStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCloudflareStats = async () => {
      const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
      const zoneId = import.meta.env.VITE_CLOUDFLARE_ZONE_ID;

      if (!apiToken || !zoneId) {
        setError("Cloudflare credentials not configured");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const response = await axios.get(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            params: { since, continuous: true },
          }
        );

        const { result } = response.data;
        const totals = result.totals;

        setStats({
          requests: totals.requests?.all || 0,
          bandwidth: Math.round((totals.bandwidth?.all || 0) / 1024 / 1024),
          threats: totals.threats?.all || 0,
          pageviews: totals.pageviews?.all || 0,
        });
      } catch (err) {
        setError("Failed to fetch Cloudflare data");
      } finally {
        setLoading(false);
      }
    };

    fetchCloudflareStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 rounded-lg bg-background border border-border/40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-background border border-border/40">
        <CloudIcon className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg bg-background border border-border/40">
      <div className="text-sm font-semibold">Cloudflare (24h)</div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs">Requests</span>
          </div>
          <span className="text-lg font-bold">
            {stats?.requests.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span className="text-xs">Pageviews</span>
          </div>
          <span className="text-lg font-bold">
            {stats?.pageviews.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span className="text-xs">Threats</span>
          </div>
          <span className="text-lg font-bold text-red-500">
            {stats?.threats.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CloudIcon className="h-3 w-3" />
            <span className="text-xs">Bandwidth</span>
          </div>
          <span className="text-lg font-bold">{stats?.bandwidth} MB</span>
        </div>
      </div>
    </div>
  );
}
