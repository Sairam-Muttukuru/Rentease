import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-500 ${theme === "dark" ? "bg-slate-950" : "bg-white"
        }`}
    >
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
