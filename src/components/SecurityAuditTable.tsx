"use client";

import React, { useState, useEffect } from "react";

interface AuditLog {
  id: string;
  action: string;
  type: "password_reset" | "unauthorized_access" | "login" | "logout" | "other";
  userId?: string;
  username?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  success: boolean;
}

interface SecurityAuditTableProps {
  logs?: AuditLog[];
  className?: string;
}

export const SecurityAuditTable: React.FC<SecurityAuditTableProps> = ({
  logs: initialLogs = [],
  className = "",
}) => {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "failed" | "success">("all");

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/audit-logs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "failed") return !log.success;
    if (filter === "success") return log.success;
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "password_reset": return "bg-blue-900/20 border-blue-500/30";
      case "unauthorized_access": return "bg-red-900/20 border-red-500/30";
      case "login": return "bg-green-900/20 border-green-500/30";
      case "logout": return "bg-gray-900/20 border-gray-500/30";
      default: return "bg-purple-900/20 border-purple-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "password_reset": return "Password Reset";
      case "unauthorized_access": return "Unauthorized Access";
      case "login": return "Login";
      case "logout": return "Logout";
      default: return "Other";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-pixel text-sm text-gray-300">Security Audit Logs</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded font-pixel text-xs transition-colors ${
              filter === "all"
                ? "bg-amber-600 text-white"
                : "bg-gray-800/30 text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("success")}
            className={`px-2 py-1 rounded font-pixel text-xs transition-colors ${
              filter === "success"
                ? "bg-green-600 text-white"
                : "bg-gray-800/30 text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setFilter("failed")}
            className={`px-2 py-1 rounded font-pixel text-xs transition-colors ${
              filter === "failed"
                ? "bg-red-600 text-white"
                : "bg-gray-800/30 text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            Failed
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800/20 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800/30">
                <th className="font-pixel text-xs text-gray-400 p-2 text-left">
                  Time
                </th>
                <th className="font-pixel text-xs text-gray-400 p-2 text-left">
                  Action
                </th>
                <th className="font-pixel text-xs text-gray-400 p-2 text-left">
                  User
                </th>
                <th className="font-pixel text-xs text-gray-400 p-2 text-left">
                  IP
                </th>
                <th className="font-pixel text-xs text-gray-400 p-2 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    <p className="font-pixel text-xs text-gray-600">
                      No audit logs found.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`border-t border-gray-700/30 ${getTypeColor(log.type)}`}
                  >
                    <td className="font-pixel text-xs p-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="font-pixel text-xs p-2">
                      {getTypeLabel(log.type)}
                    </td>
                    <td className="font-pixel text-xs p-2">
                      {log.username || log.userId || "—"}
                    </td>
                    <td className="font-pixel text-xs p-2">
                      {log.ip || "—"}
                    </td>
                    <td className="font-pixel text-xs p-2 text-center">
                      <span className={`px-2 py-0.5 rounded ${
                        log.success
                          ? "bg-green-600/30 text-green-400"
                          : "bg-red-600/30 text-red-400"
                      }`}>
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SecurityAuditTable;
