# Asset production specification

The site ships with real-time, in-house renders. To reach a fully photoreal, "automotive commercial" finish, commission the following. Every item slots into an existing hook in the code, so no layout or component changes are required.

## 1. Threshold gateway — hero GLB

- **Form:** match the current composition (`scene/Gateway.tsx`): two black-stone pylons 2.6 × 17 × 3.4 m on plinths, a 15.6 m lintel with a satin-gold band, and five telescoping U-frames receding into the opening (alternating satin champagne gold and brushed dark titanium), with inlaid light channels.
- **Detail:** chamfered/bevelled edges (5–30 mm), visible stone grain and honing marks, brushed-metal direction following each member, recessed channel grooves (light strips are kept as separate meshes so the existing pulse shader can drive them).
- **Topology:** ≤ 120k triangles total; separate meshes per material; UV0 for textures, UV1 non-overlapping for baked AO.
- **Textures:** PBR metal/rough, 2048² (desktop) and 1024² (mobile) KTX2/Basis; one atlas per material family. Baked AO 2048².
- **Delivery:** glTF 2.0 binary, Draco or Meshopt compressed, target ≤ 4 MB desktop / ≤ 1.5 MB mobile. Real-world scale in metres, +Y up, gateway front facing +Z, origin at the threshold floor centre.
- **Integration:** replace the procedural meshes in `Gateway.tsx` with `useGLTF`; keep `LightPathMaterial` on the channel meshes.

## 2. Path-traced 4K stills and film

- **Renderer:** Blender Cycles or equivalent, spectral/filmic view transform, 3840×2160 and 2160×3840.
- **Shots:** match `CAMERA_KEYS` in `choreography.ts` at p = 0, 0.3 and 0.84, so stills crossfade exactly with the live camera (FOV 42° landscape / 64° portrait vertical).
- **Art direction (from the brief):** "Ultra-photorealistic architectural visualization of a monumental sculptural bridge gateway inside a vast midnight-blue stone pavilion, brushed champagne-gold metal, dramatic soft volumetric light, ray-traced reflections, physically accurate materials, premium architectural photography, cinematic wide-angle composition, sophisticated shadows, fine material microdetail, restrained color grading, luxury automotive commercial quality, no text, no logos, no people."
- **Film (optional):** 12–20 s seamless loop of the approach, 3840×2160 ProRes master; deliver AV1 + H.264 MP4 at 1080p/1440p, ≤ 6 MB, muted, with poster frame.
- **Integration:** drop renders into `media-masters/threshold/*.png` and run `node scripts/render-assets.mjs --derive-only` (or the sharp step) to regenerate derivatives; filenames in `src/lib/media.ts` stay the same.

## 3. Atelier North photography

- Replace the five procedural stills with path-traced or photographed architecture at 3840×2160 (+ 4:5 crops for the gallery). Keep subjects and times of day: Halden House (blue hour, lake), Kestrel Gallery (dusk, raking sun), Morrow Pavilion (golden hour + blue hour), Wren House interior (dusk).
- Must remain fictional: no identifiable real buildings, people, logos or locations.

## 4. Device presentations (optional)

- Studio renders of an unbranded laptop and phone, 3840×2160, transparent PNG, matching midnight/gold lighting. Screens left blank (UV-mapped) so live screenshots can be composited.
