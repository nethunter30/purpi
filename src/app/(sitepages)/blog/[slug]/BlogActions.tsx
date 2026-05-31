"use client";

import React, { useState } from "react";
import { ThumbsUp, Share2 } from "lucide-react";

interface BlogActionsProps {
  postId: string;
}

export default function BlogActions({ postId }: BlogActionsProps) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLike}
        className="flex items-center gap-2 px-4 py-2 rounded-sm bg-purple-950/35 border border-purple-900/20 hover:border-purple-500/30 text-gray-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
      >
        <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-purple-500 text-purple-500" : ""}`} />
        {hasLiked ? "Liked!" : "Helpful?"}
        {likes > 0 ? <span className="font-mono text-purple-300">({likes})</span> : null}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-sm bg-[#1c0f2b] border border-purple-500/10 hover:border-purple-500/30 text-gray-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
      >
        <Share2 className="w-4 h-4 text-purple-400" />
        Share article
      </button>
    </div>
  );
}
