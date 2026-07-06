import type { Milestone } from "../types/impact";

interface KeyMilestonesProps {
  milestones: Milestone[];
  auditProgressPercent: number;
}

export function KeyMilestones({
  milestones,
  auditProgressPercent,
}: KeyMilestonesProps) {
  return (
    <div className="rounded-tile bg-tile border border-border-ui p-4 md:p-5 flex flex-col h-full">
      <h3 className="font-bold text-sm md:text-base mb-3 md:mb-4">Key Milestones</h3>

      <ul className="flex flex-col gap-3 md:gap-4 flex-1">
        {milestones.map((m) => (
          <li key={m.id} className="flex items-start gap-2 md:gap-3">
            <span
              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                m.status === "complete" ? "bg-primary" : "bg-muted"
              }`}
            />
            <div>
              <p className="text-xs md:text-sm font-medium">{m.title}</p>
              <p className="text-[10px] md:text-xs text-muted">{m.date}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] md:text-xs text-muted mb-1">
          <span>Verification Audit Progress</span>
        </div>
        <div className="h-2 rounded-pill bg-input overflow-hidden">
          <div
            className="h-full bg-primary rounded-pill"
            style={{ width: `${auditProgressPercent}%` }}
          />
        </div>
        <p className="text-[10px] md:text-xs text-muted mt-1">
          {auditProgressPercent}% Complete
        </p>
      </div>
    </div>
  );
}