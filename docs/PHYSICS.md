# How reverse-wind embers should be simulated (Navier–Stokes)

## Why the v1.0 “entrainment cartoon” failed

A hand-built velocity field (ambient wind + analytic sink + weak vortex) does **not**
solve mass/momentum consistently. Embers then mostly follow the free-stream wind
because the reverse pocket is too weak, too shallow, or dynamically inconsistent.
Your observation was correct: **without a real flow solution, reverse transport
does not appear.**

## What real models solve

Coupled fire–atmosphere and firebrand codes (NIST **FDS**, LANL **FIRETEC** /
HIGRAD, WRF-SFIRE class systems) integrate the **Navier–Stokes equations** with
**buoyancy** from heat release, typically:

### Continuity (low-Mach / incompressible limit)

\[
\nabla \cdot \mathbf{u} = 0
\]

(or a weakly compressible form that filters acoustic waves — FDS “low Mach number” NS).

### Momentum

\[
\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u}\cdot\nabla)\mathbf{u}
= -\frac{1}{\rho_0}\nabla p' + \nu\nabla^2\mathbf{u}
+ \mathbf{g}\,\beta_T\,(T - T_0) + \mathbf{f}_{\mathrm{drag,fuel}}
\]

- \(p'\): pressure deviation  
- \(\nu\): kinematic viscosity (or eddy viscosity in LES/RANS)  
- \(\beta_T\): thermal expansion (Boussinesq)  
- Last term: optional multiphase drag (vegetation)

### Energy / temperature

\[
\frac{\partial T}{\partial t} + \mathbf{u}\cdot\nabla T
= \kappa\nabla^2 T + \frac{Q'''(\mathbf{x},t)}{\rho c_p}
\]

Fire = localized heat source \(Q'''\) (and/or combustion chemistry in full models).

### Firebrands (Lagrangian)

\[
m_p\frac{d\mathbf{v}_p}{dt}
= \tfrac12\rho C_D A_p\,|\mathbf{u}-\mathbf{v}_p|(\mathbf{u}-\mathbf{v}_p)
+ m_p\mathbf{g}
\]

coupled to the **instantaneous** \(\mathbf{u}(\mathbf{x},t)\) from NS — including
recirculation cells that reverse near the ground.

## 2D teaching solver used in this app (v2)

**Stream-function / vorticity** form of 2D incompressible NS + Boussinesq heat
(same family as many plume DNS/LES cores, reduced to 2D for the browser):

1. Vorticity transport  
   \(\omega_t + \mathbf{u}\cdot\nabla\omega = \nu\nabla^2\omega + g\beta_T\,\partial_x T\)
2. Poisson  
   \(\nabla^2\psi = -\omega\), \(\;u=\partial_y\psi,\; v=-\partial_x\psi\)
3. Temperature advection–diffusion + fire heat source  
4. Embers integrated on the interpolated NS velocity

**Reverse flow** appears when buoyancy-driven in-draft exceeds ambient wind near
the ground on the lee of the plume — an emergent solution of NS, not a painted
region.

## Fidelity ladder

| Level | Method | Reverse flow? |
|-------|--------|----------------|
| Cartoon sinks | Analytic velocity | Usually no |
| **This lab** | 2D Boussinesq NS (SF–vorticity) | Yes, when \(Q\) vs \(U_w\) allows |
| FDS LES | 3D low-Mach NS + combustion | Yes, detailed |
| FIRETEC | Multiphase wildfire LES | Yes, fuel-resolved |

## Reading

- McGrattan et al., NIST **Fire Dynamics Simulator** technical reference (low-Mach NS).  
- Baum, McGrattan — fire plume LES.  
- Koo et al. — firebrand transport reviews.  
- Linn et al. — FIRETEC coupled fire–atmosphere.  
- Classical plume entrainment: Morton–Taylor–Turner (motivation for in-draft).
