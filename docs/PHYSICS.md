# 3D Navier–Stokes for reverse-wind firebrands

## Your critique (correct)

A 2D reduced model or analytic “in-draft cartoon” is **not** an acceptable stand-in
for fire–atmosphere coupling. Reverse ember transport is a **solution of the
momentum equations with buoyancy**, not a painted velocity field. If embers always
follow free-stream wind, the flow solver is inadequate — full stop.

## What production fire CFD actually solves

Codes such as NIST **FDS** (Fire Dynamics Simulator) integrate a **low-Mach-number
form of the Navier–Stokes equations** for buoyancy-driven fire flow (acoustic waves
filtered; density varies through equation of state / temperature). Related wildfire
models (FIRETEC/HIGRAD, WRF-SFIRE class) couple similar momentum/energy equations
to combustion and fuel.

### Continuity (low-Mach / anelastic-style)

Mass conservation with slow density change, often written so that a **pressure
Poisson equation** enforces a divergence constraint on the velocity (projection
method). In the **Boussinesq** teaching limit used here:

\[
\nabla\cdot\mathbf{u}=0
\]

### Momentum

\[
\frac{\partial\mathbf{u}}{\partial t}
+(\mathbf{u}\cdot\nabla)\mathbf{u}
=
-\nabla p
+\nu\nabla^2\mathbf{u}
+\mathbf{g}\,\beta_T\,(T-T_0)
\]

- \(p\): kinematic pressure (or \(p'/\rho_0\))
- \(\nu\): kinematic viscosity (**eddy viscosity** in this browser LES-like scale)
- last term: **Boussinesq buoyancy** (only vertical component)

### Energy / temperature

\[
\frac{\partial T}{\partial t}
+\mathbf{u}\cdot\nabla T
=
\kappa\nabla^2 T
+\dot{Q}(\mathbf{x},t)
\]

Fire = localized heat release \(\dot{Q}\) (full FDS also carries mixture fraction /
combustion; we inject heat as the driving source, same role).

### Firebrands (Lagrangian)

\[
m\frac{d\mathbf{v}}{dt}
=
\tfrac12\rho C_D A\,|\mathbf{u}-\mathbf{v}|(\mathbf{u}-\mathbf{v})
+m\mathbf{g}
\]

with \(\mathbf{u}\) **trilinearly interpolated from the 3D NS field** — including
any reverse-flow cells the PDE solution produces.

## Numerical method in this lab (v3)

**3D fractional-step / projection method** (Chorin-style):

1. Advect–diffuse velocity + buoyancy → intermediate \(\mathbf{u}^*\)  
2. Solve \(\nabla^2\phi=\nabla\cdot\mathbf{u}^*/\Delta t\) (Jacobi/Gauss–Seidel)  
3. Project \(\mathbf{u}^{n+1}=\mathbf{u}^*-\Delta t\nabla\phi\)  
4. Advect–diffuse temperature + fire source  

**Grid:** collocated Cartesian (teaching; FDS uses staggered).  
**Resolution:** coarse (browser real-time), but **equations and 3D geometry are real** —
not a 2D stream-function toy and not a display hack.

## When reverse flow appears

Buoyant plume rises → continuity requires near-ground **in-draft**. On the **lee**
of a wind-tilted plume, in-draft can **oppose** free-stream wind. That is an
**emergent** region with \(u_{\mathrm{stream}}<0\). Embers that fall there can
move **upwind** relative to the free stream.

If free-stream wind is too strong, reverse cells vanish — that is physical, not a bug.

## Honesty bound

This is **not** a substitute for FDS/FIRETEC validation cases. It **is** a genuine
3D NS + buoyancy + Lagrangian ember integration suitable for exploring the mechanism
in-browser. Grid and eddy viscosity are limited by WebGL real-time cost.

## Reading

- McGrattan et al., *FDS Technical Reference Guide* (low-Mach NS for fire).  
- Baum, McGrattan — fire plume LES.  
- Koo et al. — firebrand transport reviews.  
- Linn et al. — FIRETEC.  
- Projection methods: Chorin; standard CFD texts.
