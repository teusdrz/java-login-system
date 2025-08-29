import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import TypewriterAnimation from './TypewriterAnimation';
import '../styles/IntroAnimation.css';

interface IntroAnimationProps {
    onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<HTMLDivElement>(null);
    const dataFlowRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState('Initializing Enterprise Portal');
    const [systemStatus, setSystemStatus] = useState('connecting');

    // Create corporate modern particles with bright visibility
    const createEnterpriseParticles = () => {
        const particles = [];
        const corporateColors = ['#3B82F6', '#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

        for (let i = 0; i < 60; i++) {
            const color = corporateColors[Math.floor(Math.random() * corporateColors.length)];
            const size = Math.random() * 4 + 2;

            particles.push(
                <div
                    key={`enterprise-${i}`}
                    className="enterprise-particle opacity-0"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        background: `linear-gradient(45deg, ${color}, ${color}CC)`,
                        boxShadow: `0 0 ${size * 3}px ${color}66`,
                        borderRadius: '50%',
                        zIndex: 3
                    }}
                />
            );
        }
        return particles;
    };

    // Create corporate data nodes
    const createDataNodes = () => {
        const nodes: React.ReactElement[] = [];
        const positions = [
            { x: 20, y: 30 }, { x: 80, y: 20 }, { x: 70, y: 70 },
            { x: 30, y: 80 }, { x: 50, y: 50 }, { x: 15, y: 60 },
            { x: 85, y: 45 }, { x: 60, y: 25 }, { x: 40, y: 90 },
            { x: 90, y: 75 }, { x: 25, y: 15 }, { x: 75, y: 85 }
        ];

        positions.forEach((pos, index) => {
            nodes.push(
                <div
                    key={`node-${index}`}
                    className="data-node opacity-0"
                    style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        zIndex: 4
                    }}
                />
            );
        });

        return nodes;
    };

    // Create connection lines between nodes
    const createConnectionLines = () => {
        const lines: React.ReactElement[] = [];
        const connections = [
            { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
            { from: 3, to: 4 }, { from: 4, to: 0 }, { from: 4, to: 5 },
            { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 8 },
            { from: 8, to: 9 }, { from: 9, to: 10 }, { from: 10, to: 11 },
            { from: 11, to: 0 }, { from: 1, to: 7 }, { from: 2, to: 8 }
        ];

        const positions = [
            { x: 20, y: 30 }, { x: 80, y: 20 }, { x: 70, y: 70 },
            { x: 30, y: 80 }, { x: 50, y: 50 }, { x: 15, y: 60 },
            { x: 85, y: 45 }, { x: 60, y: 25 }, { x: 40, y: 90 },
            { x: 90, y: 75 }, { x: 25, y: 15 }, { x: 75, y: 85 }
        ];

        connections.forEach((conn, index) => {
            const from = positions[conn.from];
            const to = positions[conn.to];
            const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
            const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;

            lines.push(
                <div
                    key={`connection-${index}`}
                    className="connection-line opacity-0"
                    style={{
                        left: `${from.x}%`,
                        top: `${from.y}%`,
                        width: `${length * 2}px`,
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '0 0',
                        zIndex: 2
                    }}
                />
            );
        });

        return lines;
    };

    // Create corporate grid
    const createCorporateGrid = () => {
        const lines = [];

        // Major vertical lines
        for (let i = 0; i <= 8; i++) {
            lines.push(
                <line
                    key={`major-v-${i}`}
                    className="corporate-line major"
                    x1={`${(i / 8) * 100}%`}
                    y1="0%"
                    x2={`${(i / 8) * 100}%`}
                    y2="100%"
                />
            );
        }

        // Major horizontal lines
        for (let i = 0; i <= 6; i++) {
            lines.push(
                <line
                    key={`major-h-${i}`}
                    className="corporate-line major"
                    x1="0%"
                    y1={`${(i / 6) * 100}%`}
                    x2="100%"
                    y2={`${(i / 6) * 100}%`}
                />
            );
        }

        // Minor grid lines
        for (let i = 0; i <= 24; i++) {
            if (i % 3 !== 0) {
                lines.push(
                    <line
                        key={`minor-v-${i}`}
                        className="corporate-line"
                        x1={`${(i / 24) * 100}%`}
                        y1="0%"
                        x2={`${(i / 24) * 100}%`}
                        y2="100%"
                    />
                );
            }
        }

        for (let i = 0; i <= 18; i++) {
            if (i % 3 !== 0) {
                lines.push(
                    <line
                        key={`minor-h-${i}`}
                        className="corporate-line"
                        x1="0%"
                        y1={`${(i / 18) * 100}%`}
                        x2="100%"
                        y2={`${(i / 18) * 100}%`}
                    />
                );
            }
        }

        return lines;
    };

    // Create enterprise business logo for login system
    const createCorporateLogo = () => {
        return (
            <div className="relative flex items-center justify-center" style={{ zIndex: 5 }}>
                <svg width="320" height="180" className="corporate-logo-svg">
                    <defs>
                        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1E40AF" />
                            <stop offset="25%" stopColor="#3B82F6" />
                            <stop offset="50%" stopColor="#06B6D4" />
                            <stop offset="75%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>

                        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="50%" stopColor="#06B6D4" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>

                        <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>

                        <filter id="corporateGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="strongGlow">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Enterprise Login System Logo */}
                    <g transform="translate(160, 90)">
                        {/* Main Shield/Security Symbol */}
                        <path
                            className="logo-segment primary opacity-0"
                            d="M 0,-60 L 40,-40 L 40,20 Q 40,50 0,60 Q -40,50 -40,20 L -40,-40 Z"
                            fill="url(#primaryGradient)"
                            stroke="url(#accentGradient)"
                            strokeWidth="2"
                            filter="url(#corporateGlow)"
                        />

                        {/* Inner Security Core */}
                        <circle
                            className="logo-segment secondary opacity-0"
                            cx="0"
                            cy="-10"
                            r="20"
                            fill="url(#securityGradient)"
                            filter="url(#strongGlow)"
                        />

                        {/* Login Access Points */}
                        <g className="logo-segment nodes opacity-0">
                            <circle cx="-25" cy="-25" r="4" fill="url(#accentGradient)" filter="url(#strongGlow)" />
                            <circle cx="25" cy="-25" r="4" fill="url(#accentGradient)" filter="url(#strongGlow)" />
                            <circle cx="-25" cy="5" r="4" fill="url(#accentGradient)" filter="url(#strongGlow)" />
                            <circle cx="25" cy="5" r="4" fill="url(#accentGradient)" filter="url(#strongGlow)" />
                        </g>

                        {/* Connection Network */}
                        <g className="logo-segment connections opacity-0">
                            <line x1="-25" y1="-25" x2="0" y2="-10" stroke="url(#accentGradient)" strokeWidth="2" filter="url(#corporateGlow)" />
                            <line x1="25" y1="-25" x2="0" y2="-10" stroke="url(#accentGradient)" strokeWidth="2" filter="url(#corporateGlow)" />
                            <line x1="-25" y1="5" x2="0" y2="-10" stroke="url(#accentGradient)" strokeWidth="2" filter="url(#corporateGlow)" />
                            <line x1="25" y1="5" x2="0" y2="-10" stroke="url(#accentGradient)" strokeWidth="2" filter="url(#corporateGlow)" />
                        </g>

                        {/* Security Lock Icon */}
                        <g className="logo-segment lock opacity-0">
                            <rect x="-8" y="-18" width="16" height="12" rx="2" fill="none" stroke="url(#securityGradient)" strokeWidth="2" />
                            <path d="M -5,-18 Q -5,-25 0,-25 Q 5,-25 5,-18" fill="none" stroke="url(#securityGradient)" strokeWidth="2" />
                            <circle cx="0" cy="-12" r="2" fill="url(#securityGradient)" />
                        </g>

                        {/* Data Flow Indicators */}
                        <g className="logo-segment dataflow opacity-0">
                            <path d="M -35,-10 L -30,-15 L -30,-5 Z" fill="url(#accentGradient)" />
                            <path d="M 35,-10 L 30,-15 L 30,-5 Z" fill="url(#accentGradient)" />
                            <path d="M 0,25 L -5,20 L 5,20 Z" fill="url(#accentGradient)" />
                        </g>

                        {/* Outer Protection Ring */}
                        <circle
                            className="logo-segment ring opacity-0"
                            cx="0"
                            cy="-10"
                            r="55"
                            fill="none"
                            stroke="url(#primaryGradient)"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                            filter="url(#corporateGlow)"
                        />
                    </g>
                </svg>
            </div>
        );
    };

    const enterpriseParticles = createEnterpriseParticles();
    const dataNodes = createDataNodes();
    const connectionLines = createConnectionLines();
    const corporateGrid = createCorporateGrid();
    const corporateLogo = createCorporateLogo();

    useGSAP(() => {
        if (!containerRef.current) return;

        // Enhanced 8-second extraordinary corporate timeline
        const masterTimeline = gsap.timeline({
            onComplete: () => {
                setTimeout(() => onComplete(), 1000);
            }
        });

        // Initial state setup - mais visível
        gsap.set('.enterprise-particle', { opacity: 0, scale: 0, rotation: 0 });
        gsap.set('.data-node', { opacity: 0, scale: 0 });
        gsap.set('.connection-line', { opacity: 0, scaleX: 0 });
        gsap.set('.corporate-line', { opacity: 0 });
        gsap.set('.logo-segment', { opacity: 0, scale: 0 });
        gsap.set(logoRef.current, { opacity: 0, scale: 0.5, y: 30 });
        gsap.set(textRef.current, { opacity: 0, scale: 0.8, y: 40 });
        gsap.set(loadingRef.current, { opacity: 0, scale: 0.8, y: 30 });

        // Phase 1: Grid Infrastructure (0-1.5s) - mais visível e lenta
        masterTimeline
            .to('.corporate-line.major', {
                opacity: 0.6,
                duration: 1.2,
                stagger: {
                    amount: 0.8,
                    from: 'center'
                },
                ease: 'power2.out',
                onStart: () => setCurrentPhase('Initializing Network Infrastructure')
            })
            .to('.corporate-line:not(.major)', {
                opacity: 0.3,
                duration: 0.8,
                stagger: {
                    amount: 0.6,
                    from: 'random'
                },
                ease: 'power2.out'
            }, 0.6)

            // Phase 2: Data Nodes (1.3-2.8s) - mais visível
            .to('.data-node', {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                stagger: {
                    amount: 1.0,
                    from: 'center'
                },
                ease: 'back.out(3)',
                onStart: () => setCurrentPhase('Activating Data Centers')
            }, 1.3)

            // Phase 3: Connections (2.5-4.0s) - mais visível
            .to('.connection-line', {
                opacity: 1,
                scaleX: 1,
                duration: 1.0,
                stagger: {
                    amount: 1.2,
                    from: 'start'
                },
                ease: 'power3.out',
                onStart: () => setCurrentPhase('Establishing Secure Connections')
            }, 2.5)

            // Phase 4: Enterprise Particles (3.5-5.0s) - mais visível
            .to('.enterprise-particle', {
                opacity: 1,
                scale: 1,
                rotation: 180,
                duration: 1.2,
                stagger: {
                    amount: 1.0,
                    from: 'random'
                },
                ease: 'back.out(2)',
                onStart: () => setCurrentPhase('Deploying Security Protocols')
            }, 3.5)

            // Phase 5: Logo Formation (4.5-6.5s)
            .to('.logo-segment.primary', {
                opacity: 1,
                scale: 1,
                duration: 1.0,
                stagger: 0.15,
                ease: 'back.out(3)',
                onStart: () => setCurrentPhase('Initializing Enterprise Core')
            }, 4.5)
            .to('.logo-segment.secondary', {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(2.5)'
            }, 5.0)
            .to('.logo-segment.accent', {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(3)'
            }, 5.5)
            .to('.logo-segment.connections', {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(2)'
            }, 5.8)
            .to('.logo-segment.nodes', {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: 'back.out(2)'
            }, 6.0)

            // Phase 6: Main Logo & Text (6.2-8.0s)
            .to(logoRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.0,
                ease: 'back.out(2)',
                onStart: () => setCurrentPhase('Welcome to Enterprise Portal')
            }, 6.2)
            .to(textRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.8)'
            }, 6.8)
            .to(loadingRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.8)'
            }, 7.2);

        // Enhanced progress animation - atualizado para 8 segundos
        const progressTimeline = gsap.timeline();
        progressTimeline.to(progressRef.current, {
            width: '100%',
            duration: 8,
            ease: 'power2.out',
            onUpdate: function () {
                const progress = Math.floor(this.progress() * 100);
                setLoadingProgress(progress);

                // Update system status
                if (progress < 20) setSystemStatus('connecting');
                else if (progress < 50) setSystemStatus('authenticating');
                else if (progress < 85) setSystemStatus('loading');
                else setSystemStatus('ready');
            }
        });

        // Continuous particle animation - mais visível
        const particleTimeline = gsap.timeline({ repeat: -1, delay: 3 });
        particleTimeline.to('.enterprise-particle', {
            duration: 2,
            rotation: '+=360',
            scale: 1.3,
            stagger: {
                amount: 3,
                from: 'random',
                repeat: 1,
                yoyo: true
            },
            ease: 'power2.inOut'
        });

    }, []);

    return (
        <div
            ref={containerRef}
            className="intro-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #334155 50%, #475569 75%, #64748B 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 8s ease-in-out infinite'
            }}
        >
            {/* Corporate Grid Background */}
            <svg
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: 1, opacity: 0.8 }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {corporateGrid}
            </svg>

            {/* Enterprise Particles */}
            <div ref={networkRef} className="absolute inset-0" style={{ zIndex: 3 }}>
                {enterpriseParticles}
            </div>

            {/* Data Nodes */}
            <div className="absolute inset-0" style={{ zIndex: 4 }}>
                {dataNodes}
            </div>

            {/* Connection Lines */}
            <div ref={dataFlowRef} className="absolute inset-0" style={{ zIndex: 2 }}>
                {connectionLines}
            </div>

            {/* Corporate Logo */}
            <div
                ref={logoRef}
                className="absolute"
                style={{
                    top: '35%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 5
                }}
            >
                {corporateLogo}
            </div>

            {/* Enterprise Text with Enhanced Typewriter */}
            <div
                ref={textRef}
                className="absolute text-center"
                style={{
                    top: '55%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 6,
                    width: '90%'
                }}
            >
                <TypewriterAnimation
                    texts={["ENTERPRISE PORTAL"]}
                    speed={100}
                    delay={2500}
                    styleType="corporate"
                    className="text-4xl md:text-5xl lg:text-6xl mb-4 font-bold text-white"
                    showCursor={true}
                    onComplete={() => {
                        setTimeout(() => {
                            const subtitle = document.querySelector('.subtitle-typewriter');
                            if (subtitle) {
                                subtitle.classList.remove('opacity-0');
                                subtitle.classList.add('opacity-100');
                            }
                        }, 300);
                    }}
                />
                <div className="subtitle-typewriter opacity-0 transition-opacity duration-1000">
                    <TypewriterAnimation
                        texts={["Advanced Business Intelligence & Analytics Platform"]}
                        speed={60}
                        delay={0}
                        styleType="corporate"
                        className="text-lg md:text-xl text-blue-300 opacity-90"
                        showCursor={false}
                    />
                </div>
            </div>

            {/* Enhanced Loading Interface */}
            <div
                ref={loadingRef}
                className="absolute"
                style={{
                    bottom: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 7,
                    width: '90%',
                    maxWidth: '400px'
                }}
            >
                <div className="loading-stage bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-slate-600/50">
                    {/* Status Header */}
                    <div ref={statusRef} className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${systemStatus === 'ready' ? 'bg-green-400' :
                                systemStatus === 'loading' ? 'bg-blue-400' :
                                    'bg-blue-400'
                                } shadow-lg animate-pulse`}></div>
                            <span className="text-white text-sm font-medium">
                                {currentPhase}
                            </span>
                        </div>
                        <span className="text-blue-300 text-sm font-bold">
                            {loadingProgress}%
                        </span>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="relative mb-4">
                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                ref={progressRef}
                                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-full transition-all duration-300 shadow-lg"
                                style={{
                                    width: '0%',
                                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                                }}
                            />
                        </div>
                    </div>

                    {/* System Status Details */}
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">System Status:</span>
                        <span className="text-white font-medium">
                            {systemStatus === 'connecting' && 'Establishing Secure Connection...'}
                            {systemStatus === 'authenticating' && 'Authenticating Enterprise User...'}
                            {systemStatus === 'loading' && 'Loading Business Intelligence...'}
                            {systemStatus === 'ready' && 'All Systems Operational ✓'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;
