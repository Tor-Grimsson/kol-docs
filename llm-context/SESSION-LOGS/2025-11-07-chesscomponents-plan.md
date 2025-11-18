# Session Log: Chess Components – Detailed Refactor Plan

**Date:** 2025-11-07
**Agent:** Codex (GPT-5)

## Objective
Provide a ready-to-implement blueprint for wiring `apps/web/src/routes/styleguide/ChessComponents.jsx` to the live chess database (`@kol/chess-data`) and filling any visualization gaps, so the next agent can execute without re-discovery.

---

## Data Sources
- `manifest = getManifest()`
  - `totalGames`, `monthsTracked`, `timeClassDistribution`, `timeControlDistribution`, `topOpponents`, `topEcos`, `terminationDistribution`, etc.
- `monthlySummary = getMonthlySummary()`
  - Per-month totals, `results` (win/loss/draw), average ratings, `timeClass` counts, `topEco`.
- `games = getGameMeta()`
  - Individual game metadata (rating, month, timeControl, termination, opponent rating, etc.).

---

## Component Mapping
1. **KPI Card (Total games)**
   - Value: `manifest.totalGames`.
   - Delta: current `monthlySummary[-1].total` vs `monthlySummary[-2].total`.
   - Copy: show pluralized text, e.g., `formatCompactNumber` and `+/-` label.

2. **Stacked Bar Mini Card (Win rate)**
   - Value: current month win rate `wins / total`.
   - Bars: for each of the last 12 months, stack win/draw/loss percentages.

3. **Time Series Chart Card**
   - Two lines: wins vs losses (last 12 months).
   - Tooltip: month label + win/loss counts.
   - Remove placeholder time-range buttons (or hook them up to real data if desired).

4. **Large Chart Card (Stacked area)**
   - Use `monthlySummary` timeClass breakdown (`blitz/bullet/rapid`).
   - Legend text + tooltip should reference real class names.

5. **Donut Chart Card**
   - Replace OS legend with time-class legend drawn from `manifest.timeClassDistribution`.
   - Counter should show active classes + percent of total games.

6. **Circular Gradient Chart Card**
   - Use `manifest.topEcos` (and convert ECO URLs to human labels) for the rings.
   - Optionally annotate center text with total opening games.

7. **Rivals List Card**
   - Populate from `manifest.topOpponents` (username + count).
   - Badge can highlight #1 rival; footer line mentions what the counts represent.

8. **Meter Card**
   - Use top termination categories from `manifest.terminationDistribution`.
   - Each meter = category label + share of total terminations.

9. **Featured Analysis Card**
   - Use `featuredSeries` derived from weekly win margin + usage trend.
   - Badge can reference the top ECO or chosen opening (e.g., King’s Gambit from `topEcos[0]`).

10. **Simple Metric Card**
    - Candidate values: `manifest.uniqueOpponents`, `manifest.monthsTracked`, or `manifest.ratedGames` to keep it meaningful.

11. **Alert Status Card**
    - Fill with month-over-month win-rate delta (`winRateDelta`) and callouts referencing the actual month.
    - Use trending icon for positive/negative states.

12. **Line Chart Card with List**
    - Trend line = `ratingTrend` normalized values.
    - List rows = the last 5 months with total games per month.

13. **Candlestick Card**
    - Data: rating highs/lows per month derived from `games` (already prototyped). Variant color indicates more wins than losses for that month.

14. **Scatter Plot Card**
    - Points: `games` filtered for opponent rating + time control; x-axis = base time (seconds), y-axis = opponent rating.
    - Remove thick baseline, unify grid strokes, add axis labels (numbers from `scatterMaxX`, `scatterMaxY`).

15. **Additional Visualizations (to build)**
    - **Result Pie Chart**: lifetime wins/losses/draws from `manifest` or aggregated `monthlySummary`.
    - **Rating Histogram**: bucket `games.player.rating` into ranges to show distribution.
    - **Hourly Heatmap**: bucket `game.endTime` by hour-of-day x weekday to illustrate play patterns.

---

## Icon Requests
1. `icon-time-control` – stopwatch for time-control cards.
2. `icon-eco-book` – opening reference for ECO visuals.
3. `icon-termination` – flag/trophy for termination meters.
4. `icon-rating-trend` – zig-zag arrow for rating charts.
5. `icon-opponent` – dual avatar for rivals.

---

## Implementation Steps for Next Agent
1. **Data Layer**: Replace the placeholder arrays (`chartData`, `lineChartSeries`, etc.) with memoized selectors referencing `manifest`, `monthlySummary`, and `games` as described above.
2. **UI Wiring**: Update each `DesCard` block to use the new datasets, adjust titles/copy/legends, and ensure tooltips/labels show real values.
3. **New Charts**: Add the missing pie, histogram, and heatmap components (consistent with design-system styling) and place them near related cards or in a new section.
4. **Icons**: Once the new icon assets exist, wire them into the badge/legend spots (trending, time-control, etc.).
5. **Testing**: After wiring, run `yarn dev` and `yarn lint` (if available) to ensure no duplicate identifiers/undefined vars remain.

---

## Notes
- The previous build error was due to duplicate `donutActiveTotal` declarations after partial refactors; start from a clean state to avoid that issue.
- Be mindful of memoization to prevent recalculating large arrays on every render.
- Use `formatCompactNumber`, `formatPercent`, and `formatMonthLabel` helpers for consistent UI text.

