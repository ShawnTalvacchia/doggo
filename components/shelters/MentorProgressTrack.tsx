import { Check, GraduationCap } from "@phosphor-icons/react";

/**
 * Visual track toward solo-walker status (2026-06-11). One node per
 * required session + a graduation node; completed sessions fill, the
 * session being booked (if any) highlights as "current". Used on the
 * mentor booking sheet AND the shelter mentor-path card.
 *
 * The track is shelter-scoped, NOT mentor-scoped — sessions count toward
 * the shelter's vouch regardless of which mentor ran each one (a mentee
 * can mix mentors across their sessions).
 */
export function MentorProgressTrack({
  total,
  completed,
  booking,
  caption,
}: {
  total: number;
  /** Sessions already completed at this shelter. */
  completed: number;
  /** 1-based session number being booked now (highlighted). Pass 0/undefined
   *  to highlight nothing (e.g. a status display, not a booking flow). */
  booking?: number;
  /** Optional flush-left caption that sits on the SAME baseline row as the
   *  "Solo walker" end label (the shelter card passes its progress count
   *  here so the two read as a labelled progress bar; the booking sheet
   *  leaves it off and keeps its longer caption separate below). */
  caption?: string;
}) {
  return (
    <div
      className="mentor-progress"
      aria-label={`${completed} of ${total} sessions toward solo walker`}
    >
      <div className="mentor-progress-track">
        {Array.from({ length: total }).map((_, i) => {
          const n = i + 1;
          const state = n <= completed ? "done" : n === booking ? "current" : "upcoming";
          return (
            <div key={n} className="mentor-progress-step">
              <span className={`mentor-progress-node mentor-progress-node--${state}`}>
                {state === "done" ? <Check size={14} weight="bold" /> : n}
              </span>
              <span className="mentor-progress-connector" />
            </div>
          );
        })}
        <div className="mentor-progress-step mentor-progress-step--goal">
          <span className="mentor-progress-node mentor-progress-node--goal">
            <GraduationCap size={16} weight="fill" />
          </span>
        </div>
      </div>
      {/* End-labels row: caption flush-left, "Solo walker" at the right
          (under the cap). Extra gap above keeps the labels off the nodes. */}
      <div className="mentor-progress-footer">
        {caption && <span className="mentor-progress-caption">{caption}</span>}
        <span className="mentor-progress-goal-label">Solo walker</span>
      </div>
    </div>
  );
}
