# Design System Strategy: The Breathable Interface



## 1. Overview & Creative North Star

**The Creative North Star: "The Living Sanctuary"**

This design system moves beyond the clinical coldness of traditional health apps to create a digital environment that feels like a high-end wellness retreat. We reject the "template" look of rigid grids and 1px borders. Instead, we embrace **Soft Editorial Minimalism**: a layout philosophy driven by intentional asymmetry, vast white space, and a "layered paper" depth model.



The goal is to reduce cognitive load. We achieve this by treating the screen as a physical space where elements breathe, overlap slightly, and transition through tonal shifts rather than hard lines. It is an experience of "quiet authority"—sophisticated, premium, and deeply intuitive.



---



## 2. Colors & Surface Philosophy

Our palette uses deep, forest-inspired greens (`primary`) and serene, aquatic blues (`secondary`) to ground the user.



### The "No-Line" Rule

**Borders are strictly prohibited for sectioning.** To define boundaries, designers must use background color shifts. A section should be distinguished by moving from `surface` to `surface-container-low`. This creates a seamless, "molded" look that feels custom-built rather than assembled.



### Surface Hierarchy & Nesting

Think of the UI as a series of stacked, premium materials. Use the `surface-container` tiers to define importance:

* **Base Layer:** `surface` (#f8faf9) – The expansive canvas.

* **Secondary Zones:** `surface-container-low` (#f2f4f3) – For subtle grouping of content.

* **Interactive Cards:** `surface-container-lowest` (#ffffff) – To create a "pop" of high-clarity focus.

* **Overlays/Modals:** `surface-container-high` (#e6e9e8) – To signal temporary elevation.



### The "Glass & Gradient" Rule

To add "soul" to the interface, use **Glassmorphism** for floating navigation or quick-action panels. Combine `surface` at 70% opacity with a `backdrop-blur` of 20px.

* **Signature Textures:** For primary CTAs and Hero progress rings, use a subtle linear gradient from `primary` (#0f5238) to `primary_container` (#2d6a4f). This avoids the flat, "default" look and adds a sense of organic vitality.



---



## 3. Typography: Editorial Clarity

We pair two distinct sans-serifs to create an editorial rhythm that guides the eye.



* **Display & Headlines (Manrope):** Use `display-lg` and `headline-md` for high-impact moments—daily summaries or motivational headers. The wide apertures of Manrope convey openness and modernity.

* **Body & Labels (Plus Jakarta Sans):** Use `body-lg` (1rem) for all reading-heavy content. This typeface is chosen for its exceptional legibility at small scales, ensuring health data is never misinterpreted.

* **The Hierarchy Rule:** Use `on_surface_variant` (#404943) for secondary metadata to create a soft contrast against the deep `on_surface` (#191c1c) titles. This tonal distinction is more sophisticated than simply changing font sizes.



---



## 4. Elevation & Depth

In this system, depth is a feeling, not a feature. We move away from structural lines toward **Tonal Layering**.



* **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, natural "lift" that mimics high-end stationary.

* **Ambient Shadows:** When an element must float (e.g., a floating action button), use a shadow with a blur radius of at least `32px` at `6%` opacity. The shadow color should be a tinted version of `primary` (#0f5238) rather than black, creating a natural "glow" effect.

* **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline-variant` (#bfc9c1) at **20% opacity**. Never use a 100% opaque border.

* **Glassmorphism:** Use `surface_bright` with `backdrop-blur` for global navigation to allow the lush greens and blues of background data visualizations to "bleed" through the edges, integrating the UI into the content.



---



## 5. Components



### Buttons & Chips

* **Primary Button:** Uses the `xl` (1.5rem) roundedness scale. Background: `primary` gradient; Text: `on_primary` (#ffffff).

* **Secondary/Selection Chips:** Use `secondary_container` (#a3d8fe) with `on_secondary_container` (#255f80). Avoid sharp corners; stay at `full` (9999px) roundness for a pill-shaped, organic feel.



### Input Fields & Controls

* **Inputs:** Background should be `surface-container-highest` (#e1e3e2) with no border. On focus, transition to `surface-container-lowest` (#ffffff) with a 1px "Ghost Border" of `primary`.

* **Checkboxes/Radios:** Use `primary` for the active state. The "checked" icon should be `on_primary`.



### Data Visualizations (App Specific)

* **Progress Rings:** Use a thick stroke (8px+) with rounded caps. Use `primary_fixed` (#b1f0ce) for the track and the `primary` gradient for the progress.

* **Charts:** Forbid the use of grid lines. Use `surface-variant` dots for axis markers to keep the visual field clean and calming.



### Cards & Lists

* **The Divider Ban:** Strictly forbid 1px dividers between list items. Instead, use a `3` (1rem) vertical gap from the spacing scale or alternating backgrounds of `surface` and `surface-container-low`.



---



## 6. Do’s and Don’ts



### Do:

* **Do** use `20` (7rem) or `24` (8.5rem) spacing for top-level page margins to create a high-end editorial feel.

* **Do** overlap elements slightly (e.g., a card bleeding 20px over a header gradient) to create a sense of bespoke layering.

* **Do** ensure Dark Mode uses `surface_dim` (#d8dada) for containers rather than pure black to maintain the "soft" brand identity.



### Don't:

* **Don't** use 100% black (#000000) for text. Always use the `on_surface` token for better optical comfort.

* **Don't** use "Drop Shadows" on every card. Reserve them only for the highest-priority floating elements.

* **Don't** crowd the screen. If a section feels "busy," double the spacing scale value (e.g., move from `8` to `16`).