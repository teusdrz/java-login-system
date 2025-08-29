import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import '../styles/IntroAnimation.css';

interface IntroAnimationProps {
    onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const circlesRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(onComplete, 500);
            }
        });

        // Set initial states
        gsap.set([logoRef.current, textRef.current, loadingRef.current], {
            opacity: 0,
            scale: 0
        });

        gsap.set('.particle', {
            opacity: 0,
            scale: 0,
            rotation: 0
        });

        gsap.set('.logo-element', {
            pathLength: 0,
            opacity: 0
        });

        gsap.set('.circle-element', {
            scale: 0,
            rotation: 0,
            opacity: 0
        });

        // Background animation
        tl.to(containerRef.current, {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            duration: 0.8,
            ease: 'power2.out'
        })

        // Particles entrance
        .to('.particle', {
            opacity: 1,
            scale: 1,
            rotation: 360,
            duration: 1.2,
            stagger: {
                amount: 0.8,
                from: 'random'
            },
            ease: 'back.out(1.7)'
        }, 0.3)

        // Circles formation
        .to('.circle-element', {
            scale: 1,
            rotation: 180,
            opacity: 0.8,
            duration: 1.5,
            stagger: {
                amount: 1,
                from: 'center'
            },
            ease: 'elastic.out(1, 0.5)'
        }, 0.8)

        // Logo SVG draw animation
        .to('.logo-element', {
            pathLength: 1,
            opacity: 1,
            duration: 2,
            stagger: 0.2,
            ease: 'power2.inOut'
        }, 1.2)

        // Logo container appearance
        .to(logoRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, 1.5)

        // Text reveal
        .to(textRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, 2.2)

        // Loading bar
        .to(loadingRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 2.8)

        // Progress animation
        .to(progressRef.current, {
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: function() {
                const progress = Math.round(this.progress() * 100);
                setLoadingProgress(progress);
            }
        }, 3)

        // Final scale and fade
        .to([logoRef.current, textRef.current, loadingRef.current], {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        }, 4.2)
        
        .to(containerRef.current, {
            opacity: 0,
            scale: 1.2,
            duration: 0.8,
            ease: 'power2.inOut'
        }, 4.5);

        // Continuous particle animation
        gsap.to('.particle', {
            rotation: '+=360',
            duration: 8,
            repeat: -1,
            ease: 'none',
            stagger: {
                amount: 2,
                from: 'random'
            }
        });

        // Continuous circle pulsing
        gsap.to('.circle-element', {
            scale: '+=0.2',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: {
                amount: 1,
                from: 'center'
            }
        });

    }, [onComplete]);

    // Generate particles
    const particles = Array.from({ length: 20 }, (_, i) => (
        <div
            key={i}
            className="particle absolute w-2 h-2 bg-white rounded-full"
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)'
            }}
        />
    ));

    // Generate circles
    const circles = Array.from({ length: 8 }, (_, i) => (
        <div
            key={i}
            className="circle-element absolute border-2 border-white/30 rounded-full"
            style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        />
    ));

    return (
        <div
            ref={containerRef}
            className="intro-container fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 gpu-accelerated"
        >
            {/* Particles */}
            <div ref={particlesRef} className="absolute inset-0">
                {particles}
            </div>

            {/* Background Circles */}
            <div ref={circlesRef} className="absolute inset-0">
                {circles}
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
                {/* Logo */}
                <div ref={logoRef} className="mb-8 logo-glow">
                    <svg
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                        className="mx-auto gpu-accelerated"
                    >
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#667eea" />
                                <stop offset="50%" stopColor="#764ba2" />
                                <stop offset="100%" stopColor="#f093fb" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Outer Circle */}
                        <circle
                            className="logo-element"
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="url(#logoGradient)"
                            strokeWidth="4"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        {/* Inner Geometric Pattern */}
                        <path
                            className="logo-element"
                            d="M 50 100 L 100 50 L 150 100 L 100 150 Z"
                            fill="none"
                            stroke="url(#logoGradient)"
                            strokeWidth="3"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        {/* Central Hexagon */}
                        <path
                            className="logo-element"
                            d="M 100 70 L 120 85 L 120 115 L 100 130 L 80 115 L 80 85 Z"
                            fill="url(#logoGradient)"
                            stroke="white"
                            strokeWidth="2"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        {/* Connecting Lines */}
                        <line
                            className="logo-element"
                            x1="30"
                            y1="100"
                            x2="80"
                            y2="100"
                            stroke="url(#logoGradient)"
                            strokeWidth="2"
                            filter="url(#glow)"
                            pathLength="1"
                        />
                        <line
                            className="logo-element"
                            x1="120"
                            y1="100"
                            x2="170"
                            y2="100"
                            stroke="url(#logoGradient)"
                            strokeWidth="2"
                            filter="url(#glow)"
                            pathLength="1"
                        />
                        <line
                            className="logo-element"
                            x1="100"
                            y1="30"
                            x2="100"
                            y2="70"
                            stroke="url(#logoGradient)"
                            strokeWidth="2"
                            filter="url(#glow)"
                            pathLength="1"
                        />
                        <line
                            className="logo-element"
                            x1="100"
                            y1="130"
                            x2="100"
                            y2="170"
                            stroke="url(#logoGradient)"
                            strokeWidth="2"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        {/* Corner Elements */}
                        <circle
                            className="logo-element"
                            cx="50"
                            cy="50"
                            r="8"
                            fill="url(#logoGradient)"
                            filter="url(#glow)"
                            pathLength="1"
                        />
                        <circle
                            className="logo-element"
                            cx="150"
                            cy="50"
                            r="8"
                            fill="url(#logoGradient)"
                            filter="url(#glow)"
                            pathLength="1"
                        />
                        <circle
                            className="logo-element"
                            cx="150"
                            cy="150"
                            r="8"
                            fill="url(#logoGradient)"
                            filter="url(#glow)"
                            pathLength="1"
                        />
                        <circle
                            className="logo-element"
                            cx="50"
                            cy="150"
                            r="8"
                            fill="url(#logoGradient)"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        {/* Central "E" for Enterprise */}
                        <text
                            className="logo-element"
                            x="100"
                            y="110"
                            textAnchor="middle"
                            fill="white"
                            fontSize="24"
                            fontWeight="bold"
                            fontFamily="Arial, sans-serif"
                            filter="url(#glow)"
                        >
                            E
                        </text>
                    </svg>
                </div>

                {/* Text */}
                <div ref={textRef} className="mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider text-glow gradient-text">
                        ENTERPRISE
                    </h1>
                    <h2 className="text-xl md:text-2xl text-white/80 font-light tracking-widest text-glow">
                        BUSINESS MANAGEMENT SYSTEM
                    </h2>
                </div>

                {/* Loading */}
                <div ref={loadingRef} className="w-80 max-w-full mx-auto">
                    <div className="mb-4">
                        <span className="text-white/90 text-lg font-medium text-glow">
                            Loading... {loadingProgress}%
                        </span>
                    </div>
                    <div className="loading-container w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                            ref={progressRef}
                            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-300 progress-glow"
                            style={{ 
                                width: '0%',
                                boxShadow: '0 0 20px rgba(255,255,255,0.5)'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Additional floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 15 }, (_, i) => (
                    <div
                        key={`float-${i}`}
                        className="floating-element absolute w-1 h-1 bg-white/60 rounded-full pulse-glow"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 3}s`
                        }}
                    />
                ))}
                
                {/* Additional geometric shapes */}
                {Array.from({ length: 5 }, (_, i) => (
                    <div
                        key={`geo-${i}`}
                        className="absolute border border-white/20 floating-element"
                        style={{
                            left: `${Math.random() * 90}%`,
                            top: `${Math.random() * 90}%`,
                            width: `${20 + Math.random() * 30}px`,
                            height: `${20 + Math.random() * 30}px`,
                            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${4 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default IntroAnimation;
