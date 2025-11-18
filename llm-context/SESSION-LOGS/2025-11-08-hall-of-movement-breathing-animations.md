# Hall of Movement - Breathing Animations Session

**Date:** 2025-11-08
**Session Focus:** Building GSAP breathing animations with continuous easing control
**Status:** Complete

---

## Overview

Built out Hall of Movement with 3 breathing animation variants, implementing the same SELECT/control panel pattern from Hall of Displacement. Created continuous easing strength slider that smoothly interpolates between sine and exponential curves. Also created color and typography cheat sheets for quick reference.

---

## What We Built

### 1. Documentation Cheat Sheets

Created concise quick-reference docs following the tor-notes pattern:

**Files Created:**
- `docs/documentation/2.1.1-color-cheat-sheet.md` - Color system quick reference
- `docs/documentation/2.2.1-typography-cheat-sheet.md` - Typography quick reference

**Why:** The existing 2.1.0 and 2.2.0 docs were too verbose (1360+ lines). The tor-notes pattern is much cleaner with tables and minimal explanations.

---

### 2. Hall of Symphony Visual Update

**Updated:** `apps/web/src/routes/styleguide/HallOfSymphony.jsx`

- Replaced placeholder image with vector shapes from `packages/ui/assets/font-vector/`
- Added D and Ð characters at 400px tall
- Used `.bg-surface-absolute-split` for theme-aware pure black/white background
- Centered shapes with `flex-row items-center justify-center gap-8`
- Shapes use `text-auto` for automatic contrast

---

### 3. Hall of Movement - GSAP Breathing Animations

**Created:** `apps/web/src/components/styleguide/molecules/MovementControlsPanel.jsx`
**Updated:** `apps/web/src/routes/styleguide/HallOfMovement.jsx`

#### Three Breathing Variants

**1. Breathing Scale**
- Uniform scale: 1.0 → amount
- Zooms in/out from center
- Type: `scale`

**2. Breathing Stretch**
- Non-uniform: scaleX = amount, scaleY = 1.1
- Stretches both axes differently
- Type: `stretch`

**3. Breathing Harmonica**
- Horizontal only: scaleX = amount
- Like accordion/harmonica squeeze
- Type: `harmonica`

#### Control Panel System

Following Hall of Displacement pattern:

**Pattern Match:**
- [ON/OFF] toggle for each variant
- [SELECT/UNSELECT] to open control panel
- Fixed bottom-right panel (280px width)
- [DRAG/LOCKED] toggle for panel movement
- Shared controls affect selected variant

**Controls:**
1. **Duration** - 0.5s to 5s (how long one breath cycle takes)
2. **Amount** - 1.0x to 2.0x (scale intensity)
3. **Cycle Strength** - 0.5 to 4.0 (easing curve interpolation)

**Key Innovation - Continuous Easing:**
```javascript
// Convert strength to GSAP easing
// 0.5 = sine.inOut (gentle)
// 4.0 = power4.inOut / expo-like (sharp)
let easing
if (easingStrength < 0.8) {
  easing = 'sine.inOut'
} else if (easingStrength < 4) {
  // Use continuous power easing
  easing = `power${easingStrength.toFixed(1)}.inOut`
} else {
  easing = 'expo.inOut'
}
```

**Why This Works:**
GSAP supports decimal power values like `power2.3.inOut`, allowing smooth interpolation between curves instead of discrete steps. Slide from 0.5 → 4.0 and watch the breathing rhythm morph organically from gentle sine waves to sharp exponential pulses.

---

## Component Architecture

### MovementControlsPanel

```jsx
<MovementControlsPanel
  enabled={variantEnabled[selectedVariant]}
  onEnabledChange={(value) => setVariantEnabled(...)}
  speed={speed}
  onSpeedChange={setSpeed}
  amount={amount}
  onAmountChange={setAmount}
  easingStrength={easingStrength}
  onEasingStrengthChange={setEasingStrength}
  isLocked={isPanelLocked}
  onLockChange={setIsPanelLocked}
/>
```

**Props:**
- Uses `Slider` component from `@kol/ui`
- Minimal variant for consistent styling
- Three sliders: Duration, Amount, Cycle Strength
- Bottom readout: `2.5s | 1.30x | 2.0`

### MovementVariant Component

```jsx
const MovementVariant = ({
  variantId,
  title,
  isEnabled,
  isSelected,
  onToggleEnabled,
  onToggleSelect,
  speed,
  amount,
  easingStrength,
  type // 'scale', 'stretch', 'harmonica'
}) => {
  // GSAP timeline animation
  // Updates when speed, amount, or easingStrength changes
}
```

**Type System:**
- `scale` - uniform scale on both axes
- `stretch` - different X and Y scaling
- `harmonica` - X axis only

---

## Design Decisions

### 1. Why Continuous Easing vs Discrete Options?

**User Request:** "why can't I just slide through the wave forms?"

**Solution:** Map slider value 0.5-4.0 to GSAP power functions
- Eliminates dropdown/discrete steps
- Smooth morphing between curves
- More intuitive - slide and feel the rhythm change

