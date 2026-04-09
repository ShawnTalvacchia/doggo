---
category: implementation
status: active
last-reviewed: 2026-04-09
tags: [patterns, structure, detail-pages, architecture]
review-trigger: "when building new detail pages (meets, profiles, etc) or refactoring existing ones"
---

# Detail Page Pattern

_Doggo · Reusable template for tabbed detail pages_

## Overview

The Group detail page (`app/communities/[id]/page.tsx`) has been recently restructured into a clean, reusable pattern for detail pages with tabs. This document extracts that pattern so Meet detail and Profile detail can follow the same architecture, ensuring consistency across the product.

**Key principle:** Tabs are *outside* the scroll container. The banner/header content is *inside* the scrollable Feed tab. Dynamic header actions change per tab. Mobile and desktop share the same structure.

---

## Current Group Detail Architecture

### Visual Structure (desktop view)

```
┌─────────────────────────────────────┐
│  DetailHeader (back + right action) │  ← not scrolled
├─────────────────────────────────────┤
│                                     │
│  .group-detail-panel                │  ← container
│  ├─ .group-detail-tabs              │  ← TabBar (outside scroll)
│  └─ .group-detail-body              │  ← scrollable area
│     ├─ (Feed tab only) banner       │
│     ├─ (Feed tab only) group info   │
│     ├─ (active tab content)         │
│     └─ Spacer                       │
│                                     │
└─────────────────────────────────────┘
```

### Scroll Behavior

- **Not scrolled:** DetailHeader (back + title + right action button)
- **Fixed at top of panel:** TabBar (stays visible when scrolling content)
- **Scrolls:** Panel body content (banner, info, posts, meets, members, etc.)

### Mobile AppNav Integration

- `PageHeaderContext` injects the title and right action into the mobile top bar
- `setDetailHeader(title, onBack, rightAction)` is called on mount
- `rightAction` changes per tab (e.g., "Post" on Feed, "Create meet" on Meets)
- When cleared on unmount, mobile nav reverts to default state

---

## Component Tree (Group Detail)

```tsx
export default function GroupDetailPage() {
  return (
    <Suspense>
      <GroupDetailInner />
    </Suspense>
  );
}

function GroupDetailInner() {
  // State
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const [joinRequested, setJoinRequested] = useState(false);
  const group = getGroupById(params.id);
  const activeTab = searchParams.get("tab") || "feed";
  
  // Derive data
  const isMember = group.members.some(m => m.userId === "shawn");
  const isAdmin = group.members.some(m => m.userId === "shawn" && m.role === "admin");
  
  // Handle dynamic header action
  const headerAction = isMember ? (() => {
    switch (activeTab) {
      case "meets": return <ButtonAction>Create meet</ButtonAction>;
      case "members": return <ButtonAction>Invite</ButtonAction>;
      default: return group.photoPolicy !== "none" ? <ButtonAction>Post</ButtonAction> : undefined;
    }
  })() : undefined;
  
  // Feed to mobile AppNav
  useEffect(() => {
    setDetailHeader(group.name, () => router.push("/communities"), headerAction);
    return () => clearDetailHeader();
  }, [group.name, activeTab, isMember]); // Note: dependency on activeTab!
  
  const handleTabChange = (key: string) => {
    if (key === "feed") {
      router.replace(`/communities/${group.id}`, { scroll: false });
    } else {
      router.replace(`/communities/${group.id}?tab=${key}`, { scroll: false });
    }
  };

  return (
    <div className="group-detail-page">
      {/* Desktop header */}
      <DetailHeader backLabel="Back" title={group.name} rightAction={headerAction} />

      {/* Panel + tabs + scrollable body */}
      <div className="group-detail-panel">
        <div className="group-detail-tabs">
          <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
        </div>

        <div className="group-detail-body">
          {activeTab === "feed" && <FeedTab {...} />}
          {activeTab === "meets" && <MeetsTab {...} />}
          {activeTab === "members" && <MembersTab {...} />}
          {/* ... other tabs ... */}
          <Spacer />
        </div>
      </div>
    </div>
  );
}
```

### Tab Component (example: FeedTab)

```tsx
function FeedTab({ group, isMember, ... }) {
  return (
    <>
      {/* Content only in this tab — banner, info, posts */}
      <div className="group-detail-banner" style={{ backgroundImage: ... }} />
      <div className="group-detail-info">
        {/* Group name, badges, description, members, etc */}
      </div>

      {/* Posts */}
      {groupPosts.map(post => <MomentCardFromPost key={post.id} post={post} />)}
    </>
  );
}
```

---

## CSS Architecture

### Panel Layout (`globals.css` lines 11116–11197)

