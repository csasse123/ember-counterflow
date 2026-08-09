# Ember Counterflow

**Why can a wildfire ember travel *against* the ambient wind?**

v2 solves a real **2D Boussinesq Navier–Stokes** system (stream-function / vorticity)
with a fire heat source. Reverse ground flow is an **emergent** solution — not a
painted cartoon velocity field.

Live: [csasse123.github.io/ember-counterflow](https://csasse123.github.io/ember-counterflow/)

## Physics

| Equation | Role |
|----------|------|
| \(\nabla\cdot\mathbf{u}=0\) | Incompressible continuity via \(\psi\) |
| Vorticity transport + \(\nu\nabla^2\omega\) | Momentum (NS) |
| \(g\beta_T\,\partial_x T\) | Boussinesq baroclinic torque (buoyancy) |
| Heat advection–diffusion + \(Q^*\) | Fire as volumetric heat source |
| Lagrangian drag + gravity | Embers on the **NS velocity field** |

Same structure as simplified plume CFD / FDS-class low-Mach thinking (2D, teaching scale).

See [docs/PHYSICS.md](docs/PHYSICS.md).

## How to see reverse spotting

1. Preset **Demo reverse** (moderate wind, strong fire).  
2. Wait ~10–20 s for the plume and in-draft to develop.  
3. Cyan region = **u &lt; 0** (against free-stream).  
4. Watch upwind (green) fuel ignite.

If **Wind wins** (high \(U_w\)), reverse pockets disappear — correct physically.

## Run

```bash
cd ember-counterflow
python3 -m http.server 8770
```

## License

MIT
