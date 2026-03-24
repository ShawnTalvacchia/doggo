"use client";

export interface MessageBubbleData {
  senderName: string;
  senderAvatarUrl: string;
  text: string;
  sentAt: string;
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({
  message,
  isOwn,
}: {
  message: MessageBubbleData;
  isOwn: boolean;
}) {
  return (
    <div className={`flex gap-sm ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <img
          src={message.senderAvatarUrl}
          alt={message.senderName}
          className="rounded-full shrink-0"
          style={{ width: 32, height: 32, objectFit: "cover" }}
        />
      )}
      <div
        className="flex flex-col gap-xs rounded-lg px-md py-sm"
        style={{
          maxWidth: "75%",
          background: isOwn ? "var(--brand-subtle)" : "var(--surface-top)",
          border: isOwn ? "none" : "1px solid var(--border-light)",
        }}
      >
        {!isOwn && (
          <span className="text-xs font-medium text-fg-primary">
            {message.senderName}
          </span>
        )}
        <span className="text-sm text-fg-primary">{message.text}</span>
        <span
          className="text-xs text-fg-tertiary"
          style={{ textAlign: isOwn ? "right" : "left" }}
        >
          {formatMessageTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}
