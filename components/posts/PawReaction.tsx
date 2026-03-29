"use client";

import { useState } from "react";
import { Heart } from "@phosphor-icons/react";
import type { PostReaction } from "@/lib/types";

interface PawReactionProps {
  reactions: PostReaction[];
  currentUserId?: string;
}

/**
 * Like split-pill button: [Heart Like | count]
 * Active state: brand bg, white text, "Liked"
 */
export function PawReaction({ reactions, currentUserId = "shawn" }: PawReactionProps) {
  const [localReactions, setLocalReactions] = useState(reactions);
  const hasReacted = localReactions.some((r) => r.userId === currentUserId);
  const count = localReactions.length;

  function toggleReaction() {
    if (hasReacted) {
      setLocalReactions(localReactions.filter((r) => r.userId !== currentUserId));
    } else {
      setLocalReactions([...localReactions, { userId: currentUserId, userName: "You" }]);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleReaction}
      className="like-pill"
      data-liked={hasReacted || undefined}
    >
      <span className="like-pill-action">
        <Heart size={12} weight={hasReacted ? "fill" : "light"} />
        <span className="text-xs like-pill-label">{hasReacted ? "Liked" : "Like"}</span>
      </span>
      {count > 0 && (
        <span className="like-pill-count">
          <span className="text-xs">{count}</span>
        </span>
      )}
    </button>
  );
}
