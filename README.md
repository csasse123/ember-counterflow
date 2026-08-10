# Ember Counterflow

**3D Navier–Stokes fire plume + Lagrangian firebrands** — follow one hot ember
out of the fire, into fire-induced **reverse ground flow**, and onto fuel
**against free-stream wind**.

Live: [csasse123.github.io/ember-counterflow](https://csasse123.github.io/ember-counterflow/)

## v4.2 — bulk with the wind, rare reverse

| Component | Method |
|-----------|--------|
| Air | **3D incompressible NS**, projection (Chorin-style) |
| Buoyancy | **Boussinesq** \(+g\beta_T T\,\hat{\mathbf{y}}\) |
| Heat | Advection–diffusion + volumetric fire source \(Q^*\) |
| Embers | Lagrangian drag + gravity on **trilinear** \(\mathbf{u}\) |
| Views | **Same field** in 3D (Three.js) and mid-plane side cut |

**Main story:** almost every firebrand flies **with free-stream wind** (→) and
can spot downwind. Only **one or two** heavy pieces fall into fire-induced reverse
ground flow and fly **backwards** — that is reverse ignition.

Magenta markers are cells where the **solver** finds \(u<0\). Yellow balls are the
rare reverse riders; small orange sparks are the bulk stream.

### What you should see

1. Orange plume + many small sparks streaming **with the wind** downwind.
2. Magenta reverse under the lee of the fire.
3. **1–2 yellow reverse riders** fall into reverse and ride against free-stream.
4. Green reverse fuel can ignite from those riders; brown downwind pads from the bulk.
5. Side cut: same field, orange bulk dots, yellow reverse path.

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
