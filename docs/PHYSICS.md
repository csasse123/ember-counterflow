# Physics notes: embers against the wind

## The puzzle

Ambient wind blows **left → right**. Yet observers (and firefighters) report
**spot fires upwind** of a burning tree or flame front — fuel that “should” be
protected by the wind. Embers appear to travel **against** the free-stream wind.

## Mechanism (reduced model in this lab)

A fire is not a passive smoke source in a uniform wind. It is a **buoyant heat
engine**:

1. **Heat release** \(Q\) produces a **rising plume**.  
2. Continuity requires **entrainment**: air is drawn into the plume base from
   the surroundings (**in-draft**).  
3. Near the ground, that in-draft has a strong **horizontal component toward
   the fire**.  
4. **Downwind** of the fire, ambient wind and in-draft **oppose**. When
   in-draft wins, ground-level velocity is **negative** (right → left): a
   **reverse-flow pocket**.  
5. **Firebrands** lofted by the plume can fall into that pocket, be carried
   **upwind**, and ignite receptive fuel.

A weak **lee recirculation** (vortex) is added to represent turbulent re-entrainment
on the downwind side of a tilted plume — still a cartoon of full LES.

## What this is *not*

Not a replacement for operational spotting models (Albini-class) or coupled
CFD (FIRETEC, WRF-SFIRE, etc.). Those resolve 3D turbulence, combustion, and
fuel structure. This app isolates the **fire-induced reverse inflow + ember
trajectory** story for teaching.

## Reading

- Koo, Pagni, et al., firebrand / spotting reviews (Int. J. Wildland Fire).  
- NWCG crown fire / spotting behavior notes.  
- Fire-induced winds and plume–ABL coupling (e.g. Kochanski and collaborators).  
- Plume entrainment classical theory (Morton–Taylor–Turner) as the basis for
  in-draft scaling.
