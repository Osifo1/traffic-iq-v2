import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  vehicleDetectionOverTime, peakTrafficHours,
} from "@/data/mockData";
import { useCallback } from "react";
import { fetchVehicleStats, fetchCameraStats } from "@/lib/api";
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
  const vehicleFetcher = useCallback(() => fetchVehicleStats(), []);
  const cameraFetcher = useCallback(() => fetchCameraStats(), []);
  const { data: vehicleData, loading: vLoading, error: vError, retry: vRetry } = useApi(vehicleFetcher);
  const { data: cameraData, loading: cLoading, error: cError, retry: cRetry } = useApi(cameraFetcher);

  // Transform vehicle data for donut chart
  const vehicleBreakdown = vehicleData
    ? Object.entries(vehicleData).map(([name, value], i) => ({
        name,
        value: value as number,
        fill: COLORS[i % COLORS.length],
      }))
    : [];

  // Transform camera data for bar chart
  const cameraComparison = cameraData
    ? Object.entries(cameraData).map(([camera, vehicles]) => ({
        camera,
        vehicles: vehicles as number,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Traffic data insights and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Vehicle Class Breakdown</h2>
          {vLoading ? <LoadingSpinner /> : vError ? <ErrorState message={vError} onRetry={vRetry} /> : (
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
          )}
        </div>

        {/* Line chart - still uses mock time-series data */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Detections Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={vehicleDetectionOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="time" stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 50%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="cars" stroke="hsl(160, 100%, 39%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="buses" stroke="hsl(216, 70%, 37%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="trucks" stroke="hsl(190, 80%, 50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="motorcycles" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Peak hours - mock data */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Peak Traffic Hours</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={peakTrafficHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="hour" stroke="hsl(215, 20%, 55%)" fontSize={10} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 50%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="hsl(160, 100%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Camera comparison - live API */}
        <div className={chartCardClass}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Camera Feed Comparison</h2>
          {cLoading ? <LoadingSpinner /> : cError ? <ErrorState message={cError} onRetry={cRetry} /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cameraComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={11} />
                <YAxis dataKey="camera" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} width={80} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 50%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="vehicles" fill="hsl(216, 70%, 37%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
