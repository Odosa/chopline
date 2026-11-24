# Shopline design instructions

Use the Chopline prototype as the visual and interaction baseline for Shopline. The reference is https://github.com/Odosa/chopline at commit 20b7a2666f6a5c5cf27ce8d580e33a622e267429. The rendered reference is https://chopline.onrender.com/.

## Reference source

- Read `dist/styles.css` for colour tokens, light and dark themes, typography, spacing, components, and responsive layout.
- Read `dist/controls.js` for dropdowns and theme behaviour, `dist/customer.js` and `dist/operations.js` for screen patterns, and `dist/app.js` for navigation and prototype behaviour.
- Inspect representative customer and operational screens in both themes before designing new pages. If Shopline lives in a separate repository, use the pinned Chopline repository as the reference and keep these instructions in Shopline’s root `AGENTS.md`.

## Extending the system

Reuse shared tokens and components. Extend them when a new pattern has a clear purpose. Apply the same design language in light and dark mode and across phone, tablet, and desktop. Reflow dense tables into labelled rows or cards where necessary so details and actions remain accessible on mobile.

Infer the screens and user journeys relevant to the requested Shopline feature. Flag assumptions that would materially change the workflow. Inventory existing screens before proposing additions and reuse an existing pattern where it fits.

## Screen states

For every new flow, identify the applicable default, loading, submitting, first-use empty, no-results, validation, recoverable error, and success states. Include permission, offline, disabled, or unavailable states when the flow calls for them.

Use shared visual patterns for skeletons, messages, retry controls, and confirmations. Keep loading layouts stable, preserve input after recoverable errors, and give empty and error states a useful next action. Provide deterministic sample data or state controls so the important variants can be demonstrated. Check narrow and wide viewports, both themes, keyboard focus, and reduced motion where applicable.