**Before:** Dropdown with 5 options
**After:** Continuous slider with infinite positions

### 2. Simplified Labels

**User Request:** "I don't need all those in the slider information"

**Removed:** Labels like "Cycle Strength: Organic Breath"
**Kept:** Simple "Duration", "Amount", "Cycle Strength"

**Rationale:** Descriptive info can go in hover tooltips. Controls should be minimal and self-explanatory.

### 3. Duration Not Speed

**User Confusion:** "why is speed fastest at 0?"

**Clarification:** Slider controls duration in seconds, not speed
- Low value = fast (completes quickly)
- High value = slow (takes longer)
- Changed label from "Speed" to "Duration (seconds)" then to just "Duration"

---

## File Structure

### Created Files
```
apps/web/src/components/styleguide/molecules/
└── MovementControlsPanel.jsx

docs/documentation/
├── 2.1.1-color-cheat-sheet.md
└── 2.2.1-typography-cheat-sheet.md
```

### Modified Files
```
apps/web/src/routes/styleguide/
├── HallOfSymphony.jsx       # Added vector shapes
└── HallOfMovement.jsx        # Built 3 variants with controls
```

---

## Technical Implementation

### GSAP Timeline Pattern

```javascript
useEffect(() => {
  if (!isEnabled || !imgRef.current) {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    return
  }

  const tl = gsap.timeline({ repeat: -1, yoyo: true })

  tl.to(imgRef.current, {
    scaleX: amount,
    duration: speed,
    ease: easing,
    transformOrigin: 'center center'
  })

  timelineRef.current = tl

  return () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }
  }
}, [isEnabled, speed, amount, easingStrength, type])
```

**Key Points:**
- Kill timeline on cleanup/disable
- Re-create on parameter change
- `yoyo: true` for breathing back-and-forth
- `transformOrigin: 'center center'` for centered breathing

---

## User Interaction Flow

1. User navigates to Hall of Movement
2. Clicks [SELECT] on a variant (e.g., Breathing Harmonica)
3. Control panel appears bottom-right
4. Clicks [ON] to start animation
5. Adjusts Duration slider → breathing speeds up/slows down
6. Adjusts Amount slider → breathing becomes more/less pronounced
7. Adjusts Cycle Strength slider → breathing rhythm morphs from sine to exponential
8. Clicks [LOCKED] to prevent accidental panel dragging
9. Clicks [SELECT] on different variant → panel controls that one instead

---

## Performance Considerations

### Load Optimization
- All animations default to OFF state
- Only selected variant shows control panel
- GSAP timelines killed when disabled
- No memory leaks from orphaned animations

### Resource Management
- GSAP already in project dependencies
- Timeline reuse pattern (kill then recreate)
- Single shared control panel (not per-variant)
- Minimal re-renders (controlled state updates)

---

## Next Steps

### Immediate
- [ ] Add 6 more movement variants (9 total slots)
- [ ] Implement draggable panel (like Displacement)
- [ ] Add momentum physics to panel drag
- [ ] Implement panel position persistence

### Future Movement Variants
- [ ] Breathing Rotate (rotation only, no scale)
- [ ] Breathing Wave (sin/cos offset animation)
- [ ] Breathing Pulse (scale + opacity)
- [ ] Breathing Elastic (spring physics)
- [ ] Variable Font Weight Morph
- [ ] 3D Transform Breathing

### Integration
- [ ] Connect to Hall of Symphony mixer
- [ ] Export animation presets
- [ ] Save/load combinations to Archive

---

## Related Documentation

- `docs/llm-context/SESSION-LOGS/2025-11-08-hall-of-mirrors-restructure.md` - Hall restructure session
- `docs/documentation/3.6.0-effects-glass-distortion.md` - Main effects documentation
- `apps/web/src/components/styleguide/molecules/DistortionControlsPanel.jsx` - Control panel pattern reference

---

## Lessons Learned

1. **Don't reinvent the wheel:** User correctly pointed out we already had the control panel pattern in Displacement
2. **Continuous > Discrete:** Sliding through easing curves is more intuitive than dropdown selection
3. **Minimal labels:** Keep controls clean, put explanations in tooltips or docs
4. **Duration vs Speed:** Be explicit about units (seconds) to avoid confusion
5. **GSAP power:** Decimal power values enable smooth easing interpolation

---

## Code Patterns Established

### Control Panel Props Pattern
```javascript
{
  enabled: boolean,
  onEnabledChange: (value) => void,
  [paramName]: number,
  on[ParamName]Change: (value) => void,
  isLocked: boolean,
  onLockChange: (value) => void
}
```

### Variant Component Pattern
```javascript
{
  variantId: string,
  title: string,
  isEnabled: boolean,
  isSelected: boolean,
  onToggleEnabled: () => void,
  onToggleSelect: () => void,
  ...controlParams
}
```

---

**Session Duration:** ~2 hours
**Lines of Code:** ~350 new, ~100 modified
**Files Created:** 3
**Files Modified:** 2
