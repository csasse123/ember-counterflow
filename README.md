# Ember Counterflow

**3D Navier–Stokes fire plume + Lagrangian firebrands** — explore why an ember can
move **against** free-stream wind when the fire’s own buoyancy-driven flow
reverses near the ground.

Live: [csasse123.github.io/ember-counterflow](https://csasse123.github.io/ember-counterflow/)

## v3 — physics first

| Component | Method |
|-----------|--------|
| Air | **3D incompressible NS**, projection (Chorin-style) |
| Buoyancy | **Boussinesq** \(+g\beta_T T\,\hat{\mathbf{y}}\) |
| Heat | Advection–diffusion + volumetric fire source \(Q^*\) |
| Embers | Lagrangian drag + gravity on **trilinear** \(\mathbf{u}\) |

Reverse flow is **not painted**. Cyan markers show cells where the **solver**
finds streamwise \(u<0\) near the ground.

Same equation class as simplified fire CFD / FDS low-Mach thinking (coarse
browser grid + eddy viscosity). Details: [docs/PHYSICS.md](docs/PHYSICS.md).

## Use

1. Open the page; wait **15–40 s** for the plume to develop.  
2. Preset **Demo reverse** (moderate wind, strong fire).  
3. Watch **u_min** and reverse cells in the status panel.  
4. Embers loft, fall, and may land **upwind** if reverse cells exist.  

**Wind wins** → reverse cells should shrink (physical).

Drag to orbit, scroll to zoom.

## Run locally

```bash
cd ember-counterflow
python3 -m http.server 8770
# http://localhost:8770
```

Requires ES modules (`solver3d.js` served over HTTP, not `file://`).

## License

MIT
