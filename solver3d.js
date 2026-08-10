/**
 * 3D incompressible Boussinesq Navier–Stokes (projection method) + heat
 * + Lagrangian firebrands.
 *
 * Equations (kinematic pressure):
 *   ∂u/∂t + (u·∇)u = -∇p + ν∇²u + g β T ê_y
 *   ∇·u = 0
 *   ∂T/∂t + u·∇T = κ∇²T + Q̇_fire
 *
 * Not a visualization hack: reverse flow, if present, is a PDE solution.
 */

export class Fluid3D {
  /**
   * @param {object} o
   * @param {number} o.nx
   * @param {number} o.ny
   * @param {number} o.nz
   * @param {number} o.Lx world size x (m)
   * @param {number} o.Ly
   * @param {number} o.Lz
   * @param {number} o.x0 world origin x of i=0
   * @param {number} o.z0 world origin z of k=0
   */
  constructor({ nx = 48, ny = 28, nz = 48, Lx = 60, Ly = 24, Lz = 48, x0 = -18, z0 = -24 } = {}) {
    this.nx = nx; this.ny = ny; this.nz = nz;
    this.Lx = Lx; this.Ly = Ly; this.Lz = Lz;
    this.x0 = x0; this.y0 = 0; this.z0 = z0;
    this.dx = Lx / (nx - 1);
    this.dy = Ly / (ny - 1);
    this.dz = Lz / (nz - 1);
    const N = nx * ny * nz;
    this.N = N;
    this.u = new Float32Array(N);
    this.v = new Float32Array(N);
    this.w = new Float32Array(N);
    this.u1 = new Float32Array(N);
    this.v1 = new Float32Array(N);
    this.w1 = new Float32Array(N);
    this.p = new Float32Array(N);
    this.div = new Float32Array(N);
    this.T = new Float32Array(N);
    this.T1 = new Float32Array(N);

    /** @type {object} */
    this.params = {
      wind: 1.6,       // free-stream +x (m/s)
      nu: 0.08,        // eddy viscosity
      kappa: 0.10,     // thermal diffusivity
      buoy: 8.0,       // g*beta (m/s²/K_unit)
      Q: 3.0,          // fire heat strength
      fireW: 2.5,      // fire half-width scale (m)
      fireX: 0,
      fireZ: 0,
    };
    this.reset();
  }

  I(i, j, k) {
    return (k * this.ny + j) * this.nx + i;
  }

  worldX(i) { return this.x0 + i * this.dx; }
  worldY(j) { return this.y0 + j * this.dy; }
  worldZ(k) { return this.z0 + k * this.dz; }

