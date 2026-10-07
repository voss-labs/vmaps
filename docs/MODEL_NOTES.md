# Model notes

## Sources

- About 63 photos of Level 1 taken on 2026-10-06, in walking order from the main gate to M block. They are not in the repository because they show students.
- A hand-drawn sketch of the block layout: A, B, C and D in one row, G, F and E in the other, and M as a separate building at the far end.
- The satellite view on Google Maps, measured against its scale bar. The main building's roof is about 110 m long and 36 m wide. M block is a separate, lower building of roughly 40 by 50 m at the east end.
- The earlier source video, `IMG_4946.MOV` (44.5 seconds). Four of its frames are in `public/reference/` and shown in the website:

| Image              | Approximate time | Main evidence                                  |
| ------------------ | ---------------- | ---------------------------------------------- |
| `feature-wall.jpg` | 00:07            | Yellow D block wall, galleries and café edge   |
| `atrium.jpg`       | 00:16            | Stair gallery, stone volume and gathering area |
| `walkway.jpg`      | 00:25            | Interior walkway and surrounding walls         |
| `stairway.jpg`     | 00:31            | Stairs, handrails and upper landing            |

## Layout

The main building is one hall under a steel space-frame roof. The west end is a plain wall. The main gate is an opening in the south side at the west end, under a bamboo canopy and blue sheeting. Blocks line both long sides, with the main hall between them. Their fronts are not straight: feature volumes stand 2 to 5 m out into the hall, which narrows to about 9 to 12 m in places.

- North side, from the west wall: A (VIT glass box, accounts, library upstairs), a chess court, the exam department with the red phone box, print kiosk, ATM and stone prow, B (curved base, steel stair to a landing over the reception, blue wall, OSB box), the common area with the HP World kiosk, C (Cafeteria C-101 with Ribbons & Balloons and washrooms at the west end, under a white concrete frame), Nescafe, and D (yellow wall over a Level 2 walkway and a stone base, Department of First Year Engineering).
- South side: the main gate, G (sawtooth glass, wedge balconies, a red brick box over the Computer Centre), a white stair tower with orange walls, the blue recess, F (a white Level 1 volume with a prow, the cream wall and timber box above, the F stair and recess, then a tan base, black band and orange box), Gate 2 out to the parking, and E (red brick wall with a wavy top, timber box, stationery shop, Department of Information Technology, lift and curved maroon wall).
- A glass box on slim columns stands between D and E, above a Level 2 platform reached by timber steps and a stair underneath. The east wall opens to the M block canteen and the lounge.

Two canteens can be walked into:

- **Cafeteria C-101** in C block, through the door in the polycarbonate front: the V billing counter, a dining area up to the back wall, booths along a padded wall, an orange end wall, and Ribbons & Balloons through a brick funnel at the west end. It follows photos 18 to 27.
- **The M block canteen**, 7 steps (1.1 m) down from the east end. It is one long hall running north-south, with the glass wall onto the road at the south end. It has a servery bay running back under the platform, the menu wall, the kitchen, and a side area with the Innovation Lounge (M-003) door at the north end. It follows photos 44 to 63.

The main hall floor is Level 1. The ground floor below holds the labs and is reached by stairs in openings in the Level 1 floor. Levels 1 to 3 hold classrooms and Level 4 is a terrace and viewing gallery. Rooms are named by block, floor and number, for example F205.

## Estimates

Block lengths, block depths, the position of every landmark and opening, the 4 m floor height and the roof height are estimated from the photos. Positions along the hall carry about 2 m of error and positions across it about 1.5 to 2.5 m; heights and proportions are firmer. Some measurements conflicted between photos, notably how far G's east end, the stair tower and F's white volume stand out into the hall; the model takes a middle position. The upper floors are generic balconies, rooms and terraces except where a block has a distinctive volume. The library is shown in A block as described, but the photo captions call the stair tower between G and F the stairs to the library, so how it is reached is not confirmed. Viewpoint names describe places in the model.

No photogrammetry, depth recovery or scanning was done. The scene is a manual interpretation of the photos. It should not be used for measurements or emergency navigation.

## Not modelled yet

The rest of M block, including the innovation labs behind the M-003 door, the ground-floor labs, other room interiors, and walking on any upper floor.

## Improving accuracy

Walk the model and correct positions in `src/lib/campus/` (see `docs/DEVELOPMENT.md`). A floor plan or the fire-exit plan boards, a few paced distances and the step count of one flight of stairs would calibrate the sizes. Capture each floor before adding it as confirmed.
