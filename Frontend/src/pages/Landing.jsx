import React from "react";
import Snowfall from 'react-snowfall';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-500 ${theme === "dark" ? "bg-slate-950" : "bg-white"
        }`}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' && (
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
        className="w-full"
      >
        <Hero />
      </RevealOnScroll>



      {/* SECTIONS - cascade the grids with a comfortable stagger */}
      <Sections />



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
