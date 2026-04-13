"use client";

import { useState, useRef, useCallback } from "react";
import {
  Camera,
  MapPin,
  PawPrint,
  User,
  UsersThree,
  Handshake,
  X,
  Plus,
  CaretRight,
  Check,
  Images,
} from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { SearchInput } from "@/components/ui/SearchInput";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { mockUser } from "@/lib/mockUser";
import { mockConnections } from "@/lib/mockConnections";
import { getUserGroups } from "@/lib/mockGroups";
import { getUserMeets } from "@/lib/mockMeets";
import { PLACES } from "@/lib/constants/places";
import type { PostTag, PostTagType } from "@/lib/types";

/* ── Mock data ── */

const MOCK_PHOTOS = [
  "/images/generated/spot-portrait.jpeg",
  "/images/generated/goldie-playing.jpeg",
  "/images/generated/park-hangout-riegrovy.jpeg",
  "/images/generated/meet-greeting.jpeg",
  "/images/generated/evening-walk-group.jpeg",
  "/images/generated/spot-resting.jpeg",
];

/* ── Tag entity helpers ── */

type TagPickerType = PostTagType | null;

interface TagOption {
  type: PostTagType;
  id: string;
  label: string;
  imageUrl?: string;
}

const TAG_TYPE_ICON: Record<PostTagType, typeof MapPin> = {
  place: MapPin,
  dog: PawPrint,
  person: User,
  community: UsersThree,
  meet: Handshake,
};

/** Single-select types replace previous selection instead of accumulating */
const SINGLE_SELECT_TYPES: Set<PostTagType> = new Set(["place", "meet"]);

/** Types that don't show suggestion pills in the header (context-dependent — will be wired during persona/flow building) */
const NO_SUGGESTIONS: Set<PostTagType> = new Set(["community", "meet"]);

const TAG_ROWS: { type: PostTagType; label: string }[] = [
  { type: "place", label: "Add location" },
  { type: "dog", label: "Tag pets" },
  { type: "person", label: "Tag people" },
  { type: "community", label: "Post to community" },
  { type: "meet", label: "Tag a meet" },
];

function getEntitiesForType(type: PostTagType): TagOption[] {
  switch (type) {
    case "place":
      return PLACES.map((p) => ({ type: "place", id: p.id, label: p.name }));
    case "dog":
      return [
        ...mockUser.pets.map((p) => ({ type: "dog" as const, id: p.id, label: p.name, imageUrl: p.imageUrl })),
        ...mockConnections.flatMap((c) =>
          c.dogNames.map((name) => ({ type: "dog" as const, id: name.toLowerCase(), label: name }))
        ),
      ];
    case "person":
      return mockConnections.map((c) => ({
        type: "person" as const, id: c.userId, label: c.userName, imageUrl: c.avatarUrl,
      }));
    case "community":
      return getUserGroups("shawn").map((g) => ({
        type: "community" as const, id: g.id, label: g.name, imageUrl: g.coverPhotoUrl,
      }));
    case "meet":
      return getUserMeets("shawn").map((m) => ({
        type: "meet" as const, id: m.id, label: m.title,
      }));
    default:
      return [];
  }
}

function getSuggestions(type: PostTagType, selectedKeys: Set<string>): TagOption[] {
  if (NO_SUGGESTIONS.has(type)) return [];

  const isSingle = SINGLE_SELECT_TYPES.has(type);
  const max = type === "dog"
    ? mockUser.pets.length   // suggest all owned pets
    : isSingle ? 1 : 3;

  return getEntitiesForType(type)
    .filter((e) => !selectedKeys.has(`${e.type}-${e.id}`))
    .slice(0, max);
}

/* ── Sub-components ── */

const PROMPTS = [
  "What's your pup up to?",
  "Show off that face!",
  "How was today's walk?",
  "Share a favourite moment",
  "Capture the cuteness",
];

