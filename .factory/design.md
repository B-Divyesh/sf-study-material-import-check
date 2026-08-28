# Visual thesis — The quiet paper workshop

## Direction and fit

Study Material Import Check is a **paper-cut diorama**, not a generic software dashboard. A learner's source file is treated like a small stack of index cards moving across a calm inspection desk: cut-paper layers make parsing, mapping, repair, and export feel tangible and reversible. The decoration explains the product—the hero shows a raw paper stack becoming neat study cards—and then recedes once the work begins.

The experience is deliberately single-mode and light. It evokes a sunlit desk and avoids the urgency, streaks, trophies, and neon reward colors of gamified learning products.

## Tokens

- **Paper canvas** `#F5F0E6`: warm uncoated stock; page background.
- **Fresh sheet** `#FFFCF5`: work surfaces.
- **Graphite** `#252A28`: primary text (12.7:1 on canvas).
- **Pencil** `#5B635F`: secondary text (5.7:1 on canvas).
- **Forest ink** `#195B4B`: primary action; white text is 7.4:1.
- **Deep forest** `#104438`: hover/focus companion.
- **Marigold** `#E5A93D`: selected tabs, cut-paper tabs, and non-text accents.
- **Rust** `#9D3F2F`: errors and dangerous findings.
- **Moss** `#397153`: valid state.
- **Blue pencil** `#2D6170`: informational marks.
- **Kraft shadow** `#CFC3AE`: outlines and physical depth.

Status is always paired with a word and icon, never color alone.

## Type and spacing

- Headings: Georgia, Cambria, `Times New Roman`, serif. Its bookish shapes locate the tool in a learner's desk without adding font bytes.
- Interface/body: Inter-like system stack (`ui-sans-serif`, `system-ui`, Segoe UI, sans-serif) for clean controls and tables.
- Type scale: 14, 16, 18, 22, 32, and clamp(40–64) px; body is 16 px minimum; tables use tabular figures.
- Spacing follows a 4/8 px rhythm: 4, 8, 12, 16, 24, 32, 48, 64. Reading measure tops out at 68 characters.

## Layers and interaction grammar

- Major stages are a horizontal paper trail on desktop and a compact stacked trail on phone.
- Source input is a slightly rotated cream sheet. The workbench is a flat fresh sheet; findings resemble margin notes. Small 1–3 px offsets and hard-edged kraft shadows create physical depth.
- One forest-green action advances each stage. Secondary actions look like pencil annotations, not competing buttons.
- Drop and paste share equal prominence. Keyboard users can activate the drop sheet and choose a file.
- Mapping controls sit directly above preview columns so cause and effect remain spatially connected.
- On 390 px screens the illustration drops behind the introduction, the stage trail becomes two columns, and column mapping becomes a stacked, touch-friendly list with a compact card preview.

## Motion

Paper layers settle with a 220 ms translate-and-opacity entrance; tabs and buttons respond in 150 ms. Findings appear once rather than looping. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes are instantaneous. No flashing or ambient motion.

## Asset plan and provenance

The only raster illustration is a wide hero scene: an abstract paper-cut desk where uneven source slips pass through a green inspection frame and emerge as three orderly study cards. It is explanatory, has generous empty paper around it, and includes no UI screenshot, text, people, brands, or logos. Small icons and the leaf favicon are original SVGs authored for this product.

### Generation prompt

> Use case: stylized-concept. Asset type: responsive landing-page hero illustration. Primary request: a handcrafted paper-cut diorama showing a small uneven stack of study-note slips passing through a simple forest-green inspection arch and emerging as three tidy flash cards. Scene/backdrop: warm cream paper desk, layered deckled paper shapes, small marigold tab, subtle blue pencil check marks made only as abstract marks. Style/medium: tactile cut paper and card stock photographed from a gentle three-quarter top-down angle, editorial still life, not 3D plastic. Composition/framing: wide landscape, object group centered-right, calm generous negative space and soft paper shadows. Lighting/mood: soft morning window light, quiet, trustworthy, unhurried. Color palette: warm cream, off-white, graphite, forest green, muted marigold, tiny rust accent. Materials/textures: fibrous uncoated paper, crisp hand-cut edges, layered paper depth. Constraints: no readable text, no letters, no numbers, no people, no devices, no logos, no watermark, no gradients, no glossy plastic, no neon, no confetti, no trophies.

- Generator: Azure AI Foundry via factory `gen-image.sh`, deployment `factory-image`.
- Date: 2026-08-28.
- License/provenance: original model-generated asset commissioned for this product; retained source prompt sidecar in `assets/src/` and disclosed in the footer.
- Delivery: optimized responsive WebP/AVIF plus JPEG fallback; content-hashed filenames allow safe immutable caching, and the mobile candidate is under 300 KB with explicit dimensions.
