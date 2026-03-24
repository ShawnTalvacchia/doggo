import { SERVICE_LABELS } from "@/lib/constants/services";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { ChatMessage, Conversation } from "@/lib/types";

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SigningModal({
  msg,
  conv,
  open,
  onClose,
  onSign,
}: {
  msg: ChatMessage | null;
  conv: Conversation;
  open: boolean;
  onClose: () => void;
  onSign: (msgId: string) => void;
}) {
  if (!msg?.proposal) return null;
  const p = msg.proposal;

  const scheduleText = p.recurringSchedule
    ? `Every ${p.recurringSchedule.days.join(", ")} · ${p.recurringSchedule.timeLabel}`
    : p.endDate
    ? `${formatShortDate(p.startDate)} – ${formatShortDate(p.endDate)}`
    : `From ${formatShortDate(p.startDate)}`;

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Review contract"
      footer={
        <div className="signing-footer-actions">
          <ButtonAction variant="primary" onClick={() => onSign(msg.id)}>
            Sign & Book
          </ButtonAction>
          <ButtonAction variant="tertiary" onClick={onClose}>
            Not yet
          </ButtonAction>
        </div>
      }
    >
      <div className="signing-body">
        {/* Carer */}
        <div className="signing-carer-row">
          <img
            src={conv.providerAvatarUrl}
            alt={conv.providerName}
            className="signing-carer-avatar"
          />
          <div>
            <p className="signing-carer-name">{conv.providerName}</p>
            <p className="signing-carer-sub">Pet carer</p>
          </div>
        </div>

        {/* Details */}
        <div className="signing-section">
          <div className="signing-row">
            <span className="signing-field">Service</span>
            <span className="signing-value">
              {SERVICE_LABELS[p.serviceType]}
              {p.subService ? ` · ${p.subService}` : ""}
            </span>
          </div>
          <div className="signing-row">
            <span className="signing-field">Pets</span>
            <span className="signing-value">{p.pets.join(", ")}</span>
          </div>
          <div className="signing-row">
            <span className="signing-field">
              {p.recurringSchedule ? "Schedule" : "Dates"}
            </span>
            <span className="signing-value">{scheduleText}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="signing-price-section">
          <p className="signing-price-heading">Pricing</p>
          {p.price.lineItems.map((item, i) => (
            <div key={i} className="signing-price-row">
              <span className="signing-price-label">{item.label}</span>
              <span className="signing-price-amount">
                {item.isModifier ? "+" : ""}
                {item.amount.toLocaleString()} Kč
                <span className="signing-price-unit"> / {item.unit}</span>
              </span>
            </div>
          ))}
          {p.price.lineItems.length > 1 && (
            <>
              <div className="signing-price-divider" />
              <div className="signing-price-row signing-price-total-row">
                <span className="signing-price-label">Total</span>
                <span className="signing-price-amount signing-price-total">
                  {p.price.total.toLocaleString()} Kč
                  {p.price.billingCycle === "per_session"
                    ? " / session"
                    : p.price.billingCycle === "per_night"
                    ? " / night"
                    : ""}
                </span>
              </div>
            </>
          )}
        </div>

        <p className="signing-legal-note">
          By signing, you agree to the contract terms outlined above. You can view your
          booking anytime in the Bookings tab.
        </p>
      </div>
    </ModalSheet>
  );
}
