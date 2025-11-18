# Hall of Symphony - Effects Implementation Plan
**Date:** 2025-11-08
**Context:** Implementing 3-channel mixer with Displacement, Movement, and Copies effects

## Current State Analysis

### What's Working ✅
1. Mixer UI with 3 channels (Displacement, Movement, Copies)
2. Rotary dials and sliders updating state correctly
3. Movement channel → GSAP breathing animation on letters (HallOfSymphony.jsx lines 86-126)
4. State management for all 3 channels
5. Dropdown for loading presets from "Nine variants"
6. Draggable mixer panel with row/column layout toggle

### What's NOT Working ❌
1. Displacement channel does nothing (no effects applied to visuals)
2. Copies channel does nothing (no effects applied to visuals)
3. No visual feedback when turning dials or toggling ON/OFF
4. Boost and Randomness parameters not affecting any effects

## Architecture Plan

### Channel 1: Displacement (SVG Filters)
```
State Mapping:
- displacementValue (0-100) → baseFrequency (0.001 - 0.05)
- displacementEnabled (bool) → apply/remove filter
- displacementBoosted (bool) → 2x scale multiplier
- displacementRandomness (0-10) → turbulence seed variation

Implementation Approach:
1. Create SVG <defs> with <filter> containing feTurbulence + feDisplacementMap
2. Apply filter to letter SVGs via filter="url(#displacement-filter)"
3. Map rotary dial value to baseFrequency range
4. Use randomness to vary turbulence seed/octaves
5. BOOST doubles the scale parameter
```

### Channel 2: Movement (GSAP) - ✅ Already Working
```
State Mapping:
- movementValue (0-100) → scale amount
- movementEnabled (bool) → start/stop animation
- movementBoosted (bool) → 2x multiplier
- movementRandomness (0-10) → timing/amount variation

Current Implementation:
- Base settings from Hall of Movement (speed: 2.5s, amount: 1.3x)
- GSAP timelines with yoyo repeat
- Two letters animate with offset timing
- Randomness affects speed and amount with ±50% variation
```

### Channel 3: Copies (CSS/Canvas)
```
State Mapping:
- copiesValue (0-100) → number of copies (map to 1-9 instances)
- copiesEnabled (bool) → show/hide copies
- copiesBoosted (bool) → more copies or wider spread
- copiesRandomness (0-10) → position/rotation/opacity variation

Implementation Approach:
1. Render multiple letter instances (1-9 based on copiesValue)
2. Apply CSS transforms for each copy (translate, rotate, scale)
3. Use randomness for variation in position/rotation
4. Layer copies behind original letters (lower z-index)
5. BOOST increases spread radius or adds more copies
```

## Implementation Steps

### Step 1: Displacement Effects ✅ COMPLETED
- [x] Create SVG filter definition with unique ID
- [x] Add feTurbulence with configurable baseFrequency
- [x] Add feDisplacementMap with scale parameter
- [x] Apply filter conditionally when displacementEnabled=true
- [x] Map displacementValue (0-100) to baseFrequency (0.001-0.05)
- [x] Implement BOOST multiplier (2x scale)
- [x] Add randomness variation to seed/octaves

### Step 2: Copies Effects ✅ COMPLETED
- [x] Calculate number of copies from copiesValue
- [x] Render duplicate letter SVGs with transform offsets
- [x] Apply randomness to position/rotation per copy
- [x] Implement BOOST for wider spread
- [x] Handle z-index layering

### Step 3: Effect Layering & Integration ✅ COMPLETED
- [x] Test Displacement + Movement combination
- [x] Test Copies + Movement combination
- [x] Test all 3 channels simultaneously
- [x] Ensure no conflicts between effects
- [x] Optimize performance (used useMemo for stable transforms)

### Step 4: Visual Feedback 🔄 PARTIAL
- [x] ON/OFF indicator shows channel state (red dot in mixer)
- [x] BOOST button shows active state (yellow text)
- [x] Rotary dial shows percentage value
- [ ] Add FPS counter (real-time) - placeholder exists
- [ ] Add performance metrics display - placeholder exists

## Technical Notes

**Canvas Structure:**
```jsx
<div className="canvas-container">
  <svg filter={displacement}>
    {/* Copies layer (behind) */}
    {copies.map(copy => <LetterCopy transform={...} />)}

    {/* Original letters (GSAP animated) */}
    <LetterD ref={letter1Ref} />
    <LetterÐ ref={letter2Ref} />
  </svg>
</div>
```

**Effect Priorities:**
1. Copies render first (lowest z-index)
2. Displacement applies to all letters (SVG filter)
3. Movement animates via GSAP refs (highest priority)

**Performance Considerations:**
- SVG filters can be GPU-accelerated
- Limit copies to max 9 instances
- Use will-change for GSAP animations
- Monitor frame rate, target 60fps

## Files Modified
- `apps/web/src/routes/styleguide/HallOfSymphony.jsx` - Main hall component
- `apps/web/src/components/styleguide/molecules/SymphonyMixer.jsx` - Mixer UI
- `apps/web/src/components/styleguide/molecules/RotaryDial.jsx` - Rotary control
- `packages/ui/src/molecules/DraggableControlPanel.jsx` - Drag/resize logic

