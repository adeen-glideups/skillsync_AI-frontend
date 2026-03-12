import MatchResult from "./MatchResult";
import Spinner from "../ui/Spinner";

export default function MatchList({ matches, status }) {
  if (status === "processing") {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <Spinner size="lg" />
        <p className="text-sm text-gray-600">Finding your best matches...</p>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <p className="py-8 text-center text-gray-500">
        No match results yet. Upload your resume to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match, i) => (
        <MatchResult key={match.id ?? i} match={match} />
      ))}
    </div>
  );
}
