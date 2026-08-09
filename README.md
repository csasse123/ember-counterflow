# Ember Counterflow

**Why can a wildfire ember fly *against* the wind and light fuel upwind?**

Interactive HTML lab of fire–atmosphere coupling: ambient wind, a buoyant plume,
ground-level **in-draft** (entrainment), a reverse-flow pocket, and Lagrangian
firebrands that can land and ignite **upwind** of the flame — the
counterintuitive case many firefighters and observers report.

Live (after Pages deploy): `https://csasse123.github.io/ember-counterflow/`

## Physics (pedagogical model)

Not full LES (FIRETEC / WRF-SFIRE). A **reduced-order field** that captures the
mechanism:

1. **Ambient wind** \(U_w\) left → right.  
2. **Heat release** \(Q\) drives a **buoyant plume** (tilted by wind).  
3. **Entrainment / in-draft**: mass continuity for the rising plume → horizontal
   inflow toward the fire base. On the **downwind** side this inflow **opposes**
   ambient wind and can reverse the ground-level flow.  
4. **Embers** (Lagrangian particles): drag + gravity; lofted in the plume, then
   advected by the local velocity (including reverse pockets).  
5. **Fuel ignition**: energy deposited by hot embers that land (threshold model).

References for the real phenomenon: firebrand / spotting reviews (Koo et al.),
fire-induced winds and plume entrainment (Kochanski and others), FIRETEC-class
coupled fire–atmosphere models, NWCG spotting behavior notes.

## Controls

- Wind speed, fire intensity, entrainment strength  
- Ember size / number / loft temperature  
- Fuel moisture (ignition threshold)  
- Show velocity field, reverse-flow region, trajectories  

## Run

```bash
cd ember-counterflow
python3 -m http.server 8770
# http://localhost:8770
```

## License

MIT
