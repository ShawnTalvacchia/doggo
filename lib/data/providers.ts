import { providers as localProviders } from "@/lib/mockData";
import { normalizeKcPrice } from "@/lib/pricing";
import { ProviderCard } from "@/lib/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ProviderRow = {
  id: string;
  name: string;
  district: string;
  neighborhood: string;
  rating: number;
  review_count: number;
  price_from: number;
  price_unit: "per_walk" | "per_visit" | "per_night";
  blurb: string;
  avatar_url: string;
  services: Array<"walk_checkin" | "inhome_sitting" | "boarding"> | null;
};

function rowToProviderCard(row: ProviderRow): ProviderCard {
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    neighborhood: row.neighborhood,
    rating: row.rating,
    reviewCount: row.review_count,
    priceFrom: normalizeKcPrice(row.price_from),
    priceUnit: row.price_unit,
    blurb: row.blurb,
    avatarUrl: row.avatar_url,
    services: row.services ?? [],
  };
}

export async function listProviders(): Promise<ProviderCard[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return localProviders;

  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .order("rating", { ascending: false });

  if (error || !data) return localProviders;
  return (data as ProviderRow[]).map(rowToProviderCard);
}

export async function getProviderById(providerId: string): Promise<ProviderCard | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return localProviders.find((provider) => provider.id === providerId) ?? null;
  }

  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", providerId)
    .maybeSingle();

  if (error || !data) {
    return localProviders.find((provider) => provider.id === providerId) ?? null;
  }

  return rowToProviderCard(data as ProviderRow);
}
