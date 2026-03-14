---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments: []
lastStep: 14
---

# UX Design Specification — 3dup

**Author:** Ira
**Date:** 2026-03-13

**Focus:** Mobile view for the full platform (requested at workflow start)

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

3dup is a project and asset management platform for real estate visuals. The product supports two roles (admin and freelancer) with the same feature set and flows; the UX design focus is to **preserve that experience and adapt it for mobile**—responsive layout and touch-friendly patterns without changing scope or user goals.

### Target Users

- **Admins:** Manage projects, apartments, building/apartment assets, freelancer assignment, and review of room renders. May use mobile for quick checks or on-site.
- **Freelancers:** View assigned projects and apartment/room context, upload tiered renders (Standard, Affordable luxury, Luxury premium). Likely to use phones or tablets in the field.

### Key Design Challenges

- **Navigation:** Sidebar must adapt to small screens (e.g. hamburger + drawer/sheet) while keeping the same routes and hierarchy (Projects, Freelancers for admin; My Projects for freelancer).
- **Density:** Accordion-heavy, card-based layouts (project list, apartment list, assets, moodboards, rooms) must reflow to single column and remain scannable and tappable on narrow viewports.
- **Touch targets:** Buttons, accordion triggers, status dropdowns, and upload zones must meet mobile touch-target size and spacing without changing behavior.
- **Consistency:** Same labels, tiers, and flows on mobile as desktop; only layout and interaction patterns change.

### Design Opportunities

- **Progressive disclosure:** Accordions (all default closed) already reduce cognitive load; on mobile they keep the screen focused and avoid long scrolls of open content.
- **Familiar patterns:** Bottom or top nav, drawer sidebar, and full-width cards are well understood on mobile and align with "same experience, different viewport."
- **Efficiency:** Freelancers can upload and admins can review on the go without a different "mobile app" or reduced feature set.

## Core User Experience

### Defining Experience

The core experience is **the same workflows as desktop, optimized for small screens and touch.** Admins browse and manage projects, apartments, assets, and freelancers, and review room renders. Freelancers browse assigned projects and apartments, view assets and moodboards, and upload tiered renders per room. No features are removed on mobile; layout, navigation, and touch targets adapt.

### Platform Strategy

- **Web responsive:** One codebase; breakpoints (e.g. sm/md/lg) switch layout from sidebar + multi-column to single column and mobile nav (e.g. hamburger + drawer or bottom nav).
- **Touch-first on mobile:** Primary input is touch; tap targets ≥ 44px, spacing that avoids mis-taps; accordions and dropdowns remain the main interaction pattern.
- **No separate native app for this phase:** Delivered as responsive web; same URLs and auth as desktop.
- **No offline requirement** for this spec; assume connected use.

### Effortless Interactions

- **Navigation:** On mobile, getting to Projects / Freelancers (admin) or My Projects (freelancer) in one or two taps, without feeling lost. Sidebar becomes a drawer or is replaced by a clear top/bottom nav.
- **Finding context:** From project → apartment → room, the path is obvious (breadcrumbs and/or back + headings). Accordions stay closed by default so the screen isn't overwhelming.
- **Upload:** Choosing a file and uploading a render on a phone feels straightforward: clear "add"/upload area, visible progress, and confirmation without extra steps.
- **Review (admin):** Changing render status (To do / In review / Approved) is a single tap with clear feedback.

### Critical Success Moments

- **Freelancer:** "I opened the app on my phone, found my project and the right room, and uploaded the render" — success = same flow as desktop, just sized for mobile.
- **Admin:** "I checked the project on my phone and moved a render to Approved" — success = quick review and status change without hunting for controls.
- **First-time on mobile:** User immediately recognizes the same structure (projects, apartments, rooms, tiers) so no relearning.

### Experience Principles

- **Parity:** Every desktop feature and label exists on mobile; only layout and interaction patterns change.
- **Progressive disclosure:** Use accordions and collapsible sections so mobile screens stay focused and scannable.
- **Touch-friendly:** All interactive elements are tappable with adequate size and spacing; avoid hover-only or tiny controls.
- **Familiar patterns:** Use standard mobile patterns (drawer, bottom/top nav, full-width cards) so the experience feels "same product, right-sized."

## Desired Emotional Response

### Primary Emotional Goals

- **In control:** Users feel they can find what they need and complete tasks (upload, review) without friction.
- **Efficient:** Mobile use feels quick—same capabilities as desktop, right-sized for the device.
- **Confident:** Clear hierarchy and feedback (breadcrumbs, toasts, status) reduce doubt.

