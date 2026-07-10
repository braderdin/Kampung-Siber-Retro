"use client";

import React, { useState } from "react";

interface AdminReportFormProps {
  targetId?: string;
  targetType?: "post" | "comment" | "user" | "profile";
  onSubmit?: (report: ReportData) => void;
  className?: string;
}

interface ReportData {
  subject: string;
  description: string;
  targetId?: string;
  targetType?: string;
  severity: "low" | "medium" | "high";
}

const REPORT_SUBJECTS = [
  { value: "spam", label: "Spam/Advertisement" },
  { value: "harassment", label: "Harassment/Bullying" },
  { value: "abuse", label: "Abusive Content" },
  { value: "copyright", label: "Copyright Violation" },
  { value: "other", label: "Other" },
];

export const AdminReportForm: React.FC<AdminReportFormProps> = ({
  targetId,
  targetType = "post",
  onSubmit,
  className = "",
}) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const report: ReportData = {
        subject,
        description,
        targetId,
        targetType,
        severity,
      };

      if (onSubmit) {
        await onSubmit(report);
      } else {
        const response = await fetch("/api/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(report),
        });

        if (!response.ok) {
          throw new Error("Failed to submit report");
        }
      }

      setSuccess(true);
      setSubject("");
      setDescription("");
      setSeverity("medium");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "high": return "border-red-500/50 bg-red-900/20";
      case "medium": return "border-amber-500/50 bg-amber-900/20";
      default: return "border-gray-500/50 bg-gray-900/20";
    }
  };

  if (success) {
    return (
      <div className={`p-4 bg-green-900/20 border border-green-500/50 rounded ${className}`}>
        <div className="font-pixel text-xs text-green-400">
          Thank you for your report. Our moderators will review it shortly.
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h3 className="font-pixel text-sm text-white mb-3">Report Content</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
            required
          >
            <option value="">Select a subject...</option>
            {REPORT_SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Severity
          </label>
          <div className="flex gap-2">
            {["low", "medium", "high"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSeverity(level as any)}
                className={`px-3 py-1 rounded font-pixel text-xs transition-all ${
                  severity === level
                    ? getSeverityColor(level) + " border"
                    : "bg-gray-800/20 border border-gray-700/30 hover:bg-gray-700/30"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe the issue in detail..."
            rows={4}
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors resize-y"
            required
            minLength={20}
            maxLength={1000}
          />
          <div className="font-pixel text-xs text-gray-500 mt-1">
            {description.length}/1000 characters
          </div>
        </div>

        {error && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded">
            <p className="font-pixel text-xs text-red-400">{error}</p>
          </div>
        )}

        <div className="hidden">
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !subject || !description}
          className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-pixel text-xs rounded transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default AdminReportForm;
