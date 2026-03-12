import Card from "../ui/Card";
import Badge from "../ui/Badge";
import MatchScoreBadge from "./MatchScoreBadge";
import { stripHtml } from "../../utils/stripHtml";

export default function JobCard({ job }) {
  return (
    <Card className="flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>
        {job.matchScore != null && <MatchScoreBadge score={job.matchScore} />}
      </div>

      <p className="text-sm text-gray-700 line-clamp-3">
        {stripHtml(job.description)}
      </p>

      <div className="flex flex-wrap gap-2">
        {job.location && <Badge>{job.location}</Badge>}
        {job.type && <Badge variant="info">{job.type}</Badge>}
      </div>
    </Card>
  );
}
