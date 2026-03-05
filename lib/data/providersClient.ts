import { ProviderCard, ProviderProfileContent } from "@/lib/types";

type ProvidersResponse = {
  providers: ProviderCard[];
};

type ProviderResponse = {
  provider: ProviderCard;
};

type ProviderContentResponse = {
  content: ProviderProfileContent;
};

export async function fetchProviders(): Promise<ProviderCard[]> {
  const response = await fetch("/api/providers", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch providers");
  }

  const payload = (await response.json()) as ProvidersResponse;
  return payload.providers;
}

export async function fetchProviderById(providerId: string): Promise<ProviderCard | null> {
  // Cache for 5 minutes — provider data is stable in demo context
  const response = await fetch(`/api/providers/${providerId}`, { next: { revalidate: 300 } });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Failed to fetch provider");
  }

  const payload = (await response.json()) as ProviderResponse;
  return payload.provider;
}

export async function fetchProviderContentById(
  providerId: string,
): Promise<ProviderProfileContent | null> {
  // Cache for 5 minutes — content is stable in demo context
  const response = await fetch(`/api/providers/${providerId}/content`, {
    next: { revalidate: 300 },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Failed to fetch provider content");
  }

  const payload = (await response.json()) as ProviderContentResponse;
  return payload.content;
}
