import React, { useCallback } from "react";
import Snowfall from 'react-snowfall';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-500 ${theme === "dark" ? "bg-slate-950" : "bg-white"
        }`}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="dark-snow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }} // Slow 2s fade
          >
            <Snowfall
              style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                zIndex: 10,
              }}
              snowflakeCount={100} // Slightly fewer for better focus
              color="#ffffff"
              speed={[0.2, 0.8]}   // Cinematic slow speed
              wind={[-0.5, 1.0]}    // Gentle swaying
              radius={[0.5, 3.0]}   // Varied sizes
            />
          </motion.div>
        ) : (
          <motion.div
            key="light-particles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }} // Slow 2s fade
          >
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={{
                fullScreen: { enable: true, zIndex: 10 },
                particles: {
                  number: { value: 60, density: { enable: true, area: 800 } },
                  color: { value: "#6366f1" },
                  shape: { type: "circle" },
                  opacity: { value: 0.5 },
                  size: { value: { min: 1, max: 4 } },
                  move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { default: "out" },
                  },
                  links: {
                    enable: true,
                    distance: 150,
                    color: "#6366f1",
                    opacity: 0.2,
                    width: 1,
                  },
                },
                interactivity: {
                  events: {
                    onHover: { enable: true, mode: "grab" },
                    onClick: { enable: true, mode: "push" },
                  },
                  modes: {
                    grab: { distance: 140, links: { opacity: 0.5 } },
                    push: { quantity: 4 },
                  },
                },
                background: { color: "transparent" },
                detectRetina: true,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* NAVBAR - Render directly so fixed positioning and interactions work correctly */}
      <Navbar />

      {/* HERO - luxurious pop (slightly later) */}
      <RevealOnScroll
        delay={120}
        duration={1000}   // slower duration for cinematic feel
        distance={50}     // a bit more vertical travel
        scale={0.985}     // tiny pop
        threshold={0.18}
        className="w-full"
      >
        <Hero />
      </RevealOnScroll>



      {/* SECTIONS - cascade the grids with a comfortable stagger */}
      <RevealOnScroll
        delay={60}
        duration={900}
        distance={40}
        scale={0.992}
        threshold={0.20}
        stagger={100}     // 100ms between each child
        className="w-full"
      >
        <Sections />
      </RevealOnScroll>



      {/* FOOTER - gentle slide up */}
      <RevealOnScroll
        delay={40}
        duration={850}
        distance={30}
        scale={0.995}
        threshold={0.25}
        className="w-full"
      >
        <Footer />
      </RevealOnScroll>



    </div>
  );
};

export default LandingPage;
