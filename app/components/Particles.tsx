"use client";

import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine, Container } from "tsparticles-engine";

const ParticlesComponent = () => {
  const [mounted, setMounted] = useState(false);

  // Only run on client side to prevent SSR issues
  useEffect(() => {
    setMounted(true);
    return () => {
      // Clean up any potential memory leaks
      setMounted(false);
    };
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log("Initializing tsParticles");
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Particles loaded successfully");
  }, []);

  // Don't render during SSR
  if (!mounted) return null;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          enable: false,
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
              parallax: {
                enable: true,
                force: 60,
                smooth: 10,
              },
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 150,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#4299e1", "#805ad5", "#d53f8c"],
          },
          links: {
            color: {
              value: "#4299e1",
            },
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.5,
            straight: false,
            attract: {
              enable: true,
              rotate: {
                x: 600,
                y: 1200,
              },
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60,
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          shape: {
            type: ["circle", "triangle", "polygon"],
            polygon: {
              nb_sides: 6,
            },
          },
          size: {
            value: { min: 1, max: 4 },
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false,
            },
          },
          twinkle: {
            lines: {
              enable: true,
              frequency: 0.005,
              color: {
                value: "#9f7aea",
              },
              opacity: 0.5,
            },
            particles: {
              enable: true,
              frequency: 0.05,
              color: {
                value: ["#4299e1", "#805ad5"],
              },
              opacity: 1,
            },
          },
        },
        background: {
          color: {
            value: "transparent",
          },
        },
        detectRetina: true,
        responsive: [
          {
            maxWidth: 768,
            options: {
              particles: {
                number: {
                  value: 30,
                },
              },
            },
          },
        ],
      }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default ParticlesComponent;