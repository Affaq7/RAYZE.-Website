"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * GLSL Vertex Shader
 * Standard full-screen quad rendering.
 */
export const liquidPlasmaVertexShader = /* glsl */ `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/**
 * GLSL Fragment Shader for Three.js / WebGL
 *
 * Primary palette:
 * - Vibrant Red: #fc1906 -> vec3(0.988, 0.098, 0.024)
 * - Deep Crimson: #dd0500 -> vec3(0.867, 0.020, 0.000)
 * - Pure Black: #000000 -> vec3(0.0)
 *
 * Techniques:
 * - 2D Simplex Noise + Octave Fractional Brownian Motion (fBm)
 * - Multi-stage Inigo Quilez Domain Warping
 * - Normal map calculation & directional lighting for liquid specular highlights
 * - High-contrast rim/fresnel glow & edge vignette
 */
export const liquidPlasmaFragmentShader = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_speed;
  uniform float u_intensity;
  uniform float u_grain;

  varying vec2 vUv;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Stretched space for elegant vertical drapery folds
    vec2 pos = p * vec2(0.95, 0.65);

    // Smooth continuous time
    float t = u_time * u_speed * 0.45;

    // Interactive mouse displacement (subtle and smooth)
    vec2 mouse = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 mDelta = pos - mouse * vec2(0.95, 0.65);
    float mDist = length(mDelta);
    pos += (mDelta / (mDist + 0.1)) * exp(-mDist * 2.2) * 0.28;

    // -----------------------------------------------------------------
    // Simplest Pure Plasma Waves (Interconnected trigonometric harmonics)
    // -----------------------------------------------------------------
    // Wave 1: Undulating vertical flowing wave
    float v1 = sin(pos.x * 2.5 + t * 0.75);

    // Wave 2: Cross drapery harmonic modulated by Wave 1
    float v2 = sin(pos.y * 3.2 - t * 0.65 + v1 * 1.5);

    // Wave 3: Diagonal undulating silk fold
    float v3 = cos(pos.x * 1.8 + pos.y * 1.6 + v2 * 1.6 + t * 0.55);

    // Wave 4: Radial billowing pulse
    float v4 = sin(length(pos * vec2(0.85, 1.25) + vec2(v1, v2) * 0.4) * 2.8 - t * 0.6);

    // Composite plasma value normalized between -1.0 and 1.0
    float plasma = (v1 + v2 + v3 + v4) * 0.25;

    // Smooth volumetric contrast shaping: deep valleys and luminous crests
    float val = smoothstep(-0.52, 0.68, plasma);
    val = pow(val, 1.25);

    // -----------------------------------------------------------------
    // Color Palette matching the velvet red reference image
    // Pure Black -> Deep Wine -> Rich Crimson -> Radiant Scarlet -> Silk Sheen
    // -----------------------------------------------------------------
    const vec3 cVoid     = vec3(0.000, 0.000, 0.000); // Pure black
    const vec3 cWine     = vec3(0.380, 0.015, 0.045); // Deep wine undertone
    const vec3 cCrimson  = vec3(0.720, 0.045, 0.090); // Rich velvet crimson
    const vec3 cScarlet  = vec3(0.960, 0.090, 0.135); // Vibrant luxury scarlet
    const vec3 cCrest    = vec3(1.000, 0.180, 0.210); // Glowing crest highlight
    const vec3 cSheen    = vec3(1.000, 0.340, 0.360); // Luminous silk sheen

    // Multi-stage velvety color mixing
    vec3 color = cVoid;
    color = mix(color, cWine, smoothstep(0.04, 0.28, val));
    color = mix(color, cCrimson, smoothstep(0.18, 0.46, val));
    color = mix(color, cScarlet, smoothstep(0.36, 0.68, val));
    color = mix(color, cCrest, smoothstep(0.56, 0.86, val));

    // Silk crest sheen highlight
    float sheen = pow(clamp((val - 0.60) / 0.40, 0.0, 1.0), 2.2);
    color += cSheen * sheen * 0.70;

    // Intensity scale
    color *= u_intensity;

    // Subtle edge border softening
    vec2 borderFade = smoothstep(vec2(0.0), vec2(0.04), uv) * smoothstep(vec2(1.0), vec2(0.96), uv);
    color *= borderFade.x * borderFade.y;

    // Tactile 35mm film grain texture (matching reference image)
    vec2 grainCoord = uv * u_resolution.xy;
    float n1 = fract(sin(dot(grainCoord + fract(u_time * 0.05), vec2(12.9898, 78.233))) * 43758.5453);
    float n2 = fract(sin(dot(grainCoord * 1.5 - fract(u_time * 0.07), vec2(26.431, 41.879))) * 28453.6127);
    float grain = ((n1 + n2) * 0.5 - 0.5) * u_grain;
    color += grain;
    color = max(vec3(0.0), color);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface LiquidPlasmaCanvasProps
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  /** Animation speed multiplier (default: 1.0) */
  speed?: number;
  /** Glow and color intensity multiplier (default: 1.0) */
  intensity?: number;
  /** Whether mouse movement causes fluid ripples (default: true) */
  interactive?: boolean;
  /** Tactile 35mm film grain amount (default: 0.045) */
  grain?: number;
}

/**
 * High-performance, zero-dependency WebGL Liquid Plasma Hero Background
 *
 * Renders full hardware-accelerated 60fps dynamic fluid plasma
 * using primary colors #fc1906 and #dd0500 on a pure black background.
 */
export function LiquidPlasmaCanvas({
  speed = 1.0,
  intensity = 1.0,
  interactive = true,
  grain = 0.045,
  className,
  ...props
}: LiquidPlasmaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL context
    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL not supported on this device.");
      return;
    }

    // Helper: compile shader
    function createShader(
      ctx: WebGLRenderingContext,
      type: number,
      source: string
    ): WebGLShader | null {
      const shader = ctx.createShader(type);
      if (!shader) return null;
      ctx.shaderSource(shader, source);
      ctx.compileShader(shader);
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error(ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, liquidPlasmaVertexShader);
    const fragShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      liquidPlasmaFragmentShader
    );
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry (2 triangles covering -1 to 1)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const posLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uSpeedLoc = gl.getUniformLocation(program, "u_speed");
    const uIntensityLoc = gl.getUniformLocation(program, "u_intensity");
    const uGrainLoc = gl.getUniformLocation(program, "u_grain");

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseInitialized = false;

    // Handle canvas resizing with DPR clamping for high performance
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      const newWidth = Math.floor(width * dpr);
      const newHeight = Math.floor(height * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      if (!mouseInitialized) {
        mouseX = canvas.width * 0.5;
        mouseY = canvas.height * 0.5;
        targetMouseX = mouseX;
        targetMouseY = mouseY;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvas);
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      targetMouseX = (e.clientX - rect.left) * dpr;
      targetMouseY = (rect.bottom - e.clientY) * dpr;
      mouseInitialized = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Render loop with battery & offscreen optimization
    let animationFrameId: number;
    let isVisible = true;
    const startTime = performance.now();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const render = () => {
      if (isVisible) {
        const currentTime = (performance.now() - startTime) * 0.001;

        // Smooth mouse lerping
        mouseX += (targetMouseX - mouseX) * 0.06;
        mouseY += (targetMouseY - mouseY) * 0.06;

        gl.useProgram(program);
        gl.uniform1f(uTimeLoc, currentTime);
        gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
        gl.uniform2f(uMouseLoc, mouseX, mouseY);
        gl.uniform1f(uSpeedLoc, speed);
        gl.uniform1f(uIntensityLoc, intensity);
        gl.uniform1f(uGrainLoc, grain);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (program) {
        gl.deleteProgram(program);
      }
      if (vertShader) gl.deleteShader(vertShader);
      if (fragShader) gl.deleteShader(fragShader);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
    };
  }, [speed, intensity, interactive, grain]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    />
  );
}

export default LiquidPlasmaCanvas;
