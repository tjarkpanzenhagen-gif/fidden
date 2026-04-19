"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const curRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch/pointer-coarse devices (mobile, tablet)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (curRef.current) {
        curRef.current.style.left = mx + "px";
        curRef.current.style.top  = my + "px";
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top  = ry + "px";
      }
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    const hoverEls = document.querySelectorAll<HTMLElement>(
      "a, button, .gig, .g-item, input, select, textarea"
    );
    const add    = () => { curRef.current?.classList.add("hovered"); ringRef.current?.classList.add("hovered"); };
    const remove = () => { curRef.current?.classList.remove("hovered"); ringRef.current?.classList.remove("hovered"); };
    hoverEls.forEach(el => { el.addEventListener("mouseenter", add); el.addEventListener("mouseleave", remove); });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      hoverEls.forEach(el => { el.removeEventListener("mouseenter", add); el.removeEventListener("mouseleave", remove); });
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={curRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
