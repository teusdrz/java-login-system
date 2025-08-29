import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import '../styles/IntroAnimationProfessional.css';

interface IntroAnimationProfessionalProps {
    onComplete: () => void;
}

const IntroAnimationProfessional: React.FC<IntroAnimationProfessionalProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const neuralNetworkRef = useRef<HTMLDivElement>(null);
    const dataFlowRef = useRef<HTMLDivElement>(null);
    const hologramRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState('initializing');

    // Create advanced neural network particles
    const createNeuralParticles = () => {
        const particles = [];
        const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

        for (let i = 0; i < 60; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(
                <div
                    key={`neural-${i}`}
                    className="neural-particle absolute rounded-full opacity-0"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        backgroundColor: color,
                        boxShadow: `0 0 ${Math.random() * 20 + 10}px ${color}80`
                    }}
                />
            );
        }
        return particles;
    };

    // Create data streams
    const createDataStreams = () => {
        const streams = [];

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const length = Math.random() * 200 + 100;

            streams.push(
                <div
                    key={`stream-${i}`}
                    className="data-stream absolute opacity-0"
                    style={{
                        left: '50%',
                        top: '50%',
                        width: `${length}px`,
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, #3b82f6, transparent)`,
                        transform: `rotate(${angle}rad) translateX(-50%)`,
                        transformOrigin: '0 50%'
                    }}
                />
            );
        }
        return streams;
    };

    // Create holographic grid
    const createHolographicGrid = () => {
        const lines = [];

        // Vertical lines
        for (let i = 0; i <= 20; i++) {
            lines.push(
                <line
                    key={`v-${i}`}
                    className="grid-line"
                    x1={`${(i / 20) * 100}%`}
                    y1="0%"
                    x2={`${(i / 20) * 100}%`}
                    y2="100%"
                    stroke="rgba(59, 130, 246, 0.1)"
                    strokeWidth="0.5"
                    pathLength="1"
                />
            );
        }

        // Horizontal lines
        for (let i = 0; i <= 12; i++) {
            lines.push(
                <line
                    key={`h-${i}`}
                    className="grid-line"
                    x1="0%"
                    y1={`${(i / 12) * 100}%`}
                    x2="100%"
                    y2={`${(i / 12) * 100}%`}
                    stroke="rgba(59, 130, 246, 0.1)"
                    strokeWidth="0.5"
                    pathLength="1"
                />
            );
        }

        return lines;
    };

    // Create orbital rings
    const createOrbitalRings = (): React.ReactElement[] => {
        const rings: React.ReactElement[] = [];
        const radii = [120, 180, 240];

        radii.forEach((radius, index) => {
            rings.push(
                <circle
                    key={`ring-${index}`}
                    className="orbital-ring"
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="none"
                    stroke={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#8b5cf6'}
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    pathLength="1"
                />
            );
        });

        return rings;
    };

    const neuralParticles = createNeuralParticles();
    const dataStreams = createDataStreams();
    const gridLines = createHolographicGrid();
    const orbitalRings = createOrbitalRings();

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(onComplete, 800);
            }
        });

        // Phase indicators
        const phases = ['Inicializando Sistema...', 'Conectando Rede Neural...', 'Carregando Dados...', 'Sistema Pronto!'];

        // Set initial states
        gsap.set([logoRef.current, textRef.current, loadingRef.current], {
            opacity: 0,
            scale: 0.8,
            y: 50
        });

        gsap.set('.neural-particle', {
            opacity: 0,
            scale: 0,
            rotation: 0
        });

        gsap.set('.data-stream', {
            opacity: 0,
            scaleX: 0
        });

        gsap.set('.grid-line', {
            pathLength: 0,
            opacity: 0
        });

        gsap.set('.orbital-ring', {
            pathLength: 0,
            opacity: 0,
            rotation: 0
        });

        gsap.set('.logo-element path, .logo-element line', {
            pathLength: 0,
            opacity: 0
        });

        gsap.set('.logo-element circle, .logo-element text', {
            opacity: 0,
            scale: 0
        });

        // Complex animation sequence
        tl
            // Phase 1: Grid Formation
            .to(containerRef.current, {
                background: 'radial-gradient(ellipse at center, #1f2937 0%, #111827 70%, #000000 100%)',
                duration: 1,
                ease: 'power2.out'
            })
            .to('.grid-line', {
                pathLength: 1,
                opacity: 0.3,
                duration: 2,
                stagger: {
                    amount: 1,
                    from: 'center'
                },
                ease: 'power2.inOut'
            }, 0.5)

            // Phase 2: Neural Network Activation
            .to('.neural-particle', {
                opacity: 1,
                scale: 1,
                rotation: 360,
                duration: 1.5,
                stagger: {
                    amount: 1.2,
                    from: 'random'
                },
                ease: 'back.out(1.7)'
            }, 1)

            // Phase 3: Orbital Systems
            .to('.orbital-ring', {
                pathLength: 1,
                opacity: 0.6,
                rotation: 180,
                duration: 2,
                stagger: 0.3,
                ease: 'power2.inOut'
            }, 1.5)

            // Phase 4: Data Streams
            .to('.data-stream', {
                opacity: 0.8,
                scaleX: 1,
                duration: 1.5,
                stagger: 0.1,
                ease: 'power3.out'
            }, 2)

            // Phase 5: Logo Formation
            .to('.logo-element path, .logo-element line', {
                pathLength: 1,
                opacity: 1,
                duration: 2,
                stagger: 0.15,
                ease: 'power2.inOut'
            }, 2.5)

            .to('.logo-element circle, .logo-element text', {
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: 0.1,
                ease: 'back.out(1.4)'
            }, 3)

            // Phase 6: Interface Elements
            .to(logoRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: 'back.out(1.7)'
            }, 3.5)

            .to(textRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            }, 4)

            .to(loadingRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, 4.2);

        // Progress bar animation
        const progressTl = gsap.timeline({ repeat: -1 });
        progressTl.to(progressRef.current, {
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: function () {
                const progress = Math.floor(this.progress() * 100);
                setLoadingProgress(progress);
            }
        })
            .to(progressRef.current, {
                width: '0%',
                duration: 0.3,
                ease: 'power2.in'
            });

        // Phase text updates
        let phaseIndex = 0;
        const phaseInterval = setInterval(() => {
            if (phaseIndex < phases.length) {
                setCurrentPhase(phases[phaseIndex]);
                phaseIndex++;
            } else {
                clearInterval(phaseInterval);
            }
        }, 1200);

        // Continuous animations
        gsap.to('.neural-particle', {
            y: '+=20',
            rotation: '+=180',
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: {
                amount: 2,
                from: 'random'
            }
        });

        gsap.to('.orbital-ring', {
            rotation: '+=360',
            duration: 8,
            repeat: -1,
            ease: 'none',
            stagger: 0.5
        });

        gsap.to('.data-stream', {
            opacity: 0.3,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.2
        });

        return () => {
            clearInterval(phaseInterval);
        };

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="professional-intro-container"
        >
            {/* Holographic Grid Background */}
            <div ref={gridRef} className="absolute inset-0">
                <svg className="w-full h-full">
                    {gridLines}
                </svg>
            </div>

            {/* Neural Network Layer */}
            <div ref={neuralNetworkRef} className="absolute inset-0">
                {neuralParticles}
            </div>

            {/* Orbital Systems */}
            <div ref={orbitRef} className="absolute inset-0">
                <svg className="w-full h-full">
                    {orbitalRings}
                </svg>
            </div>

            {/* Data Flow Streams */}
            <div ref={dataFlowRef} className="absolute inset-0">
                {dataStreams}
            </div>

            {/* Holographic Effects */}
            <div ref={hologramRef} className="absolute inset-0 pointer-events-none">
                {/* Scan lines */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-pulse" />

                {/* Corner brackets */}
                <div className="absolute top-10 left-10 w-8 h-8 border-l-2 border-t-2 border-blue-400/50" />
                <div className="absolute top-10 right-10 w-8 h-8 border-r-2 border-t-2 border-blue-400/50" />
                <div className="absolute bottom-10 left-10 w-8 h-8 border-l-2 border-b-2 border-blue-400/50" />
                <div className="absolute bottom-10 right-10 w-8 h-8 border-r-2 border-b-2 border-blue-400/50" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center">
                {/* Advanced Logo */}
                <div ref={logoRef} className="mb-8">
                    <svg
                        width="240"
                        height="240"
                        viewBox="0 0 240 240"
                        className="mx-auto drop-shadow-2xl"
                    >
                        <defs>
                            {/* Advanced gradients */}
                            <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#1d4ed8" />
                                <stop offset="100%" stopColor="#1e3a8a" />
                            </radialGradient>

                            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="50%" stopColor="#059669" />
                                <stop offset="100%" stopColor="#047857" />
                            </linearGradient>

                            <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="50%" stopColor="#7c3aed" />
                                <stop offset="100%" stopColor="#6d28d9" />
                            </linearGradient>

                            {/* Glow filters */}
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Core System Circle */}
                        <circle
                            className="logo-element"
                            cx="120"
                            cy="120"
                            r="100"
                            fill="none"
                            stroke="url(#coreGradient)"
                            strokeWidth="3"
                            filter="url(#glow)"
                        />

                        {/* Neural Network Hexagon */}
                        <path
                            className="logo-element"
                            d="M 120 50 L 150 70 L 150 110 L 120 130 L 90 110 L 90 70 Z"
                            fill="none"
                            stroke="url(#neuralGradient)"
                            strokeWidth="3"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        {/* Data Flow Connections */}
                        <path
                            className="logo-element"
                            d="M 60 60 L 120 90 L 180 60"
                            fill="none"
                            stroke="url(#dataGradient)"
                            strokeWidth="2"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        <path
                            className="logo-element"
                            d="M 60 180 L 120 150 L 180 180"
                            fill="none"
                            stroke="url(#dataGradient)"
                            strokeWidth="2"
                            filter="url(#glow)"
                            pathLength="1"
                        />

                        {/* System Nodes */}
                        <circle
                            className="logo-element"
                            cx="60"
                            cy="60"
                            r="8"
                            fill="url(#neuralGradient)"
                            filter="url(#strongGlow)"
                        />
                        <circle
                            className="logo-element"
                            cx="180"
                            cy="60"
                            r="8"
                            fill="url(#neuralGradient)"
                            filter="url(#strongGlow)"
                        />
                        <circle
                            className="logo-element"
                            cx="60"
                            cy="180"
                            r="8"
                            fill="url(#neuralGradient)"
                            filter="url(#strongGlow)"
                        />
                        <circle
                            className="logo-element"
                            cx="180"
                            cy="180"
                            r="8"
                            fill="url(#neuralGradient)"
                            filter="url(#strongGlow)"
                        />

                        {/* Central Core */}
                        <circle
                            className="logo-element"
                            cx="120"
                            cy="120"
                            r="15"
                            fill="url(#coreGradient)"
                            filter="url(#strongGlow)"
                        />

                        {/* Enterprise Symbol */}
                        <text
                            className="logo-element"
                            x="120"
                            y="130"
                            textAnchor="middle"
                            fill="white"
                            fontSize="18"
                            fontWeight="bold"
                            fontFamily="Arial, sans-serif"
                            filter="url(#glow)"
                        >
                            E
                        </text>
                    </svg>
                </div>

                {/* Enhanced Text */}
                <div ref={textRef} className="mb-8 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-wider">
                        <span className="bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
                            ENTERPRISE
                        </span>
                    </h1>
                    <h2 className="text-xl md:text-2xl text-gray-300 font-light tracking-widest">
                        BUSINESS MANAGEMENT SYSTEM
                    </h2>
                    <div className="text-sm text-blue-400 font-mono">
                        {currentPhase}
                    </div>
                </div>

                {/* Advanced Loading Interface */}
                <div ref={loadingRef} className="w-96 max-w-full mx-auto">
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Sistema</span>
                            <span>{loadingProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700 overflow-hidden">
                            <div
                                ref={progressRef}
                                className="h-full bg-gradient-to-r from-blue-500 via-green-400 to-purple-500 rounded-full transition-all duration-300 relative"
                                style={{
                                    width: '0%',
                                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Status indicators */}
                    <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-gray-400">Network</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                            <span className="text-gray-400">Database</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            <span className="text-gray-400">Security</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimationProfessional;
