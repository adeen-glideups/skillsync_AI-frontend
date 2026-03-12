import JobCard from "./JobCard";
import Spinner from "../ui/Spinner";

export default function JobList({ jobs, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <p className="py-8 text-center text-red-600">{error}</p>;
  }

  if (!jobs.length) {
    return <p className="py-8 text-center text-gray-500">No jobs found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id ?? job._id} job={job} />
      ))}
    </div>
  );
}
