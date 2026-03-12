import { useNavigate } from "react-router-dom";
import ResumeUploader from "../components/resume/ResumeUploader";
import { useResumeMatch } from "../hooks/useResumeMatch";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { upload, status } = useResumeMatch();

  const handleUpload = async (file) => {
    await upload(file);
    navigate("/results");
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Upload your resume to find matching job opportunities.
      </p>
      <ResumeUploader onUpload={handleUpload} status={status} />
    </div>
  );
}
