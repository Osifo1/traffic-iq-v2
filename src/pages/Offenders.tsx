import { useCallback } from "react";
import { UserX, MapPin, Clock, Flag } from "lucide-react";
import { fetchOffenders } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner, ErrorState } from "@/components/LoadingState";

const Offenders = () => {
  const fetcher = useCallback(() => fetchOffenders(20), []);
  const { data: offenders, loading, error, retry } = useApi(fetcher);

  const offenderList = Array.isArray(offenders) ? offenders : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Repeat Offenders</h1>
        <p className="text-sm text-muted-foreground">
          Vehicles flagged multiple times across Benin City camera feeds
        </p>
      </div>

      {/* Summary */}
      <div className="glow-card p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
          <UserX className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Repeat Offenders</p>
          <p className="text-xl font-bold text-foreground">{offenderList.length}</p>
        </div>
      </div>

      {/* Offenders table */}
      {loading ? <LoadingSpinner /> : error ? <ErrorState message={error} onRetry={retry} /> : (
        <div className="glow-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <span className="text-xs text-muted-foreground">
              Showing {offenderList.length} repeat offenders ranked by flag count
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Rank</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Plate Number</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Flag Count</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Cameras Seen</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">First Seen</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Last Seen</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody>
                {offenderList.map((offender: any, i: number) => {
                  const risk = offender.flag_count >= 10 ? "High"
                    : offender.flag_count >= 5 ? "Medium" : "Low";
                  const riskStyle = risk === "High"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : risk === "Medium"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-primary/10 text-primary border-primary/20";

                  return (
                    <tr
                      key={i}
                      className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}
                    >
                      <td className="p-3 text-muted-foreground font-mono text-xs">
                        #{String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="p-3 font-mono font-bold text-foreground">
                        {offender.plate_text}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3 h-3 text-destructive" />
                          <span className="font-bold text-destructive">
                            {offender.flag_count}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{offender.cameras}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {offender.first_seen
                            ? new Date(offender.first_seen).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground font-mono">
                        {offender.last_seen
                          ? new Date(offender.last_seen).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${riskStyle}`}>
                          {risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {offenderList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No repeat offenders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offenders;