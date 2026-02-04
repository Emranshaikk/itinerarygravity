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
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            {/* Flying Plane */}
            <motion.div
                initial={{ x: -100, y: windowSize.height * 0.2, opacity: 0 }}
                animate={{
                    x: windowSize.width + 100,
                    y: [windowSize.height * 0.2, windowSize.height * 0.1, windowSize.height * 0.3],
                    opacity: [0, 1, 1, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2,
                }}
                className="absolute text-gray-700/20 dark:text-gray-500/20"
            >
                <Plane size={48} className="transform rotate-90" />
            </motion.div>

            {/* Second Plane (slower, lower) */}
            <motion.div
                initial={{ x: windowSize.width + 100, y: windowSize.height * 0.6, rotate: 180, opacity: 0 }}
                animate={{
                    x: -100,
                    y: [windowSize.height * 0.6, windowSize.height * 0.7, windowSize.height * 0.5],
                    opacity: [0, 1, 1, 0],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 10,
                }}
                className="absolute text-gray-700/10 dark:text-gray-500/10"
            >
                <Plane size={32} />
            </motion.div>

            {/* Falling Stars / Shooting Stars */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * windowSize.width,
                        y: -20,
                        opacity: 0,
                        scale: 0.5,
                    }}
                    animate={{
                        x: Math.random() * windowSize.width, // varied ending x for diagonal effect
                        y: windowSize.height + 50,
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "easeIn",
                    }}
                    className="absolute text-yellow-500/30"
                >
                    <Star size={16} fill="currentColor" />
                </motion.div>
            ))}

            {/* Twinkling Static Stars */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={`static-${i}`}
                    initial={{
                        x: Math.random() * windowSize.width,
                        y: Math.random() * windowSize.height,
                        opacity: 0.1,
                        scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                    className="absolute text-white/20"
                >
                    <div className="w-1 h-1 bg-current rounded-full" />
                </motion.div>
            ))}
        </div>
    );
}
