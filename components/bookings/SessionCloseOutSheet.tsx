"use client";

/**
 * SessionCloseOutSheet — provider's structured visit-report at session
 * close-out. Replaces the prior "tap Complete + maybe add a note" stub
 * with a real artifact: photos + notes + structured care checks + walk
 * metrics. Per Time To Pet research (`Competitive Research - Time To
 * Pet.md` §1), this is the surface that makes pet parents feel safe.
 *
 * Single-step form (close-out is one conceptual moment, unlike the
 * stepped post-meet review which separates reflection from connection
 * decisions). Photos that accumulated during the active session via
 * mid-session updates render at the top; provider can add more here.
 *
 * Fields conditional on `serviceType`:
 *   walk_checkin   → walked, pottied + distance + duration
 *   inhome_sitting → fed, watered, walked, pottied, medsGiven
 *   boarding       → fed, watered, walked, pottied, medsGiven
 *   appointment    → not applicable (no sessions on appointment bookings)
 *
 * Sessions & Service Execution, 2026-05-05.
 */

import { useEffect, useState } from "react";
import {
  Camera,
  UploadSimple,
  X,
  Bone,
  Drop,
  PersonSimpleWalk,
  Tree,
  Pill,
  Ruler,
  Clock,
} from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { BookingSession, ServiceType, VisitReport } from "@/lib/types";

type CheckKey = "fed" | "watered" | "walked" | "pottied" | "medsGiven";

const CHECK_LABELS: Record<CheckKey, string> = {
  fed: "Fed",
  watered: "Watered",
  walked: "Walked",
  pottied: "Pottied",
  medsGiven: "Meds given",
};

const CHECK_ICONS: Record<CheckKey, React.ReactNode> = {
  fed: <Bone size={14} weight="light" />,
  watered: <Drop size={14} weight="light" />,
  walked: <PersonSimpleWalk size={14} weight="light" />,
  pottied: <Tree size={14} weight="light" />,
  medsGiven: <Pill size={14} weight="light" />,
};

function checksForService(serviceType: ServiceType): CheckKey[] {
  if (serviceType === "walk_checkin") return ["walked", "pottied"];
  // sitting + boarding both surface the full set
  return ["fed", "watered", "walked", "pottied", "medsGiven"];
}

function showsWalkMetrics(serviceType: ServiceType): boolean {
  return serviceType === "walk_checkin";
}

export type SessionCloseOutSheetProps = {
  open: boolean;
  onClose: () => void;
  session: BookingSession | null;
  serviceType: ServiceType;
  /** Photos that accumulated during the active session (mid-session
   *  updates from provider). Rendered as a sealed grid above the
   *  uploader so the provider sees what's already in the report. */
  existingPhotos?: string[];
  onSubmit: (report: VisitReport) => void;
};