### Emotional Journey Mapping

- **First use on mobile:** Recognition (same structure as desktop); no relearning.
- **Core task:** Focused and capable—upload or review in a few taps.
- **After task:** Accomplished—clear success feedback (toast, status update).
- **If something fails:** Informed—error message and retry, not dead ends.
- **Return visit:** Familiar—navigation and layout consistent.

### Micro-Emotions

- **Confidence over confusion:** Breadcrumbs, clear headings, and accordion labels keep users oriented.
- **Trust:** Consistent behavior (same labels, same flows) builds trust.
- **Accomplishment over frustration:** Success feedback and minimal steps support completion.

### Design Implications

- **In control** → Single-column layout, one primary action per screen area; drawer nav doesn’t obscure context.
- **Efficient** → Tap targets ≥ 44px; accordions and dropdowns stay one-tap; upload zone always visible where relevant.
- **Confident** → Toasts for success/error; status badges and dropdowns show state; breadcrumbs or back affordance on every page.

### Emotional Design Principles

- Reduce cognitive load: one main task per view; progressive disclosure via accordions.
- Immediate feedback for every action (upload progress, status change, toast).
- Consistency: same terminology and flows on mobile and desktop.

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

- **Admin/dashboard tools (e.g. Linear, Notion):** Sidebar collapses to hamburger + overlay/drawer on mobile; primary content full-width; cards stack in one column. Adopt: drawer nav, full-width cards on small screens.
- **File/asset apps (e.g. Dropbox, Drive):** List/detail with clear hierarchy; upload zones prominent; progress and success feedback. Adopt: clear upload affordance, progress, and confirmation.
- **Task/review apps:** Status changes via dropdown or segmented control; minimal taps. Adopt: status dropdown with touch-friendly targets; optional bottom sheet for actions.

### Transferable UX Patterns

- **Navigation:** Hamburger + slide-out drawer (or bottom nav with 2–3 items) for admin/freelancer; keep same routes.
- **Lists and cards:** Single column on mobile; card tap → detail; back returns to list.
- **Accordions:** Full-width triggers, generous tap height; chevron indicates expand/collapse.
- **Upload:** Full-width or large tap zone; inline progress; toast on success.

### Anti-Patterns to Avoid

- Tiny tap targets (< 44px); hover-only interactions on mobile.
- Sidebar always visible on narrow viewports (wastes space, feels cramped).
- Different feature set or labels on mobile vs desktop (breaks parity).
- Multi-step flows that could be fewer steps (e.g. unnecessary modals).

### Design Inspiration Strategy

- **Adopt:** Drawer nav, single-column cards, accordions with large triggers, prominent upload + progress, status dropdown/sheet.
- **Adapt:** Existing 3dup accordion/card layout reflows to one column; spacing and tap targets increased.
- **Avoid:** Desktop-only sidebar on mobile; hidden or reduced features on small screens.

---

## Design System Foundation

### 1.1 Design System Choice

**Themeable system (Tailwind CSS + shadcn/ui–style component library).** The product already uses this stack; the UX spec assumes it continues and is extended for mobile.

### Rationale for Selection

- Existing codebase uses Tailwind and component library; no product or UX change required.
- Themeable tokens (colors, spacing, radius) support responsive and touch-friendly overrides.
- Accessible, semantic components (Radix-based) fit touch and keyboard use.
- One codebase serves desktop and mobile with breakpoint-driven layout.

### Implementation Approach

- Use Tailwind breakpoints (sm/md/lg) for layout and visibility (e.g. sidebar visible at lg, drawer at smaller).
- Reuse existing components (Accordion, Button, DropdownMenu, etc.); ensure min heights and padding meet 44px tap target where needed.
- Add mobile-specific wrappers only where necessary (e.g. Sheet/Drawer for nav).

### Customization Strategy

- Keep current light theme and typography; adjust spacing and component sizing for mobile (e.g. accordion trigger py-4, button min-h).
- No new design system; document mobile overrides in responsive/accessibility section.

---

## 2. Core User Experience (Defining Interaction)

### 2.1 Defining Experience

**"Same workflows, right-sized for the screen."** The defining experience on mobile is: **navigate to the right context (project → apartment → room), then perform the same primary action (upload or change status)** with minimal taps and clear feedback.

### 2.2 User Mental Model

- Users already know the hierarchy: projects contain apartments, apartments contain rooms and assets; tiers (Standard, Affordable luxury, Luxury premium) are fixed.
- They expect mobile to show the same structure and actions, with layout adapted to the device.

