import { redirect } from "next/navigation";

export default function ExploreResultsPage() {
  redirect("/discover?tab=care");
}
