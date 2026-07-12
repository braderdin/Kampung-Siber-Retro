"use client";

import React, { useState, useEffect } from "react";

interface BulletinPost {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  priority?: "low" | "medium" | "high";
  isPinned?: boolean;
}

interface BBSBulletinBoardProps {
  posts?: BulletinPost[];
  title?: string;
  className?: string;
  maxPosts?: number;
}

export const BBSBulletinBoard: React.FC<BBSBulletinBoardProps> = ({
  posts: initialPosts = [],
  title = "Papan Notis",
  className = "",
  maxPosts = 50,
}) => {
  const [posts, setPosts] = useState<BulletinPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/bulletin/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts.slice(0, maxPosts));
        }
      } catch (error) {
        console.error("Failed to fetch bulletin posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    const interval = setInterval(fetchPosts, 60000);
    return () => clearInterval(interval);
  }, [maxPosts]);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "border-red-500/50 bg-red-900/20";
      case "medium": return "border-amber-500/50 bg-amber-900/20";
      default: return "border-blue-500/50 bg-blue-900/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <h2 className="font-pixel text-xl text-white mb-4">{title}</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800/20 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const pinnedPosts = posts.filter(p => p.isPinned);
  const regularPosts = posts.filter(p => !p.isPinned);
  const displayPosts = [...pinnedPosts, ...regularPosts];

  if (displayPosts.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <h2 className="font-pixel text-xl text-white mb-4">{title}</h2>
        <div className="text-center py-8">
          <p className="font-pixel text-xs text-gray-500">
            Tidak ada pemberitahuan terkini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h2 className="font-pixel text-xl text-white mb-4">{title}</h2>
      
      <div className="space-y-3">
        {displayPosts.map((post) => (
          <article
            key={post.id}
            className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${getPriorityColor(post.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-pixel text-sm text-white">
                {post.title}
              </h3>
              {post.isPinned && (
                <span className="font-pixel text-xs text-amber-400">
                  📌 Pinned
                </span>
              )}
            </div>
            
            <p className="font-pixel text-xs text-gray-300 mb-2">
              {post.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>by {post.author}</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BBSBulletinBoard;