```css
.group-detail-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  flex: 1;
  min-height: 0;
}

.group-detail-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--surface-inset);
  border: 1px solid var(--border-stronger);
  border-radius: var(--radius-panel) var(--radius-panel) 0 0;
  overflow: hidden;  /* Critical: clips scrolling to body */
}

.group-detail-tabs {
  flex-shrink: 0;  /* Sticky at top */
  background: var(--surface-popout);
  border-bottom: 1px solid var(--border-strong);
}

.group-detail-tabs > div {
  width: 100%;
  gap: 0;  /* Tabs span full width */
}

.group-detail-tabs .tab-main {
  flex: 1;  /* Equal width tabs */
  justify-content: center;
  font-size: var(--text-md);
  height: 52px;
  padding: 0;
}

.group-detail-body {
  flex: 1;
  overflow-y: auto;  /* Only this section scrolls */
  min-height: 0;
  background: var(--surface-popout);
}
```

**Key CSS properties:**
- `.group-detail-panel { overflow: hidden }` — clips scrolling to the body
- `.group-detail-body { flex: 1; overflow-y: auto; min-height: 0 }` — enables scrolling
- `.group-detail-tabs { flex-shrink: 0 }` — stays at top while body scrolls

### Tab Styling

TabBar renders `.tab-main` buttons. The component uses `data-active` attribute (no CSS class):

```css
.tab-main {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--text-tertiary);
  border: none;
  background: none;
  cursor: pointer;
  transition: color 120ms ease;
  padding: var(--space-md);
  border-bottom: 2px solid transparent;
}

.tab-main[data-active] {
  color: var(--text-primary);
  border-bottom-color: var(--brand-main);
  font-weight: 600;
}

.tab-main:hover:not([data-active]) {
  color: var(--text-primary);
}
```

---

## Issues & Observations in Current Group Detail Page

### 1. Unused Chat Tab
- Chat tab is defined in the tab config but should not exist per product docs
- **Product spec:** "Group detail: No Chat tab. Feed with flat comments for async discussion. Meet-level Chat tab for real-time event coordination."
- **Action:** Remove the `chat` case from `getTabsForGroupType()` and the ChatTab component entirely

### 2. DetailHeader Never Shows Title on Mobile
- Mobile uses PageHeaderContext instead (sets `detailTitle`)
- Desktop shows title via DetailHeader, but only when there's *no* right action button
- This is inconsistent with Meet detail, which *does* show title
- **Current behavior (line 46):** `{title && <span className="page-detail-header-title">{title}</span>}`
- **Issue:** Title disappears if there's a right action present (due to lack of space)
- **Recommendation:** Always show title, let design handle responsive sizing

### 3. Mobile Right Action Dependencies
- The `useEffect` dependency on `activeTab` triggers a full re-render of mobile nav on every tab switch
- This is correct (action changes per tab), but watch for unnecessary work
- Consider memoizing the `headerAction` function to avoid inline re-creation

### 4. Page Container Width Not Constrained
- `.group-detail-page` sets `max-width: 640px` but this relies on parent centering
- Parent layout (`LoggedInShell`, etc.) centers it, but it's implicit
- **Recommendation:** Document that detail pages must be wrapped in a centered container

### 5. Tab Content Not Wrapped
- Tab content (`FeedTab`, `MeetsTab`, etc.) is not wrapped in a scrollable div
- Instead, `.group-detail-body` wraps all tabs and scrolls content inside
- This is correct per spec ("banner/info inside the Feed tab"), but it's a bit unintuitive — each tab component returns a fragment, not a scroll container
- **Recommendation:** Document clearly in the pattern that tab components are "content fragments," not containers

### 6. Spacer Placement
- `<Spacer />` is placed inside the scrollable body, at the end of the fragment
- This ensures bottom padding on long lists (meets, members)
- **Good pattern, but verify** — make sure Spacer is always the last child of each tab that needs it

---

## Reusable Template for Meet Detail & Profile Detail

### Page Structure

