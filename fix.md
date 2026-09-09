# UI Fix Plan (fix.md)

Based on the target design (`image.png`) versus the current implementation (`image_1.png`), the application needs a significant styling and structural overhaul to achieve the intended premium, light-themed aesthetic.

Here is the step-by-step plan to fix the UI:

## 1. Global Theme & Colors (`app/globals.css`)
Currently, the app defaults to a harsh dark mode or uses stark colors. We need to implement the soft, light-themed glassmorphism aesthetic.
*   **Force Light Mode**: Set the default background to a very light gray/blue (e.g., `#f4f7fc`) and card backgrounds to pure white (`#ffffff`).
*   **Update CSS Variables**: 
    *   Primary: Vibrant Purple/Indigo (`#6366f1` or similar).
    *   Success: Green (`#10b981`).
    *   Danger: Red (`#ef4444`).
    *   Text: Dark Slate (`#1e293b`) for headings, lighter slate (`#64748b`) for secondary text.
*   **Shadows & Borders**: Remove harsh borders (`border-gray-800` etc.) and replace them with soft, diffuse shadows (`shadow-sm`, `shadow-md` with low opacity) and rounded corners (`rounded-xl` or `rounded-2xl`).
*   **Typography**: Ensure a modern, clean font is used (e.g., `Inter` or `Plus Jakarta Sans`) via `next/font/google`.

## 2. Layout & Shell (`Sidebar.tsx`, `Header.tsx`)
*   **Sidebar**: 
    *   Change background to white.
    *   Update active state styling to use a soft purple background with purple text and a purple left-border accent, matching the target design.
    *   Ensure the logo area ("Sales Analytics") is prominent.
*   **Header**:
    *   Change background to white (or transparent if it blends with the page background).
    *   Style the Date Range Picker to look like a subtle pill/button with a calendar icon.
    *   Style the Export button as a primary solid purple button with a download icon.

## 3. KPI Cards (`KpiCard.tsx`)
The current KPI cards are dark and lack the trend indicators.
*   **Background & Layout**: White background, soft shadow, horizontal layout (Icon on left/right, value prominent).
*   **Icons**: Add specific, colourful background circles for the icons (e.g., light blue circle for a blue cart icon, light orange for a return icon).
*   **Trend Indicators**: Add the small green/red trend text (e.g., `↑ 12.5% vs. last month`) below the main value.

## 4. Chart Components (`BrandBarChart`, `DiscountDonut`, etc.)
The charts currently use neon colors on dark backgrounds.
*   **Color Palette**: Update `lib/utils/colors.ts` to use the target palette:
    *   Blue (`#3b82f6`)
    *   Light Blue (`#60a5fa`)
    *   Purple (`#8b5cf6`)
    *   Pink (`#ec4899`)
    *   Green (`#10b981`)
    *   Orange (`#f97316`)
    *   Yellow (`#eab308`)
*   **Chart Backgrounds**: Ensure the containers (`Card`) are pure white with no harsh borders.
*   **Axes & Grids**: Make chart grid lines very subtle (e.g., `stroke="#e2e8f0"` stroke-dasharray) or remove them entirely for a cleaner look. Remove axis lines where possible.
*   **Donut Chart Center**: Ensure the `DiscountDonut` has the "Avg. Discount 12.8%" text perfectly centered and styled.

## 5. Specific Component Refinements
*   **Channel Table**: Update the table headers to have a subtle background (e.g., `bg-slate-50`) and remove stark borders. Ensure the Return % badges use soft background colors (light green bg with dark green text) rather than solid dark backgrounds.
*   **Key Insights**: Build and style the `Key Insights` panel with small icons for each insight line, as shown in the target design.

## Implementation Steps
1.  Overwrite `app/globals.css` with the new color palette and shadow variables.
2.  Update `lib/utils/colors.ts` with the new chart hex codes.
3.  Modify `Sidebar.tsx` and `Header.tsx` for the light theme and correct spacing.
4.  Refactor `KpiCard.tsx` to include trend indicators and colorful icon wrappers.
5.  Update all Chart components to use the new colors and remove dark-mode specific classes.
6.  Update `build.md` to reflect these UI/UX refinements.
