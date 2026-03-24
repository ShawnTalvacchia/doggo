"use client";

import { useState } from "react";
import { PawPrint } from "@phosphor-icons/react";
import type { PostReaction } from "@/lib/types";

interface PawReactionProps {
  reactions: PostReaction[];
  currentUserId?: string;
}

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
      className="inline-flex items-center gap-xs"
      style={{
        background: "none",
        border: "none",
        padding: "4px 8px",
        cursor: "pointer",
        color: hasReacted ? "var(--brand-main)" : "var(--text-tertiary)",
      }}
    >
      <PawPrint size={18} weight={hasReacted ? "fill" : "light"} />
      {count > 0 && (
        <span
          className="text-sm font-medium"
          style={{ color: hasReacted ? "var(--brand-main)" : "var(--text-tertiary)" }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
