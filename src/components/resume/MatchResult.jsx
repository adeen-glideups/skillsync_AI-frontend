import Card from "../ui/Card";
import MatchScoreBadge from "../jobs/MatchScoreBadge";

export default function MatchResult({ match }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {match.jobTitle}
          </h3>
          <p className="text-sm text-gray-600">{match.company}</p>
        </div>
        <MatchScoreBadge score={match.score} />
      </div>

      {match.explanation && (
        <p className="text-sm text-gray-700">{match.explanation}</p>
      )}
    </Card>
  );
}
