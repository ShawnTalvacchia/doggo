import { CreditCard, CheckCircle } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { ChatMessage } from "@/lib/types";

export function PaymentCard({ msg }: { msg: ChatMessage }) {
  const summary = msg.paymentSummary;
  if (!summary) return null;

  const isPaid = summary.status === "paid";

  return (
    <div className="rounded-panel p-md shadow-xs bg-surface-base border border-edge-regular" style={{ maxWidth: 320 }}>
      <div className="flex items-center gap-xs mb-sm">
        <CreditCard size={18} weight="light" className="text-brand-main" />
        <span className="text-sm font-semibold text-fg-primary">
          {isPaid ? "Payment confirmed" : "Payment summary"}
        </span>
      </div>
      {summary.lineItems.map((item, i) => (
        <div key={i} className="flex justify-between text-xs text-fg-secondary mb-xs">
          <span>{item.label}</span>
          <span>{item.amount} {summary.currency} / {item.unit}</span>
        </div>
      ))}
      <div className="flex justify-between text-xs text-fg-tertiary mb-xs border-t border-edge-light pt-xs">
        <span>Platform fee ({summary.platformFeePercent}%)</span>
        <span>{summary.platformFeeAmount} {summary.currency}</span>
      </div>
      <div className="flex justify-between text-sm font-semibold text-fg-primary mt-sm border-t border-edge-regular pt-sm">
        <span>Total</span>
        <span>{summary.total} {summary.currency}</span>
      </div>
      {!isPaid && (
        <>
          <ButtonAction
            variant="primary"
            size="sm"
            className="w-full mt-md"
            onClick={() => { /* mock — would transition to paid */ }}
          >
            Pay through Doggo
          </ButtonAction>
          <p className="text-xs text-fg-tertiary mt-xs text-center">
            Clear records, easy cancellation, and care history tracking.
          </p>
        </>
      )}
      {isPaid && (
        <div className="flex items-center justify-center gap-xs mt-sm text-sm font-medium text-status-success">
          <CheckCircle size={16} weight="fill" /> Paid
        </div>
      )}
    </div>
  );
}
