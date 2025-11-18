# Typography Scale Quality Audit & Refinement Plan

**Date:** 2025-10-16
**Time:** 23:00
**Branch:** `feature/typography-refactor`

## Research Summary

### Material Design 3 Findings
Material uses a **5-tier semantic naming system**:
- **Display** (XL, L, M, S): 88px → 36px, 100% line-height, 475 weight
- **Headline** (L, M, S): 32px → 24px, tight line-height
- **Title** (L, M, S): 22px → 14px, mixed weights (400-500)
- **Body** (L, M, S): 16px → 12px, 400 weight
- **Label** (L, M, S): 14px → 11px, 500 weight with tight tracking

**Key Insight**: Clear separation between display typography (marketing) and content typography (UI/reading).

### shadcn/ui Findings
Uses **Tailwind-based semantic classes**:
- **Headings**: h1 (text-4xl extrabold), h2 (text-3xl semibold), h3 (text-2xl), h4 (text-xl)
- **Body**: Paragraph (leading-7), Lead (text-xl muted), Small (text-sm), Muted (text-sm muted)
- **Code**: Inline mono with background pill treatment
- **Emphasis**: Large (text-lg semibold)

**Key Insight**: Simplified hierarchy focusing on practical UI needs, not exhaustive scales.

### Ant Design Findings
Limited extraction, but references CSS variables pattern with component-specific typography rather than global scale.

**Key Insight**: Typography tied to components, not standalone utility classes.

---

## Current Kolkrabbi Type Scale Analysis

### ✅ Strong Areas
1. **Display Typography**: Display + Section classes work well for marketing/hero content
2. **Mono System**: Comprehensive mono coverage (text, text-label, xs, xxs) with Fine variants
3. **Label System**: Good separation between mono labels and compact labels
4. **Responsive**: All classes have mobile → desktop scaling

### ⚠️ Issues to Address

#### 1. Font Family Inconsistencies
**Problem**: RightGrotesk vs RightGroteskNarrow vs RightGroteskTight used inconsistently
- Line 326: `fontFamily: 'RightGroteskNarrow'` (legacy name)
- Line 342: `fontFamily: 'RightGroteskNarrow'` (legacy name)
- Line 358: `fontFamily: 'RightGroteskNarrow'` (legacy name)
- Line 374: `fontFamily: 'RightGroteskNarrow'` (legacy name)
- Line 390: `fontFamily: 'RightGroteskNarrow'` (legacy name)
- Line 406: `fontFamily: 'RightGroteskTight'` (legacy name)
- Line 414: `fontFamily: 'RightGrotesk'` (correct)
- Line 422: `fontFamily: 'RightGroteskTight'` (legacy name)

**Solution**: All should be `'RightGrotesk'` (font-stretch handles width variations)

#### 2. Missing Body Variants
**Gap**: No "Large" body text (18-20px range for intros/leads)
**Comparison**:
- Material has Body L (16px)
- shadcn has Lead (text-xl) and Large (text-lg semibold)

**Solution**: Add `kol-text-lg` for feature paragraphs

