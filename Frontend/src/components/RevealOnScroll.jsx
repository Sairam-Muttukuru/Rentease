import React, { useEffect, useRef, useState, Children, cloneElement } from "react";

/** PURE FADE-IN on scroll (no movement, no scale) */
const RevealOnScroll = ({
  children,
  className = "",
  delay = 0,
  duration = 800,
  threshold = 0.18,
  stagger = 0,
  once = true,
  rootMargin = "0px 0px -10% 0px",
  style = {},
  ...rest
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const childArray = Children.toArray(children);

  return (
    <div ref={ref} className={className} style={style} {...rest}>
      {childArray.map((child, i) => {
        const childDelay = delay + i * stagger;
        return (
          <div
            key={i}
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity ${duration}ms ease-out ${childDelay}ms`,
              willChange: "opacity",
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