"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useConversations } from "@/contexts/ConversationsContext";
import { ThreadClient } from "./ThreadClient";
import type { ServiceType } from "@/lib/types";

interface Props {
  params: Promise<{ conversationId: string }>;
}

export default function ThreadPage({ params }: Props) {
  const { conversationId } = use(params);
  const searchParams = useSearchParams();
  const { getConversation } = useConversations();
  const conversation = getConversation(conversationId);

  if (!conversation) notFound();

  // Pre-fill inquiry form from URL search params (passed through from explore filters)
  const initialService = (searchParams.get("service") as ServiceType | null) ?? null;
  const initialStart = searchParams.get("start") ?? null;
  const initialEnd = searchParams.get("end") ?? null;

  return (
    <ThreadClient
      conv={conversation}
      initialService={initialService}
      initialStart={initialStart}
      initialEnd={initialEnd}
    />
  );
}
