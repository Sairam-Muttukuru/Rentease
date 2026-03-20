import React, { useEffect, useRef, useState, Children, cloneElement } from "react";

/** ANIMATED REVEAL on scroll (fade, scale, and slide) with robust mobile fallbacks */
const RevealOnScroll = ({
  children,
  className = "",
  delay = 0,
  duration = 800,
  threshold = 0.01,   // Trigger on minimal intersection
  distance = 20,     // Reduced vertical offset for reliability
  scale = 0.98,      // Subtle scale
  stagger = 0,
  once = true,
  rootMargin = "100px 0px 100px 0px", // Trigger 100px before and after for safety
  style = {},
  ...rest
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1. Check for reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    // 2. Mobile Bypass: If it's a small screen, trigger faster or just show it
    if (window.innerWidth < 768) {
      // Small delay just to allow layout to settle
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }

    // 3. Fallback: If intersection observer fails, show after 2s regardless
    const failSafeTimer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            clearTimeout(failSafeTimer);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(failSafeTimer);
    };
  }, [threshold, rootMargin, once]);

  const childArray = Children.toArray(children);

  return (
    <div ref={ref} className={`${className} min-h-[1px]`} style={style} {...rest}>
      {childArray.map((child, i) => {
        const childDelay = delay + i * stagger;
        return (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              filter: visible ? "blur(0px)" : "blur(4px)",
              transform: visible 
                ? "translateY(0) scale(1)" 
                : `translateY(${distance}px) scale(${scale})`,
              transition: `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}ms ease-out`,
              transitionDelay: `${childDelay}ms`,
              willChange: "opacity, transform, filter",
            }}
          >
            {cloneElement(child)}
          </div>
        );
      })}
    </div>
  );
};

export default RevealOnScroll;