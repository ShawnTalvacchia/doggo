"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, Plus } from "@phosphor-icons/react";
import { FormHeader } from "@/components/layout/FormHeader";
import { FormFooter } from "@/components/layout/FormFooter";
import { TagAutocomplete } from "@/components/posts/TagAutocomplete";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { getUserGroups } from "@/lib/mockGroups";
import type { PostTag } from "@/lib/types";

// Mock photo pool — cycles through these when user "adds" a photo
const MOCK_PHOTOS = [
  "/images/generated/spot-portrait.jpeg",
  "/images/generated/goldie-playing.jpeg",
  "/images/generated/park-hangout-riegrovy.jpeg",
  "/images/generated/meet-greeting.jpeg",
  "/images/generated/evening-walk-group.jpeg",
  "/images/generated/spot-resting.jpeg",
];

export default function CreatePostPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<PostTag[]>([]);
  const [communityId, setCommunityId] = useState("");

  const userGroups = getUserGroups("shawn");
  const selectedGroup = userGroups.find((g) => g.id === communityId);
  const photosDisabled = selectedGroup?.photoPolicy === "none";

  function addMockPhoto() {
    if (photos.length >= 4) return;
    const nextPhoto = MOCK_PHOTOS[(photos.length) % MOCK_PHOTOS.length];
    setPhotos([...photos, nextPhoto]);
  }

  function removePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index));
  }

  const canPost = photos.length > 0 && !photosDisabled;

  return (
    <div className="page-shell">
      <div className="form-shell">
        <FormHeader
          title="Share a moment"
          subtitle="Post photos of your dog for your connections and communities."
        />

        <div className="form-body">
          {/* Photos */}
          <div className="flex flex-col gap-sm">
            <label className="text-sm font-medium text-fg-primary">
              Photos <span className="text-fg-tertiary font-normal">(1-4 required)</span>
            </label>

            {photosDisabled && (
              <div
                className="rounded-panel p-md text-sm text-fg-tertiary"
                style={{ background: "var(--surface-inset)" }}
              >
                This community has photo posting disabled.
              </div>
            )}

            {!photosDisabled && (
              <>
                {/* Photo preview */}
                {photos.length > 0 && (
                  <div style={{ position: "relative" }}>
                    <PostPhotoGrid photos={photos} />
                    {/* Remove buttons overlaid on photos */}
                    <div className="flex gap-xs" style={{ position: "absolute", top: 8, right: 8 }}>
                      {photos.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: 24,
                            height: 24,
                            background: "rgba(0,0,0,0.6)",
                            border: "none",
                            cursor: "pointer",
                            color: "white",
                          }}
                        >
                          <X size={12} weight="bold" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add photo button */}
                {photos.length < 4 && (
                  <button
                    type="button"
                    onClick={addMockPhoto}
                    className="flex flex-col items-center justify-center gap-sm rounded-panel"
                    style={{
                      height: photos.length === 0 ? 160 : 80,
                      border: "2px dashed var(--border-light)",
                      background: "var(--surface-inset)",
                      cursor: "pointer",
                    }}
                  >
                    {photos.length === 0 ? (
                      <>
                        <Camera size={28} weight="light" className="text-fg-tertiary" />
                        <span className="text-sm text-fg-tertiary">Add a photo</span>
                      </>
                    ) : (
                      <span className="flex items-center gap-xs text-sm text-fg-tertiary">
                        <Plus size={14} weight="bold" />
                        Add another ({photos.length}/4)
                      </span>
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-medium text-fg-primary">
              Caption <span className="text-fg-tertiary font-normal">(optional)</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening?"
              rows={2}
              maxLength={280}
              className="rounded-form px-md py-sm text-sm"
              style={{
                border: "1px solid var(--border-regular)",
                background: "var(--surface-base)",
                resize: "vertical",
                fontFamily: "var(--font-body)",
              }}
            />
            <span className="text-xs text-fg-tertiary text-right">{caption.length}/280</span>
          </div>

          {/* Tags */}
          <TagAutocomplete
            selectedTags={tags}
            onAddTag={(tag) => setTags([...tags, tag])}
            onRemoveTag={(tag) => setTags(tags.filter((t) => !(t.type === tag.type && t.id === tag.id)))}
          />

          {/* Community selector (optional) */}
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-medium text-fg-primary">
              Post to a community <span className="text-fg-tertiary font-normal">(optional)</span>
            </label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="rounded-form px-md py-sm text-sm"
              style={{
                border: "1px solid var(--border-regular)",
                background: "var(--surface-base)",
                fontFamily: "var(--font-body)",
              }}
            >
              <option value="">Personal post (visible to connections)</option>
              {userGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                  {g.photoPolicy === "none" ? " (no photos)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FormFooter
          onBack={() => router.back()}
          onContinue={() => router.push("/home")}
          continueLabel="Post"
          disableContinue={!canPost}
        />
      </div>
    </div>
  );
}
