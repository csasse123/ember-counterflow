# Ember Counterflow

**Question:** can firebrands go *against* free-stream wind, and is there a real model for that?

**Short answer:** reverse **air** under a wind-tilted fire is real CFD. Almost all **firebrand spotting** literature is **downwind**. Rare reverse-going brands can appear if particles sample fire-induced reverse inflow plus turbulence — not a separate operational “reverse spotting” product.

Live: [csasse123.github.io/ember-counterflow](https://csasse123.github.io/ember-counterflow/)

## v5 — literature-honest model

| Piece | Source |
|-------|--------|
| Air | 3D Boussinesq Navier–Stokes (projection), fire heat, buoyancy |
| Brands | **Tarifa-style** Lagrangian quadratic drag + gravity on trilinear \(\mathbf{u}\) |
| Rare reverse paths | Fire-induced reverse cells in NS + **Langevin subgrid turbulence** \(\mathbf{u}'\) |
| Views | **Side cut is primary**; 3D is supporting context (same field) |

See [docs/PHYSICS.md](docs/PHYSICS.md) for references (Tarifa, Koo, Meroney reverse inflow, He et al. intermittent reverse, Farazmand wave spotting — still downwind).

### What you should see

1. **Orange bulk sparks** loft and go **with free-stream wind →** (standard spotting).  
2. **Magenta** = solved reverse air in the lee (feeds the plume).  
3. **Yellow trails / balls** = rare brands with \(v_x < 0\) (retro).  
4. Green pads = reverse-corridor fuel; brown = downwind fuel.  
5. Raise **σ_turb** or press **heavy brands** to increase reverse chance.

## Run locally

```bash
cd ember-counterflow
python3 -m http.server 8771
# http://localhost:8771  (hard-refresh)
```

## License

MIT