### 2.3 Success Criteria

- Navigation to any project/apartment/room in ≤ 3 taps from home.
- Upload: choose file → see progress → see success (toast + list update).
- Status change: one tap to open control, one tap to select new status, immediate feedback.
- No dead ends; every screen has a clear way back or forward.

### 2.4 Novel UX Patterns

- **Established patterns only.** Drawer nav, accordions, cards, dropdowns, and upload zones are familiar; no novel interaction to teach.

### 2.5 Experience Mechanics

- **Entry:** Login → role-based home (Your Projects / My Projects).
- **Drill-down:** Tap project card → project detail (accordions); tap apartment → apartment detail; tap room accordion → room content (upload slots, status).
- **Actions:** Upload via file picker or drop zone; status via dropdown or bottom sheet; breadcrumbs or back for navigation.

---

## Visual Design Foundation

### Color System

- Retain existing palette (primary, muted, border, card, etc.); ensure contrast meets WCAG AA for text and interactive elements on mobile.
- Semantic colors for status (e.g. amber/sky/emerald for To do / In review / Approved) unchanged; verify visibility on small screens.

### Typography System

- Keep current type scale and font; ensure body and UI text are readable at default mobile sizes (min 16px where appropriate).
- Heading hierarchy (page title, section, card) preserved; line-height and spacing support scanability on narrow width.

### Spacing & Layout Foundation

- Base spacing unit (e.g. 4px grid) unchanged; on mobile use same or slightly increased padding (e.g. p-4) so content doesn’t feel cramped.
- Single-column layout below md breakpoint; cards and accordions full-width with consistent gap (e.g. gap-4).

### Accessibility Considerations

- Touch targets ≥ 44px; focus visible for keyboard users.
- Color not sole indicator for status; retain text/labels (e.g. "To do", "In review", "Approved").
- Sufficient contrast for text and controls; test with system font size increases.

---

## Design Direction Decision

### Design Directions Explored

- **Direction A:** Current desktop layout with responsive reflow (sidebar → drawer, multi-column → single column). Chosen as baseline.
- **Direction B/C:** Alternative nav (e.g. bottom nav only) or density variants; documented as optional future exploration.

### Chosen Direction

**Responsive adaptation of current design.** No visual redesign; layout and component sizing adapt for viewport. Sidebar becomes drawer on small screens; content stacks in one column; accordions and cards keep same structure and labels.

### Design Rationale

- User requirement: "Keep everything the same, adjust to mobile view."
- Reduces implementation and testing scope; preserves familiarity.
- Aligns with parity and progressive disclosure principles.

### Implementation Approach

- Implement breakpoint-based layout (sidebar vs drawer, grid-cols-1 vs grid-cols-2/3/4).
- Add Sheet/Drawer component for mobile nav; ensure overlay and close behavior.
- Audit and adjust touch targets and spacing; no new visual language.

---

## User Journey Flows

### Admin: Review and approve room renders (mobile)

1. Log in → land on Your Projects.
2. Tap a project → project detail (accordions: Building Assets, Freelancers, Apartments).
3. Tap Apartments → open accordion; tap an apartment → apartment detail.
4. Tap Rooms accordion → open; tap a room → see room assets and status dropdowns.
5. Tap status on a render → choose "Approved" (or To do / In review) → toast; list updates.

### Freelancer: Upload a render (mobile)

1. Log in → land on My Projects.
2. Tap a project → project detail (Building Assets, Apartments accordions).
3. Tap Apartments → tap an apartment → apartment detail (Assets, Moodboards, Rooms).
4. Tap Rooms → open; tap a room → see tier slots (Standard, Affordable luxury, Luxury premium).
5. Tap upload zone for a tier → pick file → progress → toast and thumbnail appear.

### Journey Patterns

- Both roles: Home → list → detail (accordions) → action (upload or status).
- Back/breadcrumbs available at each level; no deep modal stacks.

### Flow Optimization Principles

- Minimize taps to reach target (project → apartment → room).
- One primary action per section (upload or status change); avoid nested dialogs on mobile.
- Clear feedback (toast, list/status update) after every mutation.

---

## Component Strategy

### Design System Components

- Use existing UI primitives: Accordion, Button, Card, DropdownMenu, Sheet, Input, Label, Badge, Separator, etc.
- Ensure AccordionTrigger and DropdownMenuTrigger have min-height/padding for 44px tap target on mobile.

### Custom Components