  reset() {
    const { nx, ny, nz, u, v, w, T, p } = this;
    const U = this.params.wind;
    for (let k = 0; k < nz; k++) {
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const id = this.I(i, j, k);
          u[id] = U;
          v[id] = 0;
          w[id] = 0;
          T[id] = 0;
          p[id] = 0;
        }
      }
    }
  }

  /** Fire heat source at cell center */
  heatSource(i, j, k) {
    const x = this.worldX(i) - this.params.fireX;
    const y = this.worldY(j);
    const z = this.worldZ(k) - this.params.fireZ;
    const fw = this.params.fireW;
    if (y > 5.5) return 0;
    const rh = (x * x + z * z) / (fw * fw);
    const gx = Math.exp(-0.5 * rh);
    const gy = Math.exp(-y / (2.0 + 0.35 * this.params.Q));
    return this.params.Q * 22 * gx * gy;
  }

  /** Upwind scalar gradient */
  _advectScalar(arr, i, j, k, uu, vv, ww) {
    const { dx, dy, dz } = this;
    const id = this.I(i, j, k);
    let ddx, ddy, ddz;
    if (uu > 0) ddx = (arr[id] - arr[this.I(i - 1, j, k)]) / dx;
    else ddx = (arr[this.I(i + 1, j, k)] - arr[id]) / dx;
    if (vv > 0) ddy = (arr[id] - arr[this.I(i, j - 1, k)]) / dy;
    else ddy = (arr[this.I(i, j + 1, k)] - arr[id]) / dy;
    if (ww > 0) ddz = (arr[id] - arr[this.I(i, j, k - 1)]) / dz;
    else ddz = (arr[this.I(i, j, k + 1)] - arr[id]) / dz;
    return uu * ddx + vv * ddy + ww * ddz;
  }

  _lap(arr, i, j, k) {
    const { dx, dy, dz } = this;
    const id = this.I(i, j, k);
    return (
      (arr[this.I(i + 1, j, k)] + arr[this.I(i - 1, j, k)] - 2 * arr[id]) / (dx * dx) +
      (arr[this.I(i, j + 1, k)] + arr[this.I(i, j - 1, k)] - 2 * arr[id]) / (dy * dy) +
      (arr[this.I(i, j, k + 1)] + arr[this.I(i, j, k - 1)] - 2 * arr[id]) / (dz * dz)
    );
  }

  applyVelocityBC() {
    const { nx, ny, nz, u, v, w } = this;
    const U = this.params.wind;
    // Inlet x = 0
    for (let k = 0; k < nz; k++) {
      for (let j = 0; j < ny; j++) {
        const id = this.I(0, j, k);
        u[id] = U; v[id] = 0; w[id] = 0;
      }
    }
    // Outlet x = nx-1: Neumann
    for (let k = 0; k < nz; k++) {
      for (let j = 0; j < ny; j++) {
        const id = this.I(nx - 1, j, k);
        const idm = this.I(nx - 2, j, k);
        u[id] = u[idm]; v[id] = v[idm]; w[id] = w[idm];
      }
    }
    // Ground j=0 no-slip
    for (let k = 0; k < nz; k++) {
      for (let i = 0; i < nx; i++) {
        const id = this.I(i, 0, k);
        u[id] = 0; v[id] = 0; w[id] = 0;
      }
    }
    // Top free-slip-ish
    for (let k = 0; k < nz; k++) {
      for (let i = 0; i < nx; i++) {
        const id = this.I(i, ny - 1, k);
        const idm = this.I(i, ny - 2, k);
        u[id] = u[idm]; v[id] = 0; w[id] = w[idm];
      }
    }
    // z walls free-slip
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        let id = this.I(i, j, 0);
        let idp = this.I(i, j, 1);
        u[id] = u[idp]; v[id] = v[idp]; w[id] = 0;
        id = this.I(i, j, nz - 1);
        idp = this.I(i, j, nz - 2);
        u[id] = u[idp]; v[id] = v[idp]; w[id] = 0;
      }
    }
  }

  /** One projection step */
  step(dt) {
    const { nx, ny, nz, u, v, w, u1, v1, w1, T, T1, p, div } = this;
    const { nu, kappa, buoy } = this.params;
    // CFL-ish clamp
    let umax = 1e-3;
    for (let n = 0; n < this.N; n++) {
      umax = Math.max(umax, Math.abs(u[n]), Math.abs(v[n]), Math.abs(w[n]));
    }
    const h = Math.min(dt, 0.4 * Math.min(this.dx, this.dy, this.dz) / umax);

    // --- Intermediate velocity ---
    for (let k = 1; k < nz - 1; k++) {
      for (let j = 1; j < ny - 1; j++) {
        for (let i = 1; i < nx - 1; i++) {
          const id = this.I(i, j, k);
          const uu = u[id], vv = v[id], ww = w[id];
          const advU = this._advectScalar(u, i, j, k, uu, vv, ww);
          const advV = this._advectScalar(v, i, j, k, uu, vv, ww);
          const advW = this._advectScalar(w, i, j, k, uu, vv, ww);
          const lapU = this._lap(u, i, j, k);
          const lapV = this._lap(v, i, j, k);
          const lapW = this._lap(w, i, j, k);
          // Buoyancy in +y only
          u1[id] = uu + h * (-advU + nu * lapU);
          v1[id] = vv + h * (-advV + nu * lapV + buoy * T[id]);
          w1[id] = ww + h * (-advW + nu * lapW);
        }
      }
    }
    // copy boundaries into u1
    for (let k = 0; k < nz; k++) {
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          if (i === 0 || j === 0 || k === 0 || i === nx - 1 || j === ny - 1 || k === nz - 1) {
            const id = this.I(i, j, k);
            u1[id] = u[id]; v1[id] = v[id]; w1[id] = w[id];
          }
        }
      }
    }

    // Divergence of u*
    const { dx, dy, dz } = this;
    for (let k = 1; k < nz - 1; k++) {
      for (let j = 1; j < ny - 1; j++) {
        for (let i = 1; i < nx - 1; i++) {
          const id = this.I(i, j, k);
          div[id] = (
            (u1[this.I(i + 1, j, k)] - u1[this.I(i - 1, j, k)]) / (2 * dx) +
            (v1[this.I(i, j + 1, k)] - v1[this.I(i, j - 1, k)]) / (2 * dy) +
            (w1[this.I(i, j, k + 1)] - w1[this.I(i, j, k - 1)]) / (2 * dz)
          ) / h;
        }
      }
    }

    // Pressure Poisson ∇²p = div/h  (we stored div/h already as div)
    // Jacobi
    const iters = 80;
    for (let it = 0; it < iters; it++) {
      for (let k = 1; k < nz - 1; k++) {
        for (let j = 1; j < ny - 1; j++) {
          for (let i = 1; i < nx - 1; i++) {
            const id = this.I(i, j, k);
            // Use dx≈dy≈dz average for simplicity if nearly isotropic
            const px = p[this.I(i + 1, j, k)] + p[this.I(i - 1, j, k)];
            const py = p[this.I(i, j + 1, k)] + p[this.I(i, j - 1, k)];
            const pz = p[this.I(i, j, k + 1)] + p[this.I(i, j, k - 1)];
            // ∇²p = (p_e+p_w)/dx² + ... - 2p(1/dx²+...) = rhs
            // p = (sum neighbors / h² - rhs) / (2 sum 1/h²)
            const invx = 1 / (dx * dx), invy = 1 / (dy * dy), invz = 1 / (dz * dz);
            p[id] = (
              px * invx + py * invy + pz * invz - div[id]
            ) / (2 * (invx + invy + invz));
          }
        }
      }
      // Neumann dp/dn = 0 on walls (copy)
      for (let k = 0; k < nz; k++) {
        for (let j = 0; j < ny; j++) {
          p[this.I(0, j, k)] = p[this.I(1, j, k)];
          p[this.I(nx - 1, j, k)] = p[this.I(nx - 2, j, k)];
        }
      }
      for (let k = 0; k < nz; k++) {
        for (let i = 0; i < nx; i++) {
          p[this.I(i, 0, k)] = p[this.I(i, 1, k)];
          p[this.I(i, ny - 1, k)] = p[this.I(i, ny - 2, k)];
        }
      }
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          p[this.I(i, j, 0)] = p[this.I(i, j, 1)];
          p[this.I(i, j, nz - 1)] = p[this.I(i, j, nz - 2)];
        }
      }
    }

    // Project
    for (let k = 1; k < nz - 1; k++) {
      for (let j = 1; j < ny - 1; j++) {
        for (let i = 1; i < nx - 1; i++) {
          const id = this.I(i, j, k);
          u[id] = u1[id] - h * (p[this.I(i + 1, j, k)] - p[this.I(i - 1, j, k)]) / (2 * dx);
          v[id] = v1[id] - h * (p[this.I(i, j + 1, k)] - p[this.I(i, j - 1, k)]) / (2 * dy);
          w[id] = w1[id] - h * (p[this.I(i, j, k + 1)] - p[this.I(i, j, k - 1)]) / (2 * dz);
        }
      }
    }
    this.applyVelocityBC();

    // Temperature
    for (let k = 1; k < nz - 1; k++) {
      for (let j = 1; j < ny - 1; j++) {
        for (let i = 1; i < nx - 1; i++) {
          const id = this.I(i, j, k);
          const uu = u[id], vv = v[id], ww = w[id];
          const adv = this._advectScalar(T, i, j, k, uu, vv, ww);
          const lap = this._lap(T, i, j, k);
          let Tn = T[id] + h * (-adv + kappa * lap + this.heatSource(i, j, k));
          if (Tn < 0) Tn = 0;
          if (Tn > 50) Tn = 50;
          T1[id] = Tn;
        }
      }
    }
    for (let k = 0; k < nz; k++) {
      for (let j = 0; j < ny; j++) {
        T1[this.I(0, j, k)] = 0;
        T1[this.I(nx - 1, j, k)] = T1[this.I(nx - 2, j, k)];
      }
    }
    for (let k = 0; k < nz; k++) {
      for (let i = 0; i < nx; i++) {
        T1[this.I(i, 0, k)] = T1[this.I(i, 1, k)] * 0.95;
        T1[this.I(i, ny - 1, k)] = T1[this.I(i, ny - 2, k)] * 0.9;
      }
    }
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        T1[this.I(i, j, 0)] = T1[this.I(i, j, 1)];
        T1[this.I(i, j, nz - 1)] = T1[this.I(i, j, nz - 2)];
      }
    }
    this.T.set(T1);
    return h;
  }

  /** Trilinear sample of (u,v,w,T) at world (x,y,z) */
  sample(x, y, z) {
    const { nx, ny, nz, dx, dy, dz, x0, y0, z0 } = this;
    let fi = (x - x0) / dx;
    let fj = (y - y0) / dy;
    let fk = (z - z0) / dz;
    fi = Math.max(0, Math.min(nx - 1.001, fi));
    fj = Math.max(0, Math.min(ny - 1.001, fj));
    fk = Math.max(0, Math.min(nz - 1.001, fk));
    const i0 = Math.floor(fi), j0 = Math.floor(fj), k0 = Math.floor(fk);
    const i1 = Math.min(nx - 1, i0 + 1);
    const j1 = Math.min(ny - 1, j0 + 1);
    const k1 = Math.min(nz - 1, k0 + 1);
    const sx = fi - i0, sy = fj - j0, sz = fk - k0;
    const lerp = (a, b, t) => a + (b - a) * t;
    const sampleF = (arr) => {
      const c000 = arr[this.I(i0, j0, k0)];
      const c100 = arr[this.I(i1, j0, k0)];
      const c010 = arr[this.I(i0, j1, k0)];
      const c110 = arr[this.I(i1, j1, k0)];
      const c001 = arr[this.I(i0, j0, k1)];
      const c101 = arr[this.I(i1, j0, k1)];
      const c011 = arr[this.I(i0, j1, k1)];
      const c111 = arr[this.I(i1, j1, k1)];
      return lerp(
        lerp(lerp(c000, c100, sx), lerp(c010, c110, sx), sy),
        lerp(lerp(c001, c101, sx), lerp(c011, c111, sx), sy),
        sz
      );
    };
    return {
      u: sampleF(this.u),
      v: sampleF(this.v),
      w: sampleF(this.w),
      T: sampleF(this.T),
    };
  }

  /** Stats: min streamwise velocity near ground (reverse if < 0) */
  reverseStats() {
    const { nx, ny, nz } = this;
    let umin = 0;
    let nRev = 0;
    const jMax = Math.min(6, ny - 1);
    for (let k = 1; k < nz - 1; k++) {
      for (let j = 1; j < jMax; j++) {
        for (let i = 1; i < nx - 1; i++) {
          const uu = this.u[this.I(i, j, k)];
          if (uu < umin) umin = uu;
          if (uu < -0.05) nRev++;
        }
      }
    }
    return { umin, nRev };
  }

  /** Export temperature mid-plane and ground reverse mask for viz */
  sliceYZ(iSlice) {
    // not used
  }
}
