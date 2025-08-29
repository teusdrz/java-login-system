import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import '../styles/IntroAnimationUltraProfessional.css';

interface IntroAnimationUltraProfessionalProps {
    onComplete: () => void;
}

const IntroAnimationUltraProfessional: React.FC<IntroAnimationUltraProfessionalProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const quantumFieldRef = useRef<HTMLDivElement>(null);
    const holoLogoRef = useRef<HTMLDivElement>(null);
    const dataStreamRef = useRef<HTMLDivElement>(null);
    const loadingSystemRef = useRef<HTMLDivElement>(null);
    const particleSystemRef = useRef<HTMLDivElement>(null);

    const [systemProgress, setSystemProgress] = useState(0);
    const [systemPhase, setSystemPhase] = useState('INICIALIZANDO MATRIZ QUÂNTICA');
    const [systemStatus, setSystemStatus] = useState('ONLINE');

    // Criar campo quântico de fundo ultra complexo
    const createQuantumField = () => {
        const quantumNodes = [];
        for (let i = 0; i < 200; i++) {
            const tier = Math.floor(i / 50);
            const size = (4 - tier) * 2 + Math.random() * 3;
            const opacity = (4 - tier) * 0.2 + 0.1;
            const hue = 200 + tier * 40 + Math.random() * 60;

            quantumNodes.push(
                <div
                    key={`quantum-${i}`}
                    className="quantum-node"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        background: `radial-gradient(circle, hsl(${hue}, 80%, 70%) 0%, hsl(${hue}, 60%, 50%) 50%, transparent 100%)`,
                        boxShadow: `
                            0 0 ${size * 2}px hsl(${hue}, 80%, 70%),
                            0 0 ${size * 4}px hsl(${hue}, 60%, 60%),
                            inset 0 0 ${size}px hsl(${hue}, 90%, 80%)
                        `,
                        opacity,
                        filter: `brightness(${1.2 + Math.random() * 0.3}) saturate(${1.5 + Math.random() * 0.5})`
                    }}
                    data-tier={tier}
                />
            );
        }
        return quantumNodes;
    };

    // Criar logo holográfico ultra complexo e único
    const createHolographicLogo = () => {
        return (
            <div className="holographic-logo-system">
                <div className="logo-quantum-core">
                    <svg width="300" height="300" viewBox="0 0 300 300" className="quantum-logo-svg">
                        <defs>
                            {/* Gradientes ultra avançados */}
                            <radialGradient id="quantumCore" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#00f5ff" stopOpacity="1" />
                                <stop offset="30%" stopColor="#0080ff" stopOpacity="0.9" />
                                <stop offset="60%" stopColor="#8000ff" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#ff0080" stopOpacity="0.5" />
                            </radialGradient>

                            <linearGradient id="neuralPath" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00ffff" />
                                <stop offset="25%" stopColor="#00ff80" />
                                <stop offset="50%" stopColor="#8000ff" />
                                <stop offset="75%" stopColor="#ff0040" />
                                <stop offset="100%" stopColor="#ff8000" />
                            </linearGradient>

                            <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#00f5ff" />
                                <stop offset="100%" stopColor="transparent" />
                                <animateTransform
                                    attributeName="gradientTransform"
                                    type="translate"
                                    values="-100 0;200 0;-100 0"
                                    dur="2s"
                                    repeatCount="indefinite" />
                            </linearGradient>

                            {/* Filtros ultra avançados */}
                            <filter id="quantumGlow" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.5 1 0 0  0 0 1 0 0  0 0 0 1 0" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="holographicDistortion" x="-50%" y="-50%" width="200%" height="200%">
                                <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                                <feGaussianBlur stdDeviation="1" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Estrutura do logo ultra complexa */}

                        {/* Núcleo quântico central */}
                        <circle
                            className="quantum-core-main"
                            cx="150" cy="150" r="40"
                            fill="url(#quantumCore)"
                            filter="url(#quantumGlow)"
                        />

                        {/* Anéis orbitais múltiplos */}
                        {[60, 80, 100, 120].map((radius, index) => (
                            <circle
                                key={`orbit-${index}`}
                                className={`quantum-orbit orbit-${index}`}
                                cx="150" cy="150" r={radius}
                                fill="none"
                                stroke="url(#neuralPath)"
                                strokeWidth={2 - index * 0.3}
                                strokeOpacity={0.8 - index * 0.15}
                                filter="url(#quantumGlow)"
                                style={{
                                    transformOrigin: '150px 150px',
                                    animation: `quantumOrbit${index} ${3 + index}s linear infinite`
                                }}
                            />
                        ))}

                        {/* Nódulos neurais conectados */}
                        {Array.from({ length: 12 }, (_, i) => {
                            const angle = (i * 30) * Math.PI / 180;
                            const x = 150 + Math.cos(angle) * 100;
                            const y = 150 + Math.sin(angle) * 100;
                            return (
                                <g key={`neural-node-${i}`}>
                                    <circle
                                        className="neural-node"
                                        cx={x} cy={y} r="8"
                                        fill="url(#quantumCore)"
                                        filter="url(#quantumGlow)"
                                    />
                                    <line
                                        className="neural-connection"
                                        x1="150" y1="150"
                                        x2={x} y2={y}
                                        stroke="url(#dataFlow)"
                                        strokeWidth="2"
                                        opacity="0.6"
                                    />
                                </g>
                            );
                        })}

                        {/* Estruturas de dados complexas */}
                        <g className="data-matrix">
                            {Array.from({ length: 8 }, (_, i) => {
                                const angle = (i * 45) * Math.PI / 180;
                                const x1 = 150 + Math.cos(angle) * 70;
                                const y1 = 150 + Math.sin(angle) * 70;
                                const x2 = 150 + Math.cos(angle + Math.PI / 4) * 90;
                                const y2 = 150 + Math.sin(angle + Math.PI / 4) * 90;
                                return (
                                    <path
                                        key={`data-path-${i}`}
                                        className="data-pathway"
                                        d={`M${x1},${y1} Q${150},${150} ${x2},${y2}`}
                                        fill="none"
                                        stroke="url(#neuralPath)"
                                        strokeWidth="1.5"
                                        opacity="0.7"
                                        filter="url(#holographicDistortion)"
                                    />
                                );
                            })}
                        </g>

                        {/* Padrões de segurança ultra avançados */}
                        <g className="security-layer">
                            <polygon
                                className="security-shield"
                                points="150,80 190,110 180,160 120,160 110,110"
                                fill="none"
                                stroke="#00ff80"
                                strokeWidth="2"
                                filter="url(#quantumGlow)"
                            />
                            <circle cx="150" cy="130" r="15" fill="#00ff80" opacity="0.3" />
                            <rect x="145" y="125" width="10" height="10" rx="2" fill="#ffffff" />
                        </g>

                        {/* Sistema de partículas internas */}
                        {Array.from({ length: 30 }, (_, i) => (
                            <circle
                                key={`particle-${i}`}
                                className="quantum-particle"
                                cx={120 + Math.random() * 60}
                                cy={120 + Math.random() * 60}
                                r={1 + Math.random() * 2}
                                fill={`hsl(${180 + Math.random() * 120}, 80%, 70%)`}
                                opacity={Math.random()}
                            />
                        ))}
                    </svg>
                </div>

                {/* Sistema de texto holográfico */}
                <div className="holographic-text-system">
                    <div className="company-name-holo">
                        <span className="holo-char">Q</span>
                        <span className="holo-char">U</span>
                        <span className="holo-char">A</span>
                        <span className="holo-char">N</span>
                        <span className="holo-char">T</span>
                        <span className="holo-char">U</span>
                        <span className="holo-char">M</span>
                        <span className="holo-spacer"></span>
                        <span className="holo-char">S</span>
                        <span className="holo-char">Y</span>
                        <span className="holo-char">S</span>
                        <span className="holo-char">T</span>
                        <span className="holo-char">E</span>
                        <span className="holo-char">M</span>
                        <span className="holo-char">S</span>
                    </div>
                    <div className="tagline-holo">
                        <span className="tagline-text">ENTERPRISE NEURAL MATRIX</span>
                        <div className="tagline-underline"></div>
                    </div>
                </div>
            </div>
        );
    };

    // Criar sistema de partículas ultra avançado
    const createAdvancedParticleSystem = () => {
        const particles = [];
        const particleTypes = ['data', 'energy', 'quantum', 'neural'];

        for (let i = 0; i < 150; i++) {
            const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            const size = Math.random() * 6 + 2;
            const hue = type === 'data' ? 200 : type === 'energy' ? 60 : type === 'quantum' ? 300 : 120;

            particles.push(
                <div
                    key={`advanced-particle-${i}`}
                    className={`advanced-particle particle-${type}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        background: `radial-gradient(circle, hsl(${hue}, 90%, 70%) 0%, hsl(${hue}, 70%, 50%) 70%, transparent 100%)`,
                        boxShadow: `
                            0 0 ${size * 2}px hsl(${hue}, 90%, 70%),
                            0 0 ${size * 4}px hsl(${hue}, 70%, 60%),
                            inset 0 0 ${size / 2}px hsl(${hue}, 100%, 80%)
                        `,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 4}s`
                    }}
                />
            );
        }
        return particles;
    };

    // Criar fluxos de dados neural ultra complexos
    const createNeuralDataStreams = () => {
        const streams = [];
        for (let i = 0; i < 20; i++) {
            const startAngle = (i * 18) * Math.PI / 180;

            streams.push(
                <div
                    key={`neural-stream-${i}`}
                    className="neural-data-stream"
                    style={{
                        left: `${50 + Math.cos(startAngle) * 40}%`,
                        top: `${50 + Math.sin(startAngle) * 40}%`,
                        width: `${Math.random() * 200 + 100}px`,
                        transform: `rotate(${(startAngle * 180 / Math.PI) + 90}deg)`,
                        animationDelay: `${i * 0.1}s`
                    }}
                >
                    <div className="stream-core"></div>
                    <div className="stream-pulse"></div>
                    <div className="stream-data-packets">
                        {Array.from({ length: 5 }, (_, j) => (
                            <div key={j} className="data-packet" style={{ animationDelay: `${j * 0.2}s` }}></div>
                        ))}
                    </div>
                </div>
            );
        }
        return streams;
    };

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(onComplete, 800);
            }
        });

        const phases = [
            'INICIALIZANDO MATRIZ QUÂNTICA',
            'ESTABELECENDO CONEXÕES NEURAIS',
            'SINCRONIZANDO PROTOCOLOS DE DADOS',
            'ATIVANDO SISTEMAS DE SEGURANÇA',
            'CARREGANDO INTERFACE HOLOGRÁFICA',
            'SISTEMA QUANTUM ONLINE'
        ];

        // Estados iniciais ultra complexos
        gsap.set('.quantum-node', { opacity: 0, scale: 0, rotation: 0 });
        gsap.set('.holographic-logo-system', { opacity: 0, scale: 0.3, y: 100, rotationY: 180 });
        gsap.set('.advanced-particle', { opacity: 0, scale: 0 });
        gsap.set('.neural-data-stream', { opacity: 0, scaleX: 0, x: -100 });
        gsap.set('.holo-char', { opacity: 0, y: 50, rotationX: 90 });
        gsap.set('.loading-system-ultra', { opacity: 0, y: 150 });

        // Sequência de animação ultra profissional (10 segundos)
        tl
            // Fase 1: Campo Quântico (0-1.5s)
            .to('.quantum-node[data-tier="0"]', {
                opacity: 1,
                scale: 1,
                rotation: 360,
                duration: 0.8,
                stagger: 0.02,
                ease: "power3.out"
            })
            .call(() => {
                setSystemPhase(phases[0]);
                setSystemProgress(15);
            })

            // Fase 2: Camadas Quânticas (1.5-3s)
            .to('.quantum-node[data-tier="1"], .quantum-node[data-tier="2"], .quantum-node[data-tier="3"]', {
                opacity: 1,
                scale: 1,
                rotation: -360,
                duration: 1.2,
                stagger: 0.01,
                ease: "power2.inOut"
            }, "+=0.2")
            .call(() => {
                setSystemPhase(phases[1]);
                setSystemProgress(30);
            })

            // Fase 3: Sistema de Partículas (3-4.5s)
            .to('.advanced-particle', {
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: 0.008,
                ease: "back.out(2)"
            }, "+=0.3")
            .call(() => {
                setSystemPhase(phases[2]);
                setSystemProgress(45);
            })

            // Fase 4: Fluxos Neurais (4.5-6s)
            .to('.neural-data-stream', {
                opacity: 0.8,
                scaleX: 1,
                x: 0,
                duration: 1.2,
                stagger: 0.05,
                ease: "power3.inOut"
            }, "+=0.2")
            .call(() => {
                setSystemPhase(phases[3]);
                setSystemProgress(60);
            })

            // Fase 5: Logo Holográfico (6-8s)
            .to('.holographic-logo-system', {
                opacity: 1,
                scale: 1,
                y: 0,
                rotationY: 0,
                duration: 1.5,
                ease: "power4.out"
            }, "+=0.3")
            .to('.holo-char', {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.7)"
            }, "-=1")
            .call(() => {
                setSystemPhase(phases[4]);
                setSystemProgress(80);
            })

            // Fase 6: Sistema Final (8-10s)
            .to('.loading-system-ultra', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }, "+=0.2")
            .call(() => {
                setSystemPhase(phases[5]);
                setSystemProgress(100);
                setSystemStatus('OPERACIONAL');
            })

            // Transição final ultra suave
            .to('.ultra-professional-container', {
                opacity: 0,
                scale: 1.1,
                duration: 1,
                ease: "power3.inOut"
            }, "+=0.5");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="ultra-professional-container">
            {/* Campo Quântico de Fundo */}
            <div ref={quantumFieldRef} className="quantum-field-background">
                {createQuantumField()}
                <div className="quantum-grid-overlay"></div>
                <div className="holographic-scanlines"></div>
            </div>

            {/* Sistema de Partículas Avançado */}
            <div ref={particleSystemRef} className="advanced-particle-system">
                {createAdvancedParticleSystem()}
            </div>

            {/* Fluxos de Dados Neurais */}
            <div ref={dataStreamRef} className="neural-data-system">
                {createNeuralDataStreams()}
            </div>

            {/* Logo Holográfico Central */}
            <div ref={holoLogoRef} className="holographic-logo-container">
                {createHolographicLogo()}
            </div>

            {/* Sistema de Loading Ultra Avançado */}
            <div ref={loadingSystemRef} className="loading-system-ultra">
                <div className="system-status-display">
                    <div className="status-header">
                        <span className="status-indicator"></span>
                        <span className="status-text">SISTEMA {systemStatus}</span>
                    </div>

                    <div className="phase-display">
                        <div className="phase-text">{systemPhase}</div>
                        <div className="phase-underline"></div>
                    </div>

                    <div className="progress-system">
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${systemProgress}%` }}
                            ></div>
                            <div className="progress-glow"></div>
                        </div>
                        <div className="progress-text">
                            <span className="progress-percentage">{systemProgress}%</span>
                            <span className="progress-label">CARREGAMENTO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Efeitos Holográficos Ambientais */}
            <div className="holographic-environment">
                <div className="holo-grid-lines"></div>
                <div className="holo-corner-brackets"></div>
                <div className="holo-interference-pattern"></div>
            </div>
        </div>
    );
};

export default IntroAnimationUltraProfessional;
