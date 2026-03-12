import { formatScore, scoreColor } from "../../utils/formatScore";
import { cn } from "../../utils/cn";

export default function MatchScoreBadge({ score }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-bold",
        scoreColor(score)
      )}
    >
      {formatScore(score)}
    </span>
  );
}