/** Phase 1: Photo picker empty state */
function PhotoPickerEmpty({ onAdd }: { onAdd: () => void }) {
  // Stable random prompt per mount
  const promptRef = useRef(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  return (
    <div className="composer-empty">
      <div className="composer-empty-icon">
        <PawPrint size={40} weight="light" />
      </div>
      <div className="composer-empty-text">
        <span className="composer-empty-prompt">{promptRef.current}</span>
        <span className="composer-empty-hint">Add a photo to share with your community</span>
      </div>
      <div className="composer-empty-actions">
        <ButtonAction variant="primary" size="sm" cta onClick={onAdd} leftIcon={<Camera size={16} weight="light" />}>
          Camera
        </ButtonAction>
        <ButtonAction variant="outline" size="sm" cta onClick={onAdd} leftIcon={<Images size={16} weight="light" />}>
          Gallery
        </ButtonAction>
      </div>
    </div>
  );
}

/** Photo hero with selected photos */
function PhotoHero({
  photos,
  onRemove,
  onAdd,
}: {
  photos: string[];
  onRemove: (i: number) => void;
  onAdd: () => void;
}) {
  if (photos.length === 1) {
    return (
      <div style={{ position: "relative" }}>
        <img src={photos[0]} alt="" className="composer-hero-img" />
        <button type="button" onClick={() => onRemove(0)} className="composer-photo-remove composer-photo-remove--lg">
          <X size={12} weight="bold" />
        </button>
        <button type="button" onClick={onAdd} className="composer-add-more">
          <Plus size={12} weight="bold" /> Add more
        </button>
      </div>
    );
  }

  return (
    <div className="composer-carousel">
      {photos.map((url, i) => (
        <div key={i} className="composer-carousel-item">
          <img src={url} alt="" className="composer-carousel-img" />
          <button type="button" onClick={() => onRemove(i)} className="composer-photo-remove composer-photo-remove--sm">
            <X size={10} weight="bold" />
          </button>
        </div>
      ))}
      {photos.length < 4 && (
        <button type="button" onClick={onAdd} className="composer-carousel-add">
          <Plus size={18} weight="light" />
        </button>
      )}
    </div>
  );
}

/** Accordion tag row with inline suggestions in header */
function AccordionRow({
  type,
  label,
  tags,
  isOpen,
  onToggle,
  onSelectTag,
  onRemoveTag,
  selectedKeys,
  pickerQuery,
  onPickerQueryChange,
}: {
  type: PostTagType;
  label: string;
  tags: PostTag[];
  isOpen: boolean;
  onToggle: () => void;
  onSelectTag: (opt: TagOption) => void;
  onRemoveTag: (opt: TagOption) => void;
  selectedKeys: Set<string>;
  pickerQuery: string;
  onPickerQueryChange: (q: string) => void;
}) {
  const Icon = TAG_TYPE_ICON[type];
  const typeTags = tags.filter((t) => t.type === type);
  const suggestions = getSuggestions(type, selectedKeys);
  const isSingleSelect = SINGLE_SELECT_TYPES.has(type);

  const pickerOptions = getEntitiesForType(type).filter(
    (e) => !pickerQuery.trim() || e.label.toLowerCase().includes(pickerQuery.toLowerCase())
  );

  const searchPlaceholder = `Search ${label.replace(/^(Add |Tag |Post to )/, "").toLowerCase()}...`;

  return (
    <div>
      {/* Row header */}
      <button type="button" onClick={onToggle} className="accordion-row">
        <Icon
          size={20}
          weight="light"
          className={`accordion-row-icon${typeTags.length > 0 ? " accordion-row-icon--active" : ""}`}
        />
        <span className="accordion-row-label">{label}</span>

        {/* Selected pills OR suggestion pills in the header */}
        {typeTags.length > 0 ? (
          <div className="accordion-row-pills">
            {typeTags.map((tag) => (
              <span key={`${tag.type}-${tag.id}`} className="selected-pill">
                {tag.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTag(tag);
                  }}
                  className="selected-pill-remove"
                >
                  <X size={9} weight="bold" />
                </button>
              </span>
            ))}
          </div>
        ) : !isOpen && suggestions.length > 0 ? (
          <div className="accordion-row-pills">
            {suggestions.map((opt) => (
              <button
                key={`sug-${opt.type}-${opt.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag(opt);
                }}
                className="suggestion-pill"
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}

        <CaretRight
          size={14}
          weight="bold"
          className={`accordion-row-caret${isOpen ? " accordion-row-caret--open" : ""}`}
        />
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div className="accordion-body">
          <SearchInput
            value={pickerQuery}
            onChange={onPickerQueryChange}
            placeholder={searchPlaceholder}
            autoFocus
          />

          <div className="accordion-body-list">
            {pickerOptions.map((opt) => {
              const selected = selectedKeys.has(`${opt.type}-${opt.id}`);
              return (
                <button
                  key={`${opt.type}-${opt.id}`}
                  type="button"
                  onClick={() => (selected ? onRemoveTag(opt) : onSelectTag(opt))}
                  className="accordion-body-option"
                >
                  {opt.imageUrl ? (
                    <img src={opt.imageUrl} alt="" className="accordion-body-avatar" />
                  ) : (
                    <div className="accordion-body-avatar-placeholder">
                      <Icon size={14} weight="light" />
                    </div>
                  )}
                  <span className="flex-1">{opt.label}</span>
                  {selected && <Check size={16} weight="bold" className="text-brand-main shrink-0" />}
                </button>
              );
            })}
            {pickerOptions.length === 0 && (
              <span className="text-xs text-fg-tertiary p-xs">No results</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main composer ── */

export function PostComposer() {
  const { isOpen, preselectedGroupId, closeComposer } = usePostComposer();
  const [photos, setPhotos] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<PostTag[]>([]);
  const [activePicker, setActivePicker] = useState<TagPickerType>(null);
  const [pickerQuery, setPickerQuery] = useState("");

  const hasSetPreselected = useRef(false);
  if (isOpen && preselectedGroupId && !hasSetPreselected.current) {
    const group = getUserGroups("shawn").find((g) => g.id === preselectedGroupId);
    if (group && !tags.some((t) => t.type === "community" && t.id === group.id)) {
      setTags((prev) => [...prev, { type: "community", id: group.id, label: group.name }]);
    }
    hasSetPreselected.current = true;
  }

  const handleClose = useCallback(() => {
    closeComposer();
    setPhotos([]);
    setCaption("");
    setTags([]);
    setActivePicker(null);
    setPickerQuery("");
    hasSetPreselected.current = false;
  }, [closeComposer]);

  function addMockPhoto() {
    if (photos.length >= 4) return;
    setPhotos([...photos, MOCK_PHOTOS[photos.length % MOCK_PHOTOS.length]]);
  }

  function removePhoto(i: number) {
    setPhotos(photos.filter((_, idx) => idx !== i));
  }

  function selectTag(option: TagOption) {
    if (SINGLE_SELECT_TYPES.has(option.type)) {
      // Replace any existing tag of this type
      setTags([...tags.filter((t) => t.type !== option.type), { type: option.type, id: option.id, label: option.label }]);
    } else {
      if (!tags.some((t) => t.type === option.type && t.id === option.id)) {
        setTags([...tags, { type: option.type, id: option.id, label: option.label }]);
      }
    }
  }

  function removeTag(option: TagOption) {
    setTags(tags.filter((t) => !(t.type === option.type && t.id === option.id)));
  }

  const selectedKeys = new Set(tags.map((t) => `${t.type}-${t.id}`));
  const canPost = photos.length > 0;
  const hasPhotos = photos.length > 0;

  const footer = hasPhotos ? (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-sm">
        {photos.slice(0, 4).map((url, i) => (
          <img key={i} src={url} alt="" className="composer-footer-thumb" />
        ))}
        {photos.length < 4 && (
          <button type="button" onClick={addMockPhoto} className="composer-footer-add">
            <Plus size={10} weight="bold" />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleClose}
        disabled={!canPost}
        className={`composer-share-btn${canPost ? " composer-share-btn--active" : ""}`}
      >
        Share
      </button>
    </div>
  ) : undefined;

  return (
    <ModalSheet open={isOpen} onClose={handleClose} title="Share a moment" footer={footer}>
      <div className="flex flex-col">
        {/* Phase 1: Photo selection */}
        {!hasPhotos && <PhotoPickerEmpty onAdd={addMockPhoto} />}

        {/* Phase 2: Photo hero + caption + tags (only after photos added) */}
        {hasPhotos && (
          <>
            <PhotoHero photos={photos} onRemove={removePhoto} onAdd={addMockPhoto} />

            {/* Caption */}
            <div className="composer-caption">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                rows={2}
                maxLength={280}
                className="composer-caption-input"
              />
              {caption.length > 200 && (
                <span className="text-xs text-fg-tertiary" style={{ float: "right" }}>{caption.length}/280</span>
              )}
            </div>

            {/* Tag accordion rows */}
            <div className="composer-tags-section">
              {TAG_ROWS.map(({ type, label }) => (
                <AccordionRow
                  key={type}
                  type={type}
                  label={label}
                  tags={tags}
                  isOpen={activePicker === type}
                  onToggle={() => {
                    setActivePicker(activePicker === type ? null : type);
                    setPickerQuery("");
                  }}
                  onSelectTag={selectTag}
                  onRemoveTag={removeTag}
                  selectedKeys={selectedKeys}
                  pickerQuery={activePicker === type ? pickerQuery : ""}
                  onPickerQueryChange={setPickerQuery}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ModalSheet>
  );
}
