"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Star } from "lucide-react";

export default function BackgroundAnimation() {
    const [mounted, setMounted] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setMounted(true);
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: -1,
            overflow: 'hidden'
        }}>
            {/* Falling Stars / Shooting Stars */}
            {mounted && [...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * windowSize.width,
                        y: -50,
                        opacity: 0,
                    }}
                    animate={{
                        x: (Math.random() - 0.5) * 200 + (Math.random() * windowSize.width),
                        y: windowSize.height + 100,
                        opacity: [0, 0.4, 0],
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 15,
                        ease: "linear",
                    }}
                    style={{ position: 'absolute', color: 'rgba(255, 255, 255, 0.2)' }}
                >
                    <Star size={12} fill="currentColor" />
                </motion.div>
            ))}

            {/* Twinkling Static Stars */}
            {mounted && [...Array(20)].map((_, i) => (
                <motion.div
                    key={`static-${i}`}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: 0.1,
                        color: 'white'
                    }}
                    animate={{
                        opacity: [0.05, 0.2, 0.05],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 4 + Math.random() * 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                >
                    <div style={{ width: '2px', height: '2px', background: 'currentColor', borderRadius: '50%' }} />
                </motion.div>
            ))}
        </div>
    );
}
