# Session Log: Pixi Filter Experiment – Workshop Constraints

**Date:** 2025-11-16  
**Status:** Observation / Next-steps Record

---

## Summary
- Attempted to integrate a PixiJS image-filter lab into the existing workshop apparatus layout.
- Implemented shared padding, control-panel layout, upload card with thumbnail + status, and slider stacks matching the Components/Controls patterns.
- The Pixi canvas still fails to repaint when a new blob URL is loaded—likely due to workshop routing constraints, lazy loading, or retaining references when the layout re-initializes.
- User feedback: “nothing happens” after uploading; the filter is non-functional in the current environment.

## Next Steps
1. **Prototype Outside Workshop:** Stand up a clean Pixi demo (either a dedicated app or minimal page) to validate functionality before re-integrating.
2. **Isolate Pixi Lifecycle:** In the proto, ensure the object URL loads into Pixi without any layout interference; once working, port the logic back.
3. **Re-evaluate Workshop Needs:** Decide whether the final feature should live inside the workshop or as a standalone lab to avoid the “million limitations.”

Until we have a functioning Pixi upload preview elsewhere, further styling changes in the workshop won’t solve the core issue.