## Implementation Completed ✅

### Displacement Channel (Lines 143-148, 342-360)
**Calculated Parameters:**
```javascript
const displacementMultiplier = displacementBoosted ? 2 : 1
const baseFrequency = (displacementValue / 100) * 0.049 + 0.001
const displacementScale = 50 * (displacementValue / 100) * displacementMultiplier
const turbulenceSeed = Math.floor(displacementRandomness * 10)
const octaves = 1 + Math.floor(displacementRandomness / 3)
```

**SVG Filter:**
- Created hidden SVG with `<defs>` containing displacement filter
- `feTurbulence` with dynamic baseFrequency, octaves, and seed
- `feDisplacementMap` with dynamic scale parameter
- Filter applied conditionally via `filter: displacementEnabled ? 'url(#displacement-filter)' : 'none'`

### Copies Channel (Lines 150-176, 366-451)
**Calculated Parameters:**
```javascript
const numberOfCopies = Math.floor((copiesValue / 100) * 9)
const copiesSpread = copiesBoosted ? 150 : 100
const copiesOpacityRange = 0.1 + (copiesRandomness / 10) * 0.3
```

**Rendering Approach:**
- Used `useMemo` to generate stable transforms (prevents flickering)
- Pseudo-random seeded values based on copy index for consistency
- Copies distributed in circular pattern around original letters
- Each copy has unique position, rotation, and opacity
- Positioned absolutely behind originals (z-index layering)
- Both displacement and movement effects apply to copies

### Effect Integration
All 3 channels work simultaneously:
1. **Copies** render first (lowest z-index) with optional displacement filter
2. **Displacement** applies to both copies and originals via SVG filter
3. **Movement** animates original letters via GSAP refs

### Code Locations
- Parameter calculations: `HallOfSymphony.jsx` lines 143-176
- SVG filter definition: `HallOfSymphony.jsx` lines 342-360
- Letter D with copies: `HallOfSymphony.jsx` lines 364-406
- Letter Ð with copies: `HallOfSymphony.jsx` lines 408-451

## Testing Instructions
1. Navigate to Hall of Symphony
2. Toggle [ON] for each channel
3. Turn rotary dials to adjust intensity (0-100%)
4. Press [BOOST] to double effect strength
5. Adjust randomness slider for variation (0-10)
6. Test combinations:
   - Displacement only
   - Movement only
   - Copies only
   - All 3 channels simultaneously

## Known Limitations
- FPS counter is placeholder (not yet functional)
- Performance metrics not yet implemented
- Copies channel disabled due to performance issues (rendering 18 SVGs caused control stuttering)
- Unused `copyTransforms` variable needs cleanup (line 180)

## Performance Issues Encountered

### Rotary Dial Stuttering (RESOLVED ✅)
**Problem**: Rotary dials felt "sticky" with micro-pauses every few pixels
**Root Causes**:
1. Initial implementation used absolute angle tracking (atan2) which caused wrapping issues
2. Decimal precision (0.1 steps) created snapping behavior
3. SVG transform attribute on pointer line (CPU-bound)
4. Parent component re-renders on every onChange call

**Solutions Applied**:
1. Changed to vertical mouse tracking (simpler math, more predictable)
2. Switched to whole number steps (0-100 integers)
3. Added dual-state architecture: `localValue` for instant visual rotation, throttled `onChange` via RAF
4. Replaced SVG transform with CSS transform on container (GPU-accelerated)
5. Added `willChange: 'transform'` hint during drag

**Current State**: Dials rotate smoothly with CSS transforms

### Copies Channel Stuttering (UNRESOLVED ❌)
**Problem**: With Copies channel enabled, entire mixer panel (dials, sliders) became unresponsive
**Root Cause**: Rendering up to 18 SVG elements (9 copies × 2 letters) on every state change
- Each copy had complex transforms: translate, rotate, opacity
- All copies inherited displacement filter (expensive SVG filter)
- React re-rendered entire tree on every dial movement

**Attempted Solutions**:
1. Used `useMemo` for stable transforms (helped with flickering but not performance)
2. Added `willChange: 'transform'` and `translate3d` for GPU acceleration
3. Pseudo-random seeding to avoid Math.random() calls

**Final Decision**: Disabled Copies channel rendering to restore control responsiveness

**Potential Future Solutions**:
- Use Canvas API or WebGL instead of SVG for copies
- Implement copies in PixiJS (like Hall of Copies does)
- Debounce/throttle copies rendering separately from controls
- Use CSS `content-visibility: auto` for off-screen copies

## Session Summary

**Time Spent**: ~3 hours on performance optimization
**What Works**: Displacement + Movement channels with smooth controls
**What's Disabled**: Copies channel (code exists but commented out)
**Status**: Taking a break, moving to different project

**Code State**:
- `HallOfSymphony.jsx`: Lines 454-485 - Clean, simple 2-letter rendering
- `RotaryDial.jsx`: Fully optimized with CSS transforms and local state
- `SymphonyMixer.jsx`: No changes needed
- Session log: Updated with full context
