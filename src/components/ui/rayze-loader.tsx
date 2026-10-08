"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function RayzeLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !rootRef.current) return;

    const MIN_SECONDS = 3.4;
    const canvas = canvasRef.current;
    const bar = barRef.current;
    const root = rootRef.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      // WebGL unsupported fallback
      setIsDone(true);
      setTimeout(() => setIsRemoved(true), 500);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 11;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const outBack = (x: number) => {
      const c = 1.3;
      return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
    };
    const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    // Lights: soft white + Rayze crimson accent
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(2, 4, 6);
    scene.add(keyLight);

    const redLight = new THREE.PointLight(0xff2a00, 3, 26);
    redLight.position.set(-6, -3, 4);
    scene.add(redLight);

    // Faint red glow behind the logo
    const gc = document.createElement("canvas");
    gc.width = gc.height = 128;
    const gx = gc.getContext("2d");
    let haloTexture: THREE.CanvasTexture | null = null;
    let halo: THREE.Sprite | null = null;

    if (gx) {
      const gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, "rgba(255, 60, 20, 0.55)");
      gr.addColorStop(1, "rgba(255, 30, 0, 0)");
      gx.fillStyle = gr;
      gx.fillRect(0, 0, 128, 128);
      haloTexture = new THREE.CanvasTexture(gc);
      halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: haloTexture,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      halo.scale.set(10, 10, 1);
      halo.position.z = -2;
      scene.add(halo);
    }

    // Logo = 4 pieces traced from the RAYZE angular R artwork
    const S = 110;
    const CX = 544;
    const CY = 532;
    const DEPTH = 0.5;

    const shapesData = [
      [
        [302, 293],
        [627, 293],
        [627, 447],
        [455, 447],
      ],
      [
        [627, 293],
        [786, 293],
        [786, 468],
        [633, 625],
        [624, 615],
        [627, 447],
      ],
      [
        [456, 449],
        [297, 605],
        [392, 605],
        [456, 669],
      ],
      [
        [456, 449],
        [456, 669],
        [557, 771],
        [778, 771],
      ],
    ];

    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
      emissive: 0x180400,
    });

    const logo = new THREE.Group();
    scene.add(logo);

    const parts = shapesData.map((p, i) => {
      const shape = new THREE.Shape(
        p.map(([x, y]) => new THREE.Vector2((x - CX) / S, (CY - y) / S))
      );
      const geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
      geo.translate(0, 0, -DEPTH / 2);
      const mesh = new THREE.Mesh(geo, mat);
      logo.add(mesh);
      const a = i * 1.9 + 0.5;
      return {
        mesh,
        geo,
        delay: 0.2 + i * 0.22,
        from: new THREE.Vector3(Math.cos(a) * 8, Math.sin(a * 1.3) * 5.5, -6 - i),
        spin: new THREE.Vector3(3 + i, -4 + i, 2.5 - i),
      };
    });

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 1 ? (11 / Math.max(w / h, 0.55)) * 0.8 : 11;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resize);
    resize();

    let exitAt: number | null = null;
    let over = false;
    let animId: number;
    const t0 = performance.now();

    function finish() {
      if (over) return;
      over = true;
      setIsDone(true);
      document.dispatchEvent(new CustomEvent("rayze:loaded"));
      document.body.style.overflow = "";

      setTimeout(() => {
        setIsRemoved(true);
        // Clean up Three.js scene & GPU memory
        parts.forEach((p) => p.geo.dispose());
        mat.dispose();
        if (haloTexture) haloTexture.dispose();
        if (halo) halo.material.dispose();
        renderer.dispose();
      }, 900);
    }

    function frame(ts: number) {
      if (over) return;
      const t = (ts - t0) / 1000;

      // 1) Pieces fly in and lock together
      parts.forEach((p) => {
        const k = clamp((t - p.delay) / 1.2);
        const m = 1 - outBack(k);
        p.mesh.position.copy(p.from).multiplyScalar(m);
        p.mesh.rotation.set(p.spin.x * m, p.spin.y * m, p.spin.z * m);
        p.mesh.scale.setScalar(Math.max(0.0001, clamp(k * 2)));
      });

      // 2) Smooth 3D turn once assembled
      logo.rotation.y = inOut(clamp((t - 2) / 1.3)) * Math.PI * 2;
      if (halo) {
        halo.material.opacity = clamp((t - 1.6) / 1.2) * 0.6;
      }

      // 3) Exit when minimum time passed
      if (exitAt === null && t >= MIN_SECONDS) {
        exitAt = t;
      }

      let x = 0;
      if (exitAt !== null) {
        x = clamp((t - exitAt) / 0.7);
        logo.scale.setScalar(1 + x * x * 0.6);
      }

      if (bar) {
        bar.style.width =
          (exitAt !== null ? 100 : Math.min(95, (t / MIN_SECONDS) * 95)) + "%";
      }

      renderer.render(scene, camera);

      if (exitAt !== null && x >= 1) {
        return finish();
      }

      animId = requestAnimationFrame(frame);
    }

    document.body.style.overflow = "hidden";
    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = "";
      parts.forEach((p) => p.geo.dispose());
      mat.dispose();
      if (haloTexture) haloTexture.dispose();
      if (halo) halo.material.dispose();
      renderer.dispose();
    };
  }, []);

  if (isRemoved) return null;

  return (
    <div
      id="rayze-loader"
      ref={rootRef}
      className={isDone ? "done" : ""}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#000000",
        transition: "opacity 0.8s ease, visibility 0.8s ease",
        opacity: isDone ? 0 : 1,
        visibility: isDone ? "hidden" : "visible",
        pointerEvents: isDone ? "none" : "auto",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <div
        className="line"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "10vh",
          width: "120px",
          height: "2px",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.12)",
          overflow: "hidden",
        }}
      >
        <i
          ref={barRef}
          style={{
            display: "block",
            height: "100%",
            width: "0%",
            background: "#ff2a00",
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}

export default RayzeLoader;
