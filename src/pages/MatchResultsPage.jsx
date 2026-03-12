import MatchList from "../components/resume/MatchList";
import { useResumeMatch } from "../hooks/useResumeMatch";

export default function MatchResultsPage() {
  const { matches, status } = useResumeMatch();

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Match Results</h1>
      <p className="mb-8 text-gray-600">
        Jobs ranked by how well they match your resume.
      </p>
      <MatchList matches={matches} status={status} />
    </div>
  );
}
