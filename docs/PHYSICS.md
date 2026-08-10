# Physics: reverse air is real; reverse firebrands are rare

## Does a “reverse ember model” exist?

### What the literature actually supports

| Mechanism | Established? | Role for embers |
|-----------|--------------|-----------------|
| **Downwind spotting** (Tarifa, Albini, Koo, WRF-Fire) | Yes — operational | Loft in plume → free-stream wind → land downwind |
| **Fire-induced reverse / inflow near ground** (Meroney canopy, He et al. bushfire–wind CFD, LES of tilted plumes) | Yes — fluid dynamics | Air feeds the buoyant plume from the **lee**; near-ground \(u\) can oppose free-stream |
| **Dedicated “firebrands fly against free-stream to start reverse spot fires” model** | **No** standard operational model | Not in Albini/BehavePlus-class tools as a separate pathway |
| **Turbulent / intermittent reverse pockets** (He et al.: intermittent reverse downstream of fire) | Yes — LES/CFD | Subgrid fluctuations can put a **small fraction** of particles into reverse cells |
| **Extreme long-range spotting via atmospheric waves** (Farazmand 2024) | Research | Still **downwind**; waves delay landing, do not reverse direction |

**Honest summary:** reverse **air** under a wind-tilted fire plume is real PDE physics. Almost all firebrand literature is **downwind** transport. Rare reverse-going brands are a **consequence** of sampling fire-induced reverse inflow + turbulence — not a separate chaos-theory law, and not a named “counterflow spotting” product model.

### What we emulate (v5)

1. **3D Boussinesq Navier–Stokes** (projection method) for \(\mathbf{u},T\) — same field for side cut and 3D.  
2. **Tarifa-style Lagrangian firebrands**  
   \[
   m\frac{d\mathbf{v}}{dt}
   =
   \tfrac12\rho C_D A\,|\mathbf{u}+\mathbf{u}'-\mathbf{v}|\,(\mathbf{u}+\mathbf{u}'-\mathbf{v})
   + m\mathbf{g}
   \]
   with \(\mathbf{u}\) trilinear from the NS field.  
3. **Subgrid turbulence (Langevin / OU process)** on \(\mathbf{u}'\) — standard atmospheric Lagrangian dispersion. This is the “micro-turbulence” that lets **occasional** particles enter reverse cells; it is **not** hand-drawn reverse paths.  
4. **No artificial reverse hero bias** for bulk particles: light brands stay high and go with free-stream; denser brands that fall into reverse can move against free-stream.

### Reverse ignition in this lab

- **Green pads** sit in the lee reverse corridor (where \(u<0\) in the solved field).  
- **Bulk stream** (small sparks) → mostly with free-stream, downwind.  
- **Retro embers** (highlighted yellow/magenta) = particles whose recent path has \(v_x < 0\) while sampling reverse air — rare, from reverse cells + \(\mathbf{u}'\).

### References (entry points)

- Tarifa et al. — classic firebrand trajectory / terminal-velocity ideas  
- Koo et al. 2010 — review of firebrand generation / transport / ignition  
- Meroney — reverse flow downstream of fire line in canopy feeding the plume  
- He et al. (IAFSS) — bushfire–wind interaction; intermittent reverse flow  
- Farazmand 2024 arXiv:2411.13275 — wave-enhanced **downwind** spotting  
- WRF-Fire firebrand parameterization — coupled atmosphere–fire, still primarily downwind spotting  

## Numerical NS (unchanged class)

Projection method, Boussinesq buoyancy, heat source at fire, eddy viscosity. Coarse browser grid; equations are the teaching form of fire CFD, not a painted cartoon.