#### 3. Mono Weight Inconsistencies
**Problem**: Mono text uses weight 400, but we have Medium (500) and Fine (300) variants
- Lines 503, 512, 521: `fontWeight: '400'` (doesn't match our @font-face declarations)

**Solution**: Update to weight 500 (Medium) or add explicit Fine variant classes

#### 4. Label Size Gaps
**Gap**: No XXS label for ultra-compact UI (chips, inline badges)
**Current**: Label starts at 14px mobile
**Material**: Has Label S at 11px

**Solution**: Add `kol-label-xs` (11-14px) for dense UI

#### 5. Missing "Muted" or "Secondary" Body Text
**Gap**: No semantic class for de-emphasized text
**shadcn**: Has explicit "Muted" variant with opacity/color treatment
**Material**: Uses label sizes for secondary info

**Solution**: Either add `kol-text-muted` class or document opacity patterns

---

## Proposed Type Scale Structure

### Section 1: Display Typography (Marketing/Hero)
```
1. Display        48px → 96px    RightGrotesk Tight 500  100% uppercase
2. Section        40px → 64px    RightGrotesk Tight 500  100% uppercase
3. Section Small  32px → 48px    RightGrotesk Tight 500  100% uppercase  [NEW]
4. Subsection     48px fixed     RightGrotesk Tight 500  100% uppercase  [EXISTING]
```

### Section 2: Content Headings (Reading Hierarchy)
```
1. Heading XL     40px → 64px    RightGrotesk Narrow 500  110%
2. Heading LG     32px → 48px    RightGrotesk Narrow 500  110%
3. Heading MD     28px → 40px    RightGrotesk Narrow 500  120%
4. Heading SM     20px → 32px    RightGrotesk Tight 500   100% uppercase
```

### Section 3: Body Text (Reading Content)
```
1. Text LG        18px → 20px    Inter Tight 400  160%   [NEW - for leads/intros]
2. Text           14px → 18px    Inter Tight 400  160%   [EXISTING]
3. Text SM        12px → 16px    Inter Tight 400  150%   [EXISTING]
```

### Section 4: Monospace Text (Technical/Code)
```
1. Mono Text         14px → 18px    RightGroteskMono Medium 500  125%   [UPDATE WEIGHT]
2. Mono Text Fine    14px → 18px    RightGroteskMono Fine 300    125%   [NEW]
3. Mono Text SM      12px → 16px    RightGroteskMono Medium 500  125%   [NEW]
4. Mono Text SM Fine 12px → 16px    RightGroteskMono Fine 300    125%   [NEW]
5. Mono XS           11px → 14px    RightGroteskMono Medium 500  normal [EXISTING]
6. Mono XXS          8px → 12px     RightGroteskMono Medium 500  normal [EXISTING]
```

### Section 5: Labels & UI Text (Controls/Tags)
```
1. Mono Text Label   12px → 16px    RightGroteskMono 500  125% uppercase 0.2em   [EXISTING]
2. Label (UI)        14px → 24px    RightGroteskMono 500  100% uppercase 0.05em  [EXISTING]
3. Label Compact     16px → 24px    RightGrotesk Narrow   100% uppercase 0.05em  [EXISTING]
4. Label XS          11px → 14px    RightGroteskMono 500  100% uppercase 0.05em  [NEW]
```

---

## Implementation Tasks

### Phase 1: Fix Font Family References ✅
- [ ] Replace all `'RightGroteskNarrow'` → `'RightGrotesk'` in tokens.js
- [ ] Replace all `'RightGroteskTight'` → `'RightGrotesk'` in tokens.js
- [ ] Update TypeSample.jsx resolver if needed

### Phase 2: Fix Mono Font Weights ✅
- [ ] Update mono-text fontWeight from 400 → 500
- [ ] Update mono-xs fontWeight from 400 → 500
- [ ] Update mono-xxs fontWeight from 400 → 500

### Phase 3: Add Missing Variants ✅
- [ ] Add `kol-text-lg` (18-20px for leads)
- [ ] Add `kol-mono-text-fine` (weight 300)
- [ ] Add `kol-mono-text-sm` (12-16px Medium)
- [ ] Add `kol-mono-text-sm-fine` (12-16px Fine)
- [ ] Add `kol-label-xs` (11-14px)

### Phase 4: Update CSS Classes ✅
- [ ] Add new classes to `packages/ui/theme.css` or utilities
- [ ] Ensure all classes have `.text-auto` compatibility
- [ ] Add to components.css if needed

### Phase 5: Update Documentation ✅
- [ ] Update `docs/system/3.0-typography.md` with new variants
- [ ] Add usage examples for new classes
- [ ] Document when to use Fine vs Medium mono

### Phase 6: Create Styleguide Page ✅
- [ ] Build Typography.jsx with your DesPage/DesSection structure
- [ ] Add all variants organized by category
- [ ] Include responsive previews with TypeSample component

---

## Typography Page Structure (Requested Layout)

```jsx
<DesPage>

  {/* Section 1: Display Headings */}
  <DesSection title="Display Headings" description="Marketing and hero typography">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DesCard><TypeSample id="display" /></DesCard>
      <DesCard><TypeSample id="section" /></DesCard>
      <DesCard><TypeSample id="section-small" /></DesCard>
      <DesCard><TypeSample id="subsection" /></DesCard>
    </div>
  </DesSection>

  {/* Section 2: Content Headings */}
  <DesSection title="Headings" description="Reading hierarchy for content">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DesCard><TypeSample id="heading-xl" /></DesCard>
      <DesCard><TypeSample id="heading-lg" /></DesCard>
      <DesCard><TypeSample id="heading-md" /></DesCard>
      <DesCard><TypeSample id="heading-sm" /></DesCard>
    </div>
  </DesSection>

  {/* Section 3: Body Text */}
  <DesSection title="Body" description="Reading content and paragraphs">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DesCard><TypeSample id="text-lg" /></DesCard>
      <DesCard><TypeSample id="text" /></DesCard>
      <DesCard><TypeSample id="text-sm" /></DesCard>
      <DesCard><TypeSample id="mono-text" /></DesCard>
      <DesCard><TypeSample id="mono-text-fine" /></DesCard>
      <DesCard><TypeSample id="mono-text-sm" /></DesCard>
      <DesCard><TypeSample id="mono-text-sm-fine" /></DesCard>
      <DesCard><TypeSample id="mono-xs" /></DesCard>
      <DesCard><TypeSample id="mono-xxs" /></DesCard>
    </div>
  </DesSection>

  {/* Section 4: Labels */}
  <DesSection title="Labels" description="UI controls, tags, and status text">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DesCard><TypeSample id="mono-text-label" /></DesCard>
      <DesCard><TypeSample id="label" /></DesCard>
      <DesCard><TypeSample id="label-compact" /></DesCard>
      <DesCard><TypeSample id="label-xs" /></DesCard>
    </div>
  </DesSection>

</DesPage>
```

---

## Design Principles (Informed by Research)

1. **Semantic Over Presentational**: Class names describe purpose (display, label, text) not just size
2. **Clear Hierarchy**: Distinct separation between marketing, content, and UI typography
3. **Font Matching**: Right Grotesk for display/headings, Inter Tight for reading, Mono for technical
4. **Responsive by Default**: All classes scale across breakpoints
5. **Weight Consistency**: Use defined font weights (300 Fine, 500 Medium) not arbitrary values
6. **Adaptive Color**: All classes use `--kol-surface-on-primary` for theme compatibility

---

## Comparison to Industry Standards

| System | Display Sizes | Body Variants | Mono Support | Label Sizes |
|--------|---------------|---------------|--------------|-------------|
| **Material 3** | 4 (88→36px) | 3 (16→12px) | 2 (16, 14px) | 3 (14→11px) |
| **shadcn/ui** | 4 (h1→h4) | 4 (lead, p, small, muted) | 1 (inline code) | 0 explicit |
| **Kolkrabbi (Current)** | 4 (96→20px) | 2 (18→12px) | 3 (18→8px) | 3 (24→11px) |
| **Kolkrabbi (Proposed)** | 4 (96→20px) | 3 (20→12px) | 6 (18→8px w/ weights) | 4 (24→11px) |

**Assessment**: Proposed scale matches or exceeds industry standards, with superior mono typography system.

---

## Next Steps

1. **Approve Plan**: Review and adjust scale structure
2. **Execute Phase 1-2**: Fix existing inconsistencies (low-risk cleanup)
3. **Execute Phase 3-4**: Add new variants to tokens.js and CSS
4. **Execute Phase 5**: Update documentation
5. **Execute Phase 6**: Build styleguide typography page

**Estimated Time**: 2-3 hours total

**Risk**: Low - additive changes, existing classes remain backward compatible
