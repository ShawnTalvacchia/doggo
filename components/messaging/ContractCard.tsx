import Link from "next/link";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { ChatMessage } from "@/lib/types";

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ContractCard({ msg }: { msg: ChatMessage }) {
  const c = msg.contract!;
  return (
    <div className="inbox-contract-card">
      <div className="inbox-contract-header">
        <CheckCircle size={18} weight="fill" className="inbox-contract-icon" />
        <span className="inbox-contract-label">Contract signed</span>
      </div>
      <div className="inbox-contract-body">
        <p className="inbox-contract-service">
          {SERVICE_LABELS[c.serviceType]}
          {c.subService ? ` · ${c.subService}` : ""}
        </p>
        <p className="inbox-contract-meta">
          {c.pets.join(" & ")} · From {formatShortDate(c.startDate)}
        </p>
        <p className="inbox-contract-meta">With {c.carerName}</p>
      </div>
      <Link href={`/bookings/${c.bookingId}`} className="inbox-contract-link">
        View booking <ArrowRight size={13} weight="bold" />
      </Link>
    </div>
  );
}
