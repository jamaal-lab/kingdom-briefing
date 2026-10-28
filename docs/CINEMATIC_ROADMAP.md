# Cinematic improvement opportunities

Ranked by visual impact per unit of effort. None of these is required for staging.

## 1. Commissioned gateway GLB with baked lighting — highest impact
**Now:** procedural boxes and extrusions; edges are clean CG, metals rely on an environment built from light-formers; no micro-surface detail.
**Opportunity:** a sculpted gateway model (spec in `ASSET_PRODUCTION_SPEC.md` §1) with bevelled, chipped edges, brushed-metal normal maps following each member, and **baked ambient occlusion / lightmaps** for the static stone. Baked lighting gives the soft contact shadows that read as "photographed" and costs less GPU at runtime than the current real-time shadow map. Keep the light channels as separate meshes so the existing pulse shader still drives them.
**Effort:** external 3D artist, ~1–2 weeks; integration ~1 day (`useGLTF` replaces meshes in `Gateway.tsx`).

## 2. Path-traced hero stills + short film loop
**Now:** posters and project images are real-time renders captured from the live scene (consistent, but not ray-traced).
**Opportunity:** render the three Threshold keyframes and the five Atelier North shots in Blender Cycles at 3840×2160 using the same cameras (`CAMERA_KEYS`, FOV 42°/64°). Drop masters into `media-masters/` and run `npm run render:assets -- --derive-only`. Optionally a 12–20 s approach film as the poster tier's experience on phones.
**Effort:** depends on #1 for the Threshold; Atelier North can be modelled independently.

## 3. Real-time material and lighting upgrades (no new assets)
- **HDRI environment** captured from a real architectural space (licensed, e.g. Poly Haven CC0) blended with the current light-formers for richer, less uniform metal reflections.
- **Screen-space reflections + GTAO** in the `full` tier for contact shading where pylons meet the floor (cost: measure on mid-range GPUs first).
- **Volumetric fog with light scattering** (ray-marched in the shafts only) replacing the additive cones.
- **Stone and metal texture sets** (2K, KTX2-compressed) from a licensed library to replace procedural noise maps.
**Effort:** 2–4 days of shader/lighting work plus real-GPU profiling.

## Smaller polish
- Subtle **depth of field** during the approach chapter (focus on the inner frame).
- **Audio** (opt-in, off by default): a low architectural ambience that swells at the crossing.
- WebKit pass for the `lite` tier on iPhone (texture sizes, DPR cap).
