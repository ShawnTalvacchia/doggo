"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { providers } from "@/lib/mockData";

/**
 * Redirect from old provider profile route to unified profile page.
 * Maps provider IDs to user IDs where possible.
 */
export default function ProviderProfileRedirect() {
  const { providerId } = useParams<{ providerId: string }>();
  const router = useRouter();

  useEffect(() => {
    const provider = providers.find((p) => p.id === providerId);
    const targetId = provider?.userId ?? providerId;
    router.replace(`/profile/${targetId}`);
  }, [providerId, router]);

  return null;
}
