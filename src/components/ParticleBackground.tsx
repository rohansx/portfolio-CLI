import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface ParticleBackgroundProps {
  variant?: "default" | "matrix" | "stars" | "connections";
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ variant = "default" }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(() => {
    const baseConfig: ISourceOptions = {
      fullScreen: {
        enable: true,
        zIndex: -1,
      },
      fpsLimit: 60,
      detectRetina: true,
    };

    switch (variant) {
      case "matrix":
        return {
          ...baseConfig,
          particles: {
            number: { value: 100, density: { enable: true } },
            color: { value: "#00ff00" },
            shape: { type: "char", options: { char: { value: ["0", "1", "ア", "イ", "ウ", "エ", "オ"] } } },
            opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 1, sync: false } },
            size: { value: { min: 8, max: 14 } },
            move: {
              enable: true,
              direction: "bottom" as const,
              speed: { min: 2, max: 6 },
              straight: true,
              outModes: { default: "out" as const },
            },
          },
          background: { color: "transparent" },
        };

      case "stars":
        return {
          ...baseConfig,
          particles: {
            number: { value: 80, density: { enable: true } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: { min: 0.1, max: 0.6 }, animation: { enable: true, speed: 0.5, sync: false } },
            size: { value: { min: 1, max: 3 } },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none" as const,
              random: true,
              outModes: { default: "bounce" as const },
            },
          },
          background: { color: "transparent" },
        };

      case "connections":
        return {
          ...baseConfig,
          particles: {
            number: { value: 60, density: { enable: true } },
            color: { value: "#14b8a6" },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: { min: 1, max: 3 } },
            links: {
              enable: true,
              distance: 150,
              color: "#14b8a6",
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none" as const,
              random: false,
              outModes: { default: "bounce" as const },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
            },
            modes: {
              grab: { distance: 140, links: { opacity: 0.5 } },
            },
          },
          background: { color: "transparent" },
        };

      default:
        // Subtle floating particles
        return {
          ...baseConfig,
          particles: {
            number: { value: 50, density: { enable: true } },
            color: { value: "#14b8a6" },
            shape: { type: "circle" },
            opacity: { value: { min: 0.1, max: 0.3 } },
            size: { value: { min: 1, max: 2 } },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none" as const,
              random: true,
              outModes: { default: "out" as const },
            },
          },
          background: { color: "transparent" },
        };
    }
  }, [variant]);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
    />
  );
};

export default ParticleBackground;
