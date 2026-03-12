import { useEffect, useState } from "react";
import { useJobs } from "../hooks/useJobs";
import JobList from "../components/jobs/JobList";
import Input from "../components/ui/Input";

export default function JobsPage() {
  const { jobs, loading, error, loadJobs, search } = useJobs();
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      search(query.trim());
    } else {
      loadJobs();
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Browse Jobs</h1>
      <p className="mb-6 text-gray-600">Explore available job opportunities.</p>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <Input
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <JobList jobs={jobs} loading={loading} error={error} />
    </div>
  );
}
