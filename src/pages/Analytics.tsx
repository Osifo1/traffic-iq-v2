import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { vehicleDetectionOverTime, peakTrafficHours } from "@/data/mockData";
import { useCallback } from "react";
import { fetchStats } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner, ErrorState } from "@/components/LoadingState";

const COLORS = [
  "hsl(160, 100%, 39%)",
  "hsl(216, 70%, 37%)",
  "hsl(190, 80%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 70%, 50%)",
  "hsl(0, 70%, 50%)",
];

const chartCardClass = "glow-card p-5";

const Analytics = () => {
  const fetcher = useCallback(() => fetchStats(), []);
  const { data: stats, loading, error, retry } = useApi(fetcher);

  const vehicleBreakdown = stats?.vehicles_by_type
    ? Object.entries(stats.vehicles_by_type).map(([name, value], i) => ({
        name,
        value: value as number,
        fill: COLORS[i % COLORS.length],
      }))
    : [];

  const cameraComparison = stats?.vehicles_per_feed
    ? Object.entries(stats.vehicles_per_feed).map(([camera, vehicles]) => ({
        camera,
        vehicles: vehicles as number,
      }))
    : [];

  const incidentsByType = stats?.incidents_by_type
    ? Object.entries(stats.incidents_by_type).map(([type, count]) => ({
        type,
        count: count as number,
      }))
    : [];

  const incidentsByCamera = stats?.incidents_by_camera
    ? Object.entries(stats.incidents_by_camera).map(([camera, count]) => ({
        camera,
        count: count as number,
      }))
    : [];

  if (loading) return <LoadingSpinner />;
  if (error || !stats) return <ErrorState message={error || "Failed to load"} onRetry={retry} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Traffic data insights across all Benin City camera feeds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Vehicle class breakdown donut */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Vehicle Class Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={vehicleBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                {vehicleBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 50%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Camera feed comparison */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibond text-foreground mb-4">Vehicles per Camera Feed</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cameraComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <YAxis dataKey="camera" type="category" stroke="hsl(215, 20%, 55%)" fontSize={10} width={130} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 50%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="vehicles" fill="hsl(216, 70%, 37%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents by type */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Incidents by Type</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incidentsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="type" stroke="hsl(215, 20%, 55%)" fontSize={10} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 50%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="hsl(160, 100%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents by camera */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Incidents by Camera Feed</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incidentsByCamera} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <YAxis dataKey="camera" type="category" stroke="hsl(215, 20%, 55%)" fontSize={10} width={130} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 50%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="hsl(38, 92%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;