```tsx
export default function DetailPage() {
  return (
    <Suspense>
      <DetailPageInner />
    </Suspense>
  );
}

function DetailPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "primary_tab_key";
  const { setDetailHeader, clearDetailHeader } = usePageHeader();

  // Load main entity data
  const entity = getEntityById(params.id);
  if (!entity) {
    return <NotFoundError backHref={"/list-page"} />;
  }

  // Derive UI state (member status, connection state, etc.)
  const isOwn = entity.ownerId === "shawn";
  const isConnected = getConnectionState(entity.creatorId)?.state === "connected";

  // Define tabs (dynamic based on entity type, membership, etc.)
  const tabs = getTabsForEntity(entity);

  // Define right action (changes per tab)
  const headerAction = isOwn ? (() => {
    switch (activeTab) {
      case "tab_key": return <ButtonAction>Action</ButtonAction>;
      default: return undefined;
    }
  })() : undefined;

  // Feed detail header to mobile AppNav
  useEffect(() => {
    setDetailHeader(entity.name, () => router.push("/parent-list"), headerAction);
    return () => clearDetailHeader();
  }, [entity.name, activeTab]); // Include activeTab so action updates

  const handleTabChange = (key: string) => {
    const url = key === "primary_tab_key"
      ? `/path/${entity.id}`
      : `/path/${entity.id}?tab=${key}`;
    router.replace(url, { scroll: false });
  };

  return (
    <div className="[entity]-detail-page">
      <DetailHeader backLabel="Back" title={entity.name} rightAction={headerAction} />

      <div className="[entity]-detail-panel">
        <div className="[entity]-detail-tabs">
          <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
        </div>

        <div className="[entity]-detail-body">
          {activeTab === "tab_1" && <Tab1 entity={entity} ... />}
          {activeTab === "tab_2" && <Tab2 entity={entity} ... />}
          <Spacer />
        </div>
      </div>
    </div>
  );
}
```

### Tab Component Signature

```tsx
function TabComponent({
  entity,
  derived1,
  derived2,
  onAction,
}: {
  entity: Entity;
  derived1: string;
  derived2: boolean;
  onAction: () => void;
}) {
  return (
    <>
      {/* Content for this tab only */}
      {/* No wrapper div — this is a fragment */}
    </>
  );
}
```

### CSS Boilerplate

```css
/* Replace [entity] with "meet", "profile", etc */

.[entity]-detail-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  flex: 1;
  min-height: 0;
}

.[entity]-detail-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--surface-inset);
  border: 1px solid var(--border-stronger);
  border-radius: var(--radius-panel) var(--radius-panel) 0 0;
  overflow: hidden;
}

.[entity]-detail-tabs {
  flex-shrink: 0;
  background: var(--surface-popout);
  border-bottom: 1px solid var(--border-strong);
}

.[entity]-detail-tabs > div {
  width: 100%;
  gap: 0;
}

.[entity]-detail-tabs .tab-main {
  flex: 1;
  justify-content: center;
  font-size: var(--text-md);
  height: 52px;
  padding: 0;
}

.[entity]-detail-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  background: var(--surface-popout);
}
```

---

## Meet Detail — Apply the Pattern

**Current file:** `app/meets/[id]/page.tsx`

**Current structure (DIFFERENT from group detail):**
- Uses a plain `<div>` with inline flex styling, not a `.meet-detail-panel`
- Header is part of the page body (inside the flex container), not above tabs
- Tab bar has inline styling, not a dedicated class
- Tab content lives in a gap container with inline spacing

**Needed changes:**
1. Wrap the page in `.meet-detail-page` and `.meet-detail-panel`
2. Move the persistent header (meet type, title, description) above the tabs
3. Move the TabBar into a `.meet-detail-tabs` wrapper
4. Move tab content container into `.meet-detail-body`
5. Use `<Spacer />` at the end of the body
6. Integrate `PageHeaderContext` for mobile (right action changes per tab)
7. Add CSS for `.meet-detail-*` classes to globals.css

**Meet detail has:** Details · People · Chat (3 tabs)

**Right action per tab:**
- Details: "Share" button (if creator or joined)
- People: None or invite button
- Chat: None or compose button

---

## Profile Detail — Special Considerations

**Current files:**
- Own profile: `app/profile/page.tsx` (custom layout with desktop side-by-side)
- Other user: `app/profile/[userId]/page.tsx` (simpler inline tabs)

### Own Profile (app/profile/page.tsx)

Currently has:
- Desktop: side-by-side layout (left profile, right scrollable content)
- Mobile: stacked layout (header sticky, tabs, scrollable content)
- Both views use custom tab rendering

**Apply the pattern:**
1. Mobile layout already follows the pattern closely
2. Desktop layout is intentionally different (side-by-side), keep as is
3. Extract the tab navigation into a reusable component
4. Consider extracting the mobile layout into `.profile-detail-*` classes for consistency

### Other User Profile (app/profile/[userId]/page.tsx)

Currently has:
- Simple inline tabs below the header
- Tab content in a `<div className="p-lg">`
- No scrollable body pattern

**Apply the pattern:**
1. Use `.profile-detail-page` and `.profile-detail-panel`
2. Wrap tabs in `.profile-detail-tabs`
3. Wrap content in `.profile-detail-body`
4. Add CSS classes to globals.css
5. Integrate `PageHeaderContext` (less critical — profile has fewer actions)

