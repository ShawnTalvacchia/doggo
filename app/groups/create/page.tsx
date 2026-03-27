import { redirect } from "next/navigation";

export default function GroupCreateRedirect() {
  redirect("/communities/create");
}
