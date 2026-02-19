import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";

// fallback placeholder when an image can't load
const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'><rect width='100%' height='100%' fill='%23e9eef2'/><text x='50%' y='50%' fill='%238a8f95' font-size='28' font-family='Arial' dominant-baseline='middle' text-anchor='middle'>Image unavailable</text></svg>`
  );

/* RevealOnScroll */
export const RevealOnScroll = ({ children, delay = 0, width = "100%" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "60px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ width, transitionDelay: `${delay}ms` }}
      className={`transition-all duration-900 ease-out transform ${isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"
        }`}
    >
      {children}
    </div>
  );
};

/* ImageSlider */
const ImageSlider = ({ images = [], autoplay = true, interval = 3600 }) => {
  // clone first & last for infinite loop behavior when >1 image
  const slides = images.length > 1 ? [images[images.length - 1], ...images, images[0]] : images;

  // start at 1 when we have clones, otherwise start at 0
  const initialIndex = images.length > 1 ? 1 : 0;
  const [index, setIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoplayRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // track failed loads
  const [failed, setFailed] = useState(() => new Array(slides.length).fill(false));

  // autoplay
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isPaused) setIndex((i) => i + 1);
    }, interval);
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, isPaused, interval, images.length]);

  // re-enable transitions
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setTimeout(() => setIsTransitioning(true), 30);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // handle teleport jumps
  const handleTransitionEnd = () => {
    if (images.length <= 1) return;
    if (index >= slides.length - 1) {
      setIsTransitioning(false);
      setIndex(1);
    } else if (index <= 0) {
      setIsTransitioning(false);
      setIndex(slides.length - 2);
    }
  };

  const goTo = (i) => {
    setIsTransitioning(true);
    setIndex(i);
  };
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  // keyboard once
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const onImgError = (slideIdx) =>
    setFailed((prev) => {
      const copy = [...prev];
      copy[slideIdx] = true;
      return copy;
    });

  const trackWidth = `${slides.length * 100}%`;
  const trackTransform = `translateX(-${(index * 100) / slides.length}%)`;

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex h-full ${isTransitioning ? "transition-transform duration-700 ease-[cubic-bezier(.16,.84,.24,1)]" : ""}`}
        style={{ width: trackWidth, transform: trackTransform }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((src, i) => {
          const realSrc = failed[i] ? PLACEHOLDER : src;
          const slideWidth = `${100 / slides.length}%`;
          return (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center h-full"
              style={{ width: slideWidth }}
            >
              <img
                src={realSrc}
                alt={`preview-${i}`}
                loading="lazy"
                onError={() => onImgError(i)}
                className="max-w-full max-h-full object-contain block rounded-md"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 900);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md hover:scale-105 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 900);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md hover:scale-105 transition-transform"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        </>
      )}

      {/* dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {images.map((_, i) => {
            const realIndex = i + 1;
            const isActive =
              index === realIndex ||
              (index === 0 && realIndex === images.length) ||
              (index === slides.length - 1 && realIndex === 1);
            return (
              <button
                key={i}
                onClick={() => goTo(realIndex)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${isActive ? "bg-indigo-600 scale-110" : "bg-slate-300"}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const images = [image1, image2, image3, image4, image5];
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      setUserRole(user.role);
    }
  }, []);

  const handleListProperty = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (user) {
      const slug = user.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'user';
      if (user.role === 'LANDLORD') {
        navigate(`/${slug}/landlord/dashboard/add-property`);
      } else if (user.role === 'TENANT') {
        navigate(`/${slug}/tenant/dashboard`);
      }
    } else {
      toast.info("To list a property, please sign up as a Landlord.");
      navigate('/signup');
    }
  };

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <RevealOnScroll delay={200}>
          <div className="relative w-40 h-40 md:w-64 md:h-64 mx-auto mb-6 group">
            <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-3xl group-hover:bg-indigo-500/50 transition-all duration-700"></div>
            <img
              src="/favicon.png"
              alt="RentEase Logo"
              className="relative w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
          <h1 className="text-5xl md:text-7xl dark:text-slate-200 font-extrabold tracking-tight mb-4 leading-tight text-slate-900">
            Rental Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Reimagined.</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            The all-in-one platform connecting Tenants, Landlords, and Admins.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={600}>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate("/browse/properties")}
              className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold dark:text-slate-200 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 shadow-[0_12px_28px_-6px_rgba(79,70,229,0.55)] hover:shadow-[0_16px_36px_-6px_rgba(79,70,229,0.70)] hover:-translate-y-0.5 transition-all duration-300 text-slate-900"
            >
              Browse Properties
            </button>

            <button
              onClick={handleListProperty}
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-950 rounded-full bg-slate-900/55 ring-1 ring-indigo-600/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_8px_24px_rgba(2,6,23,0.45)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_12px_34px_rgba(2,6,23,0.55)] hover:-translate-y-0.5 transition-all duration-300 dark:text-slate-300"
            >
              {userRole === 'TENANT' ? 'Go to Dashboard' : 'List Your Property'}
            </button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={800}>
          <div className="mt-12 relative max-w-5xl mx-auto rounded-2xl p-0 bg-gradient-to-b from-slate-200 to-transparent">
            <div className="bg-slate-100 rounded-xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/9] flex items-center justify-center relative group">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-grid-slate-200" />
              <div className="relative z-10 w-full h-full">
                <ImageSlider images={images} autoplay interval={3600} />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default Hero;