- **AppSidebar (mobile):** Wrap or replace with Sheet/Drawer on small screens; same links, overlay + close on tap outside or back.
- **PageHeader:** Breadcrumbs + title + actions; stack or truncate on narrow width; keep actions accessible (e.g. icon + label or icon-only with tooltip).
- **FileUploadZone / AssetThumbnail:** Already used; verify full-width or min width on mobile and touch-friendly hit area.
- **AssignedFreelancerList / RoomAccordions:** Layout reflows; no new components; ensure list items and accordion triggers are tappable.

### Component Implementation Strategy

- Prefer responsive Tailwind classes (hidden lg:block, block lg:hidden, flex-col md:flex-row) to switch layout.
- Introduce a single mobile nav component (e.g. Sheet with nav links) used below md; sidebar above md.
- Custom components stay as-is unless they contain fixed widths or hover-only behavior; then add responsive or touch-friendly variants.

### Implementation Roadmap

1. Add breakpoint to shell layout: sidebar visible lg+, drawer trigger + Sheet below lg.
2. Audit pages: ensure main content is single column below md; grids use grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4.
3. Audit interactive elements: min touch target 44px; add padding or min-height where needed.
4. Test flows: Admin review and Freelancer upload on a narrow viewport; fix any overflow or hidden actions.

---

## UX Consistency Patterns

### Button Hierarchy

- Primary: main action (e.g. Create project, Upload, Save).
- Secondary/outline: alternate action (e.g. Cancel, Replace).
- Ghost/destructive: remove or delete. On mobile, ensure sufficient size; group secondary actions in dropdown or sheet if needed.

### Feedback Patterns

- **Success:** Toast (e.g. "Asset uploaded", "Status updated"); auto-dismiss.
- **Error:** Toast with message; retry or dismiss. Inline validation for forms.
- **Loading:** Skeleton or progress in upload zone; disable submit during mutation.

### Form Patterns

- Vertical stack on mobile; full-width inputs; labels above; primary submit at bottom. Dialogs/sheets for create/edit; same fields as desktop.

### Navigation Patterns

- **Desktop (lg+):** Persistent sidebar; breadcrumbs in content.
- **Mobile (< lg):** Hamburger or menu icon opens Sheet with same nav links; breadcrumbs in content or back button; current page title visible.

### Additional Patterns

- **Empty states:** Same as desktop (icon + message + optional action).
- **Lists:** Single column on mobile; card or row tap → detail or expand.
- **Accordions:** Full-width; trigger shows title + optional metadata (e.g. count); content below; default closed.

---

## Responsive Design & Accessibility

### Responsive Strategy

- **Mobile-first or breakpoint-driven:** Layout and components adapt at sm (640px), md (768px), lg (1024px). Sidebar appears at lg; below lg use drawer.
- **Content:** Single column below md; multi-column (2–3–4) at md/lg where appropriate (e.g. project cards, asset grids).
- **Touch:** All interactive elements meet minimum 44px touch target on touch devices; spacing between tappable elements to avoid mis-taps.

### Breakpoint Strategy

- **&lt; 640px (sm):** Single column; padding p-4; drawer nav; stacked cards and accordions.
- **640px – 1023px (md):** Optional 2-column for cards; still drawer nav unless product decision to show sidebar earlier.
- **1024px+ (lg):** Sidebar visible; multi-column grids; current desktop layout.

### Accessibility Strategy

- **WCAG 2.1 AA** target: contrast, focus indicators, touch target size, no color-only information.
- **Keyboard:** All actions reachable and focusable; focus trap in modals/sheets.
- **Screen readers:** Semantic headings, labels on controls, live region for toasts; accordion and dropdown semantics (expanded, selected).

### Testing Strategy

- Manual test on real devices or Chrome DevTools device toolbar (e.g. iPhone, Android) for critical flows: login, project list, project detail, apartment → room, upload, status change.
- Verify no horizontal scroll; tap targets and spacing; drawer open/close and overlay.
- Optional: axe or Lighthouse for accessibility; fix critical issues.

### Implementation Guidelines

- Use Tailwind responsive prefixes consistently (sm:, md:, lg:).
- Prefer flex/grid with min-w-0 and overflow handling so content doesn’t overflow on small screens.
- Document any component overrides (e.g. AccordionTrigger className for min-height on mobile) in code or storybook.

---

## Workflow completion

This UX design specification is complete. It defines the mobile adaptation of 3dup (same experience, responsive layout and touch-friendly patterns). Use it to guide implementation: breakpoints, drawer nav, single-column layout, touch targets, and accessibility.
