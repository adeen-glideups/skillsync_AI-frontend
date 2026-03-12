import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        Find Jobs That Match <span className="text-blue-600">Your Skills</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600">
        Upload your resume and let our AI match you with the best job
        opportunities. Get a compatibility score and personalized explanations.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/register">
          <Button>Get Started</Button>
        </Link>
        <Link to="/jobs">
          <Button variant="secondary">Browse Jobs</Button>
        </Link>
      </div>
    </div>
  );
}
