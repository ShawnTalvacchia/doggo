import { redirect } from "next/navigation";

export default function MeetsRedirect() {
  redirect("/activity?tab=discover");
}
