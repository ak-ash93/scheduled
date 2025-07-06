// src/components/AnimatedWrapper.tsx
"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);
  return <div ref={ref}>{children}</div>;
}
