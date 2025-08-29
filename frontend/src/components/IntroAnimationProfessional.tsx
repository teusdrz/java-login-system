import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import '../styles/IntroAnimationProfessional.css';

interface IntroAnimationProfessionalProps {
    onComplete: () => void;
}

const IntroAnimationProfessional: React.FC<IntroAnimationProfessionalProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState('Inicializando Sistema Corporativo...');

    // Create advanced data grid
    const createAdvancedDataGrid = () => {
        const nodes = [];
        for (let i = 0; i < 100; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;
            const x = (col * 10) + 5;
            const y = (row * 10) + 5;

            nodes.push(
                <div
                    key={`grid-node-${i}`}
                    className="corporate-grid-node"
                    style={{
                        left: `${x}%`,
                        top: `${y}%`
                    }}
                >
                    <div className="grid-node-core"></div>
                    <div className="grid-node-ring"></div>
                    <div className="grid-node-pulse"></div>
                </div>
            );
        }
        return nodes;
    };

    // Create enterprise network
    const createEnterpriseNetwork = () => {
        const connections = [];
        for (let i = 0; i < 30; i++) {
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
            const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

            connections.push(
                <div
                    key={`connection-${i}`}
                    className="enterprise-connection"
                    style={{
                        left: `${startX}%`,
                        top: `${startY}%`,
                        width: `${length}%`,
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '0 50%'
                    }}
                >
                    <div className="connection-line"></div>
                    <div className="connection-pulse"></div>
                </div>
            );
        }
        return connections;
    };

    // Create professional logo
    const createProfessionalLogo = () => {
        return (
            <div className="professional-logo-container">
                <svg width="200" height="200" viewBox="0 0 200 200" className="professional-logo-svg">
                    <defs>
                        <linearGradient id="corporateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                        <filter id="professionalGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Corporate Shield */}
                    <path
                        className="logo-shield"
                        d="M100 20 L160 50 L160 120 Q160 160 100 180 Q40 160 40 120 L40 50 Z"
                        fill="url(#corporateGradient)"
                        filter="url(#professionalGlow)"
                    />

                    {/* Data Center Icon */}
                    <rect className="logo-datacenter" x="70" y="60" width="60" height="40" rx="4" fill="#ffffff" opacity="0.9" />
                    <rect className="logo-datacenter" x="75" y="65" width="50" height="6" fill="#3b82f6" />
                    <rect className="logo-datacenter" x="75" y="75" width="50" height="6" fill="#3b82f6" />
                    <rect className="logo-datacenter" x="75" y="85" width="50" height="6" fill="#3b82f6" />

                    {/* Security Lock */}
                    <circle className="logo-security" cx="100" cy="130" r="15" fill="#10b981" opacity="0.9" />
                    <path className="logo-lock" d="M95 125 L95 120 Q95 115 100 115 Q105 115 105 120 L105 125"
                        stroke="#ffffff" strokeWidth="2" fill="none" />
                    <rect className="logo-lock-body" x="93" y="125" width="14" height="10" rx="2" fill="#ffffff" />

                    {/* Network Nodes */}
                    <circle className="logo-node" cx="70" cy="100" r="4" fill="#8b5cf6" />
                    <circle className="logo-node" cx="130" cy="100" r="4" fill="#8b5cf6" />
                    <circle className="logo-node" cx="85" cy="140" r="4" fill="#8b5cf6" />
                    <circle className="logo-node" cx="115" cy="140" r="4" fill="#8b5cf6" />

                    {/* Connection Lines */}
                    <line className="logo-connection" x1="74" y1="100" x2="96" y2="115" stroke="#64748b" strokeWidth="1" />
                    <line className="logo-connection" x1="126" y1="100" x2="104" y2="115" stroke="#64748b" strokeWidth="1" />
                    <line className="logo-connection" x1="89" y1="140" x2="96" y2="130" stroke="#64748b" strokeWidth="1" />
                    <line className="logo-connection" x1="111" y1="140" x2="104" y2="130" stroke="#64748b" strokeWidth="1" />
                </svg>

                <div className="professional-logo-text">
                    <h1 className="corporate-title">Sistema Corporativo</h1>
                    <p className="corporate-subtitle">Plataforma Empresarial Avançada</p>
                </div>
            </div>
        );
    };

    // Create advanced data particles
    const createAdvancedDataParticles = () => {
        const particles = [];
        const colors = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'];

        for (let i = 0; i < 60; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 4 + 2;

            particles.push(
                <div
                    key={`particle-${i}`}
                    className="advanced-data-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        background: color,
                        boxShadow: `0 0 ${size * 2}px ${color}66`
                    }}
                />
            );
        }
        return particles;
    };

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(onComplete, 500);
            }
        });

        const phases = [
            'Inicializando Sistema Corporativo...',
            'Estabelecendo Conexões de Rede...',
            'Verificando Protocolos de Segurança...',
            'Carregando Interface Empresarial...',
            'Sistema Pronto!'
        ];

        // Set initial states
        gsap.set('.corporate-grid-node', { opacity: 0, scale: 0 });
        gsap.set('.enterprise-connection', { opacity: 0, scaleX: 0 });
        gsap.set('.advanced-data-particle', { opacity: 0, scale: 0 });
        gsap.set('.professional-logo-container', { opacity: 0, scale: 0.5, y: 50 });
        gsap.set('.professional-loading-interface', { opacity: 0, y: 100 });

        // Professional 10-second animation sequence
        tl
            // Phase 1: Grid Infrastructure (0-2s)
            .to('.corporate-grid-node', {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.02,
                ease: "power2.out"
            })
            .call(() => {
                setCurrentPhase(phases[0]);
                setLoadingProgress(10);
            })

            // Phase 2: Network Connections (2-4s)
            .to('.enterprise-connection', {
                opacity: 0.7,
                scaleX: 1,
                duration: 1.2,
                stagger: 0.05,
                ease: "power2.inOut"
            }, "+=0.5")
            .call(() => {
                setCurrentPhase(phases[1]);
                setLoadingProgress(30);
            })

            // Phase 3: Data Particles (4-6s)
            .to('.advanced-data-particle', {
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: 0.03,
                ease: "back.out(1.7)"
            }, "+=0.3")
            .call(() => {
                setCurrentPhase(phases[2]);
                setLoadingProgress(50);
            })

            // Phase 4: Logo Formation (6-8s)
            .to('.professional-logo-container', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out"
            }, "+=0.5")
            .call(() => {
                setCurrentPhase(phases[3]);
                setLoadingProgress(75);
            })

            // Phase 5: Interface Loading (8-10s)
            .to('.professional-loading-interface', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            }, "+=0.2")
            .call(() => {
                setCurrentPhase(phases[4]);
                setLoadingProgress(100);
            })

            // Final transition
            .to('.professional-intro-container', {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut"
            }, "+=0.5");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="professional-intro-container">
            {/* Professional Background */}
            <div className="professional-background">
                {/* Advanced Grid Overlay */}
                <div ref={gridRef} className="advanced-grid-overlay">
                    {createAdvancedDataGrid()}
                </div>

                {/* Enterprise Network Overlay */}
                <div ref={networkRef} className="enterprise-network-overlay">
                    {createEnterpriseNetwork()}
                </div>

                {/* Advanced Data Particles */}
                <div ref={particlesRef} className="advanced-particles-overlay">
                    {createAdvancedDataParticles()}
                </div>
            </div>

            {/* Main Content */}
            <div className="professional-main-content">
                {/* Professional Logo */}
                <div ref={logoRef}>
                    {createProfessionalLogo()}
                </div>

                {/* Professional Loading Interface */}
                <div ref={loadingRef} className="professional-loading-interface">
                    <div className="loading-status-container">
                        <div ref={statusRef} className="loading-status-text">
                            {currentPhase}
                        </div>

                        <div className="loading-progress-container">
                            <div className="loading-progress-track">
                                <div
                                    ref={progressRef}
                                    className="loading-progress-fill"
                                    style={{ width: `${loadingProgress}%` }}
                                />
                            </div>
                            <div className="loading-progress-text">
                                {loadingProgress}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimationProfessional;