---

## Key Implementation Guidelines

### 1. Tab URL Pattern

- **Default tab (no query param):**
  ```tsx
  router.replace(`/path/${id}`, { scroll: false });
  ```
- **Secondary tabs (with query param):**
  ```tsx
  router.replace(`/path/${id}?tab=${key}`, { scroll: false });
  ```
- **Always use `scroll: false`** to prevent jumping to top

### 2. Mobile AppNav Integration

```tsx
useEffect(() => {
  setDetailHeader(
    entity.name,                    // title shown in mobile nav
    () => router.push("/back-url"), // back action
    headerAction                    // right-side button (changes per tab)
  );
  return () => clearDetailHeader();
}, [entity.name, activeTab]); // Include activeTab!
```

**Critical:** Include `activeTab` in dependencies so the mobile action updates when tabs change.

### 3. DetailHeader Behavior

- **Desktop:** Shows title next to back button, right action on far right
- **Mobile:** Title goes to AppNav, back/right action go to AppNav
- **Responsive:** DetailHeader is always rendered but visually hidden on mobile (CSS)

### 4. Spacer Usage

- Always include `<Spacer />` as the last child of `.detail-body`
- Ensures padding at the bottom of scrollable content
- Prevents content from being hidden under a fixed footer (if one exists)

### 5. Tab Content as Fragments

- Tab components return `<>...</>` fragments, not wrapped divs
- The `.detail-body` container provides flex layout and scrolling
- This keeps the component tree flat

### 6. Empty States

- Use `<EmptyState />` component for zero-state content
- Wrap it in `<LayoutSection />` for consistent padding
- Always include an action button or explanation

---

## Shared Components for Extraction

### Candidate: Generic TabbedDetailPanel

Current state: Each page copies the same HTML structure.

```tsx
interface TabbedDetailPanelProps {
  tabs: Array<{ key: string; label: string }>;
  activeTab: string;
  onTabChange: (key: string) => void;
  children: React.ReactNode;
}

export function TabbedDetailPanel({
  tabs,
  activeTab,
  onTabChange,
  children,
}: TabbedDetailPanelProps) {
  return (
    <div className="[entity]-detail-panel">
      <div className="[entity]-detail-tabs">
        <TabBar tabs={tabs} activeKey={activeTab} onChange={onTabChange} />
      </div>
      <div className="[entity]-detail-body">
        {children}
        <Spacer />
      </div>
    </div>
  );
}
```

**Recommendation:** Extract this only if Meet and Profile both commit to the pattern. Group detail is the proof of concept; meet and profile are the validation. If all three follow the pattern cleanly, extract to `components/layout/TabbedDetailPanel.tsx`.

---

## Responsive Behavior

### Desktop (> 620px)

- DetailHeader visible at top
- Tabs sticky below header
- Full-width content scrolls
- Panel max-width: 640px (centered by parent)

### Mobile (< 620px)

- DetailHeader hidden (CSS `display: none`)
- AppNav shows title + back + right action
- Tabs visible below app bar
- Full-width content scrolls
- Panel full width with bottom nav safe area

**CSS breakpoint:** Media queries around 621px (used in profile/page.tsx)

---

## Testing Checklist

When implementing a new detail page:

- [ ] Page loads without error
- [ ] Tabs switch without reloading (URL updates via router.replace)
- [ ] No scroll jump when switching tabs (`scroll: false` is set)
- [ ] Mobile AppNav title updates correctly
- [ ] Mobile AppNav right action changes per tab
- [ ] DetailHeader visible on desktop, hidden on mobile
- [ ] Content scrolls, not the whole page
- [ ] Tabs stay visible while scrolling
- [ ] Bottom content not hidden by nav (Spacer present)
- [ ] Empty states show with helpful CTAs
- [ ] Back button navigates to list page
- [ ] Right action button functions correctly on active tab
- [ ] Page cleans up context on unmount (no lingering mobile nav state)

---

## References

- **Group detail page:** `app/communities/[id]/page.tsx` — reference implementation
- **DetailHeader component:** `components/layout/DetailHeader.tsx`
- **PageHeaderContext:** `contexts/PageHeaderContext.tsx`
- **TabBar component:** `components/ui/TabBar.tsx`
- **CSS classes:** `app/globals.css` lines 11116–11197 (group detail), 7368–7419 (page detail header)
- **Meet detail page:** `app/meets/[id]/page.tsx` — needs refactor
- **Profile pages:** `app/profile/page.tsx`, `app/profile/[userId]/page.tsx` — needs refactor
- **Product spec:** `docs/strategy/Groups & Care Model.md` — group/meet tab specs
