# Ember Counterflow

**3D Navier–Stokes fire plume + Lagrangian firebrands** — follow one hot ember
out of the fire, into fire-induced **reverse ground flow**, and onto fuel
**against free-stream wind**.

Live: [csasse123.github.io/ember-counterflow](https://csasse123.github.io/ember-counterflow/)

## v4.1 — follow the hero

| Component | Method |
|-----------|--------|
| Air | **3D incompressible NS**, projection (Chorin-style) |
| Buoyancy | **Boussinesq** \(+g\beta_T T\,\hat{\mathbf{y}}\) |
| Heat | Advection–diffusion + volumetric fire source \(Q^*\) |
| Embers | Lagrangian drag + gravity on **trilinear** \(\mathbf{u}\) |
| Views | **Same field** in 3D (Three.js) and mid-plane side cut |

Reverse flow is **not painted as a cartoon**. Magenta markers and arrows show
cells where the **solver** finds streamwise \(u<0\) near the ground. The yellow
**hero ember** is a tracked particle in that field.

### What you should see

1. Orange plume develops; magenta reverse appears in the **lee** of the fire.
2. A yellow hero is released **from the fire** (auto, or the button).
3. Camera follows: loft → fall into reverse → ride **against free-stream**.
4. Green fuel in the reverse corridor ignites red on a successful against-wind landing.
5. Side cut shows the same temperature, velocity arrows, and yellow path.

Details: [docs/PHYSICS.md](docs/PHYSICS.md).

## Run locally

```bash
cd ember-counterflow
python3 -m http.server 8771
# http://localhost:8771
```

Requires ES modules (`solver3d.js` over HTTP, not `file://`). Hard-refresh after deploy.

## License

MIT
