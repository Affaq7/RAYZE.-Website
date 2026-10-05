"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

export interface PreviewData {
  title: string;
  subtitle: string;
  gradient?: string;
  symbol?: string;
  image?: string;
}

interface HoverPreviewProps {
  children: ReactNode;
  preview: PreviewData;
  className?: string;
}

const CARD_W = 260;
const CARD_H = 220;
const EDGE_MARGIN = 20;

export function HoverPreview({
  children,
  preview,
  className = "",
}: HoverPreviewProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const mounted = useMounted();
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  const placeCard = useCallback((clientX: number, clientY: number) => {
    if (typeof window === "undefined") return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = clientX - CARD_W / 2;
    let y = clientY - CARD_H - 16; // above cursor

    // flip below cursor near top of viewport
    if (y < EDGE_MARGIN) {
      y = clientY + 24;
    }

    // clamp horizontally within 20px of screen edges
    x = Math.max(EDGE_MARGIN, Math.min(x, vw - CARD_W - EDGE_MARGIN));
    // clamp vertically
    y = Math.max(EDGE_MARGIN, Math.min(y, vh - CARD_H - EDGE_MARGIN));

    setPos({ x, y });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      placeCard(e.clientX, e.clientY);
    },
    [placeCard]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      placeCard(e.clientX, e.clientY);
      setVisible(true);
    },
    [placeCard]
  );

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    placeCard(rect.left + rect.width / 2, rect.top);
    setVisible(true);
  }, [placeCard]);

  const handleBlur = useCallback(() => {
    setVisible(false);
  }, []);

  // Touch: show for ~2.5 seconds on tap
  const handleTouchStart = useCallback(() => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    placeCard(rect.left + rect.width / 2, rect.top);
    setVisible(true);
    touchTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 2500);
  }, [placeCard]);

  const cardElement = visible && mounted ? (
    <div
      className={`pv ${visible ? "v" : ""}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
      role="tooltip"
      aria-hidden="true"
    >
      <div
        className="art"
        style={{
          background:
            preview.gradient || "linear-gradient(145deg,#e4202c,#5a0a10)",
        }}
      >
        {preview.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.image}
            alt=""
            loading="eager"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <>
            <svg
              viewBox="0 0 600 300"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              aria-hidden="true"
            >
              <ellipse cx="170" cy="150" rx="110" ry="140" />
              <ellipse cx="300" cy="150" rx="110" ry="140" />
              <ellipse cx="430" cy="150" rx="110" ry="140" />
            </svg>
            {preview.symbol && <em className="pv-symbol">{preview.symbol}</em>}
          </>
        )}
      </div>
      <b>{preview.title}</b>
      <span>{preview.subtitle}</span>
    </div>
  ) : null;

  return (
    <>
      <span
        ref={containerRef}
        className={`hl ${className}`}
        tabIndex={0}
        role="button"
        aria-label={`${preview.title}: ${preview.subtitle}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
      >
        {children}
      </span>

      {mounted && typeof document !== "undefined"
        ? createPortal(cardElement, document.body)
        : null}
    </>
  );
}
