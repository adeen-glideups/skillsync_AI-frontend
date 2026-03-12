import { useCallback, useState } from "react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

export default function ResumeUploader({ onUpload, status }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      const allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) {
        alert("Please upload a PDF or DOCX file.");
        return;
      }
      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const isUploading = status === "uploading" || status === "processing";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
        dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-gray-600">
            {status === "uploading" ? "Uploading..." : "Analyzing your resume..."}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            Drag & drop your resume here, or click to browse
          </p>
          <label>
            <Button as="span" className="cursor-pointer">
              Choose File
            </Button>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleChange}
            />
          </label>
          <p className="mt-2 text-xs text-gray-400">PDF or DOCX, max 5MB</p>
        </>
      )}
    </div>
  );
}
