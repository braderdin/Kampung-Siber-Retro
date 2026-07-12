"use client";

import React, { useState, useEffect } from "react";

interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  status?: "online" | "away" | "offline";
  lastSeen?: string;
}

interface ChatUserListProps {
  users?: ChatUser[];
  currentUserId?: string;
  className?: string;
}

export const ChatUserList: React.FC<ChatUserListProps> = ({
  users: initialUsers = [],
  currentUserId,
  className = "",
}) => {
  const [users, setUsers] = useState<ChatUser[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/chat/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Failed to fetch chat users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "away": return "bg-amber-500";
      case "offline": return "bg-gray-500";
      default: return "bg-green-500";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-pixel text-xs text-gray-400">Online</h3>
        <span className="font-pixel text-xs text-gray-600">{users.length}</span>
      </div>

      <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700/30 animate-pulse" />
                <div className="flex-1 h-4 bg-gray-700/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-800/30 transition-colors"
            >
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-700/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600/50 flex items-center justify-center">
                    <span className="font-pixel text-xs text-white">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div
                  className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-pixel text-xs text-white truncate">
                  {user.username}
                  {user.id === currentUserId && " (You)"}
                </div>
              </div>

              {user.status === "away" && (
                <span className="font-pixel text-xs text-amber-400">☕</span>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #555 #333;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default ChatUserList;
