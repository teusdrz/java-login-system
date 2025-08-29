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
    const networkRef = useRef<HTMLDivElement>(null);
    const dataFlowRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState('System Initialization');
    const [systemStatus, setSystemStatus] = useState('connecting');

    // Create enterprise particles with corporate styling
    const createEnterpriseParticles = () => {
        const particles = [];
        const corporateColors = ['#1e40af', '#3b82f6', '#06b6d4', '#10b981', '#059669'];

        for (let i = 0; i < 45; i++) {
            const color = corporateColors[Math.floor(Math.random() * corporateColors.length)];
            const size = Math.random() * 3 + 1;

            particles.push(
                <div
                    key={`enterprise-${i}`}
                    className="enterprise-particle opacity-0"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                        color: color,
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

    // Create corporate logo elements
    const createCorporateLogo = () => {
        return (
            <svg width="200" height="120" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 5 }}>
                <defs>
                    <linearGradient id="corporateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="25%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="75%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>

                    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
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

                {/* Corporate Hexagon */}
                <polygon
                    className="logo-segment primary opacity-0"
                    points="100,20 140,40 140,80 100,100 60,80 60,40"
                    filter="url(#corporateGlow)"
                />

                {/* Inner elements */}
                <circle
                    className="logo-segment secondary opacity-0"
                    cx="100"
                    cy="60"
                    r="15"
                    filter="url(#strongGlow)"
                />

                {/* Connection paths */}
                <path
                    className="logo-segment secondary opacity-0"
                    d="M 70 45 L 100 60 L 130 45"
                    fill="none"
                    strokeWidth="2"
                    filter="url(#corporateGlow)"
                />

                <path
                    className="logo-segment secondary opacity-0"
                    d="M 70 75 L 100 60 L 130 75"
                    fill="none"
                    strokeWidth="2"
                    filter="url(#corporateGlow)"
                />

                {/* Corner nodes */}
                <circle className="logo-segment primary opacity-0" cx="70" cy="45" r="4" filter="url(#strongGlow)" />
                <circle className="logo-segment primary opacity-0" cx="130" cy="45" r="4" filter="url(#strongGlow)" />
                <circle className="logo-segment primary opacity-0" cx="70" cy="75" r="4" filter="url(#strongGlow)" />
                <circle className="logo-segment primary opacity-0" cx="130" cy="75" r="4" filter="url(#strongGlow)" />
            </svg>
        );
    };

    const enterpriseParticles = createEnterpriseParticles();
    const dataNodes = createDataNodes();
    const connectionLines = createConnectionLines();
    const corporateGrid = createCorporateGrid();
    const corporateLogo = createCorporateLogo();

    useGSAP(() => {
        if (!containerRef.current) return;

        // Extended 6-second timeline with corporate phases
        const masterTimeline = gsap.timeline({
            onComplete: () => {
                setTimeout(() => onComplete(), 500);
            }
        });

        // Initial state setup
        gsap.set('.enterprise-particle', { opacity: 0, scale: 0, rotation: 0 });
        gsap.set('.data-node', { opacity: 0, scale: 0 });
        gsap.set('.connection-line', { opacity: 0, scaleX: 0 });
        gsap.set('.corporate-line', { opacity: 0 });
        gsap.set('.logo-segment', { opacity: 0, scale: 0 });

        // Phase 1: Corporate Grid Initialization (0-1.5s)
        masterTimeline
            .to('.corporate-line.major', {
                opacity: 0.15,
                duration: 0.8,
                stagger: {
                    amount: 0.4,
                    from: 'center'
                },
                ease: 'power2.out',
                onStart: () => setCurrentPhase('Network Infrastructure')
            })
            .to('.corporate-line:not(.major)', {
                opacity: 0.08,
                duration: 0.7,
                stagger: {
                    amount: 0.6,
                    from: 'random'
                },
                ease: 'power2.out'
            }, 0.3)

            // Phase 2: Data Nodes Activation (1.2-2.5s)
            .to('.data-node', {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: {
                    amount: 0.8,
                    from: 'center'
                },
                ease: 'back.out(2)',
                onStart: () => setCurrentPhase('Data Layer Initialization')
            }, 1.2)

            // Phase 3: Network Connections (2.0-3.2s)
            .to('.connection-line', {
                opacity: 0.8,
                scaleX: 1,
                duration: 0.4,
                stagger: {
                    amount: 0.8,
                    from: 'start'
                },
                ease: 'power3.out',
                onStart: () => setCurrentPhase('Establishing Connections')
            }, 2.0)

            // Phase 4: Enterprise Particles (2.5-3.8s)
            .to('.enterprise-particle', {
                opacity: 1,
                scale: 1,
                rotation: 360,
                duration: 0.8,
                stagger: {
                    amount: 1.0,
                    from: 'random'
                },
                ease: 'back.out(1.5)',
                onStart: () => setCurrentPhase('Security Protocols Active')
            }, 2.5)

            // Phase 5: Corporate Logo Formation (3.5-5.0s)
            .to('.logo-segment.primary', {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(2)',
                onStart: () => setCurrentPhase('System Ready')
            }, 3.5)
            .to('.logo-segment.secondary', {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.8)'
            }, 4.0)

            // Phase 6: Final Initialization (4.8-6.0s)
            .to(logoRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'back.out(1.7)',
                onStart: () => setCurrentPhase('Welcome to Enterprise Portal')
            }, 4.8)
            .to(textRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, 5.2)
            .to(loadingRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: 'back.out(1.7)'
            }, 5.6);

        // Enhanced progress animation
        const progressTimeline = gsap.timeline({ repeat: 2 });
        progressTimeline
            .to(progressRef.current, {
                width: '100%',
                duration: 2,
                ease: 'power2.inOut',
                onUpdate: function () {
                    const progress = Math.floor(this.progress() * 100);
                    setLoadingProgress(progress);

                    // Update system status
                    if (progress < 30) setSystemStatus('connecting');
                    else if (progress < 70) setSystemStatus('authenticating');
                    else setSystemStatus('ready');
                }
            })
            .to(progressRef.current, {
                width: '0%',
                duration: 0.5,
                ease: 'power2.out'
            });

        // Data node activation sequence
        const nodeTimeline = gsap.timeline({ repeat: -1, delay: 2 });
        nodeTimeline.to('.data-node', {
            duration: 0.3,
            scale: 1.5,
            stagger: {
                amount: 2,
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
            className="intro-container fixed inset-0 flex items-center justify-center z-50"
        >
            {/* Corporate Grid Background */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
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
            <div ref={logoRef} className="opacity-0 transform scale-75 translate-y-8" style={{ zIndex: 5 }}>
                {corporateLogo}
            </div>

            {/* Enterprise Text */}
            <div
                ref={textRef}
                className="opacity-0 transform scale-75 translate-y-8 absolute top-2/3 left-1/2 transform -translate-x-1/2 text-center"
                style={{ zIndex: 6 }}
            >
                <h1 className="enterprise-title text-4xl md:text-5xl lg:text-6xl mb-4">
                    Enterprise Portal
                </h1>
                <p className="corporate-text text-lg md:text-xl opacity-80">
                    Advanced Business Intelligence Platform
                </p>
            </div>

            {/* Loading Interface */}
            <div
                ref={loadingRef}
                className="opacity-0 transform scale-75 translate-y-8 absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80"
                style={{ zIndex: 7 }}
            >
                <div className="loading-stage">
                    {/* Status Indicators */}
                    <div ref={statusRef} className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className={`status-indicator ${systemStatus === 'ready' ? '' : 'warning'}`}></div>
                            <span className="corporate-text text-sm font-medium">
                                {currentPhase}
                            </span>
                        </div>
                        <span className="corporate-text text-sm opacity-70">
                            {loadingProgress}%
                        </span>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="progress-container h-2 rounded-full mb-3">
                        <div
                            ref={progressRef}
                            className="progress-bar h-full rounded-full"
                            style={{ width: '0%' }}
                        />
                    </div>

                    {/* System Status */}
                    <div className="flex justify-between text-xs">
                        <span className="corporate-text opacity-60">System Status:</span>
                        <span className="corporate-text font-medium">
                            {systemStatus === 'connecting' && 'Establishing Connection'}
                            {systemStatus === 'authenticating' && 'Authenticating User'}
                            {systemStatus === 'ready' && 'All Systems Operational'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;
