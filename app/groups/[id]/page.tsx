import { redirect } from "next/navigation";

export default function GroupDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/communities/${params.id}`);
}
