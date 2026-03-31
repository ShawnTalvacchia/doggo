"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExploreProfileRedirect({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/discover/profile/${providerId}`);
  }, [providerId, router]);

  return null;
}
