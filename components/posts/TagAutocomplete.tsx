"use client";

import { useState, useRef } from "react";
import { PawPrint, User, UsersThree, MapPin, Handshake, X } from "@phosphor-icons/react";
import type { PostTag, PostTagType } from "@/lib/types";
import { mockUser } from "@/lib/mockUser";
import { mockConnections } from "@/lib/mockConnections";
import { mockGroups, getUserGroups } from "@/lib/mockGroups";
import { getUserMeets } from "@/lib/mockMeets";
import { PLACES } from "@/lib/constants/places";
import { TagPill } from "./TagPill";

const TYPE_ICONS: Record<PostTagType, typeof PawPrint> = {
  dog: PawPrint,
  person: User,
  community: UsersThree,
  place: MapPin,
  meet: Handshake,
};

const TYPE_LABELS: Record<PostTagType, string> = {
  dog: "Dogs",
  person: "People",
  community: "Communities",
  place: "Places",
  meet: "Meets",
};

function getAllSearchableEntities(): { type: PostTagType; id: string; label: string }[] {
  const entities: { type: PostTagType; id: string; label: string }[] = [];

  // Dogs — from current user's pets and connections' dogs
  for (const pet of mockUser.pets) {
    entities.push({ type: "dog", id: pet.id, label: pet.name });
  }
  for (const conn of mockConnections) {
    for (const dogName of conn.dogNames) {
      entities.push({ type: "dog", id: dogName.toLowerCase(), label: dogName });
    }
  }

  // People — from connections
  for (const conn of mockConnections) {
    entities.push({ type: "person", id: conn.userId, label: conn.userName });
  }

  // Communities — user's groups
  for (const group of getUserGroups("shawn")) {
    entities.push({ type: "community", id: group.id, label: group.name });
  }

  // Places
  for (const place of PLACES) {
    entities.push({ type: "place", id: place.id, label: place.name });
  }

  // Meets
  for (const meet of getUserMeets("shawn")) {
    entities.push({ type: "meet", id: meet.id, label: meet.title });
  }

  return entities;
}

interface TagAutocompleteProps {
  selectedTags: PostTag[];
  onAddTag: (tag: PostTag) => void;
  onRemoveTag: (tag: PostTag) => void;
}

export function TagAutocomplete({ selectedTags, onAddTag, onRemoveTag }: TagAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allEntities = getAllSearchableEntities();
  const selectedKeys = new Set(selectedTags.map((t) => `${t.type}-${t.id}`));

  const filtered = query.trim()
    ? allEntities.filter(
        (e) =>
          e.label.toLowerCase().includes(query.toLowerCase()) &&
          !selectedKeys.has(`${e.type}-${e.id}`)
      )
    : [];

  // Group results by type
  const grouped = new Map<PostTagType, typeof filtered>();
  for (const item of filtered) {
    const list = grouped.get(item.type) || [];
    list.push(item);
    grouped.set(item.type, list);
  }

  function handleSelect(entity: { type: PostTagType; id: string; label: string }) {
    onAddTag({ type: entity.type, id: entity.id, label: entity.label });
    setQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-sm">
      <label className="text-sm font-medium text-fg-primary">Tags</label>

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-xs">
          {selectedTags.map((tag) => (
            <span
              key={`${tag.type}-${tag.id}`}
              className="inline-flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
              style={{ background: "var(--brand-subtle)", color: "var(--brand-strong)" }}
            >
              {tag.label}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={10} weight="bold" style={{ color: "var(--brand-strong)" }} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => query.trim() && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search dogs, people, communities, places..."
          className="w-full rounded-form px-md py-sm text-sm"
          style={{
            border: "1px solid var(--border-regular)",
            background: "var(--surface-base)",
            fontFamily: "var(--font-body)",
          }}
        />

        {/* Dropdown */}
        {showDropdown && filtered.length > 0 && (
          <div
            className="flex flex-col rounded-panel shadow-md"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 50,
              background: "var(--surface-top)",
              border: "1px solid var(--border-light)",
              maxHeight: 240,
              overflowY: "auto",
              marginTop: 4,
            }}
          >
            {(["dog", "person", "community", "place", "meet"] as PostTagType[]).map((type) => {
              const items = grouped.get(type);
              if (!items || items.length === 0) return null;
              const Icon = TYPE_ICONS[type];

              return (
                <div key={type}>
                  <div
                    className="flex items-center gap-xs px-md py-xs text-xs font-medium text-fg-tertiary"
                    style={{ background: "var(--surface-base)" }}
                  >
                    <Icon size={10} weight="light" />
                    {TYPE_LABELS[type]}
                  </div>
                  {items.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-sm px-md py-sm text-sm text-fg-primary"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <Icon size={14} weight="light" style={{ color: "var(--text-tertiary)" }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