export function SessionCloseOutSheet({
  open,
  onClose,
  session,
  serviceType,
  existingPhotos = [],
  onSubmit,
}: SessionCloseOutSheetProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [checks, setChecks] = useState<Partial<Record<CheckKey, boolean>>>({});
  const [distanceKm, setDistanceKm] = useState<string>("");
  const [durationMin, setDurationMin] = useState<string>("");

  // Reset state when the sheet closes so a re-open starts clean.
  useEffect(() => {
    if (!open) {
      setPhotos([]);
      setNotes("");
      setChecks({});
      setDistanceKm("");
      setDurationMin("");
    }
  }, [open]);

  if (!session) return null;

  const applicableChecks = checksForService(serviceType);
  const wantsMetrics = showsWalkMetrics(serviceType);
  const canSubmit = notes.trim().length > 0;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotos((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function toggleCheck(key: CheckKey) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const report: VisitReport = {
      photos: [...existingPhotos, ...photos],
      notes: notes.trim(),
      checks: Object.fromEntries(
        applicableChecks
          .filter((k) => checks[k] !== undefined)
          .map((k) => [k, !!checks[k]]),
      ),
      ...(wantsMetrics && distanceKm ? { walkDistanceKm: parseFloat(distanceKm) } : {}),
      ...(wantsMetrics && durationMin ? { walkDurationMin: parseInt(durationMin, 10) } : {}),
      completedAt: new Date().toISOString(),
    };
    onSubmit(report);
  }

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Visit report"
      footer={
        <div className="flex items-center justify-between w-full gap-sm">
          <ButtonAction variant="tertiary" size="md" onClick={onClose}>
            Cancel
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Send report
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-lg p-lg">
        {/* Photos */}
        <div className="flex flex-col gap-sm">
          <span className="text-sm font-semibold text-fg-primary">Photos</span>

          {(existingPhotos.length > 0 || photos.length > 0) && (
            <div className="grid grid-cols-3 gap-xs">
              {existingPhotos.map((url, i) => (
                <div
                  key={`existing-${i}`}
                  className="relative overflow-hidden rounded-md bg-surface-inset"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {photos.map((url, i) => (
                <div
                  key={`new-${i}`}
                  className="relative overflow-hidden rounded-md bg-surface-inset"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                    aria-label="Remove photo"
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer text-white bg-[color:var(--transparent-dark-40)] hover:bg-[color:var(--transparent-dark-64)]"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
              ))}
              <label
                className="relative overflow-hidden rounded-md bg-surface-base border-2 border-dashed border-edge-strong flex flex-col items-center justify-center gap-xs cursor-pointer text-fg-secondary"
                style={{ aspectRatio: "1 / 1" }}
              >
                <Camera size={20} weight="light" />
                <span className="text-xs font-semibold">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {existingPhotos.length === 0 && photos.length === 0 && (
            <label className="flex flex-col items-center justify-center gap-xs rounded-panel p-lg text-sm font-medium cursor-pointer bg-surface-top border border-dashed border-edge-regular text-fg-secondary">
              <UploadSimple size={24} weight="light" />
              <span>Add a photo</span>
              <span className="text-xs text-fg-tertiary">Owners love these</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Notes */}
        <div className="input-block">
          <label className="label" htmlFor="close-out-notes">
            <span className="label-primary-group">
              <span>Notes</span>
            </span>
          </label>
          <textarea
            id="close-out-notes"
            className="textarea"
            placeholder="How did it go? Anything the owner should know."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Care checks */}
        <div className="flex flex-col gap-sm">
          <span className="text-sm font-semibold text-fg-primary">Care checks</span>
          <span className="text-xs text-fg-tertiary">Tap any that apply.</span>
          <div className="flex flex-wrap gap-xs">
            {applicableChecks.map((key) => {
              const on = !!checks[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleCheck(key)}
                  className={`inline-flex items-center gap-xs rounded-pill px-md py-xs text-sm font-medium cursor-pointer transition-colors border ${
                    on
                      ? "bg-brand-main text-white border-transparent"
                      : "bg-surface-top text-fg-secondary border-edge-regular hover:border-edge-strong"
                  }`}
                >
                  {CHECK_ICONS[key]}
                  {CHECK_LABELS[key]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Walk metrics */}
        {wantsMetrics && (
          <div className="flex flex-col gap-sm">
            <span className="text-sm font-semibold text-fg-primary">Walk details</span>
            <div className="grid grid-cols-2 gap-sm">
              <div className="input-block">
                <label className="label" htmlFor="close-out-distance">
                  <span className="label-primary-group">
                    <Ruler size={12} weight="light" />
                    <span>Distance</span>
                    <span className="label-secondary">(km)</span>
                  </span>
                </label>
                <input
                  id="close-out-distance"
                  type="number"
                  step="0.1"
                  min="0"
                  className="input"
                  placeholder="2.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label className="label" htmlFor="close-out-duration">
                  <span className="label-primary-group">
                    <Clock size={12} weight="light" />
                    <span>Duration</span>
                    <span className="label-secondary">(min)</span>
                  </span>
                </label>
                <input
                  id="close-out-duration"
                  type="number"
                  min="0"
                  className="input"
                  placeholder="45"
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalSheet>
  );
}
