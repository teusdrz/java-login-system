import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import GenerateReport from './GenerateReport';
import SystemSettings from './SystemSettings';
import UserManagement from './UserManagement';
import {
    Activity,
    Users,
    DollarSign,
    TrendingUp,
    Settings,
    Shield,
    Building2,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Command,
    Sparkles,
    Eye,
    Brain,
    Network
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Advanced Morphing Icon Component
const MorphingIcon: React.FC<{
    icons: React.ReactNode[],
    interval?: number,
    className?: string
}> = ({ icons, interval = 3000, className = "w-6 h-6" }) => {
    const iconRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useGSAP(() => {
        const element = iconRef.current;
        if (!element) return;

        const tl = gsap.timeline({ repeat: -1 });

        icons.forEach((_, index) => {
            if (index > 0) {
                tl.to(element, {
                    rotationY: 90,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => setCurrentIndex(index)
                })
                    .to(element, {
                        rotationY: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    .to({}, { duration: interval / 1000 });
            }
        });

        return () => tl.kill();
    }, [icons, interval]);

    return (
        <div ref={iconRef} className={className}>
            {icons[currentIndex]}
        </div>
    );
};

// Particle System Component
const ParticleField: React.FC<{ count?: number; color?: string }> = ({
    count = 50,
    color = "#3b82f6"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        // Create particles
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full opacity-20';
            particle.style.width = `${Math.random() * 4 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = color;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            container.appendChild(particle);

            // Animate particle
            gsap.to(particle, {
                x: `+=${Math.random() * 200 - 100}`,
                y: `+=${Math.random() * 200 - 100}`,
                duration: Math.random() * 10 + 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(particle, {
                opacity: Math.random() * 0.5 + 0.1,
                duration: Math.random() * 3 + 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }

        return () => {
            container.innerHTML = '';
        };
    }, [count, color]);

    return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
};

// Advanced Text Animation with Multiple Effects
const AdvancedAnimatedText: React.FC<{
    text: string;
    className?: string;
    delay?: number;
    effect?: 'typewriter' | 'glitch' | 'wave' | 'gradient' | 'split';
}> = ({ text, className = "", delay = 0, effect = 'typewriter' }) => {
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const element = textRef.current;
        if (!element) return;

        gsap.set(element, { opacity: 0 });

        switch (effect) {
            case 'typewriter':
                gsap.to(element, {
                    opacity: 1,
                    duration: 0.1,
                    delay,
                    onComplete: () => {
                        gsap.to(element, {
                            text: text,
                            duration: text.length * 0.05,
                            ease: "none"
                        });
                    }
                });
                break;

            case 'glitch':
                element.innerHTML = text;
                gsap.timeline({ delay })
                    .to(element, { opacity: 1, duration: 0.1 })
                    .to(element, { skewX: 10, duration: 0.1 })
                    .to(element, { skewX: -5, duration: 0.1 })
                    .to(element, { skewX: 0, duration: 0.1 });
                break;

            case 'wave':
                element.innerHTML = text.split('').map((char, i) =>
                    `<span style="display: inline-block; transform: translateY(20px); opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`
                ).join('');

                gsap.to(element, { opacity: 1, duration: 0.1, delay });
                gsap.to(element.children, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: delay + 0.1,
                    stagger: 0.05,
                    ease: "back.out(1.7)"
                });
                break;

            case 'gradient':
                element.innerHTML = text;
                element.style.background = 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ef4444)';
                element.style.webkitBackgroundClip = 'text';
                element.style.webkitTextFillColor = 'transparent';
                element.style.backgroundSize = '200% 200%';

                gsap.timeline({ delay })
                    .to(element, { opacity: 1, duration: 0.3 })
                    .to(element, {
                        backgroundPosition: '200% 200%',
                        duration: 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                break;

            case 'split':
                element.innerHTML = text.split('').map((char, i) =>
                    `<span style="display: inline-block; transform: rotateY(90deg); opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`
                ).join('');

                gsap.to(element, { opacity: 1, duration: 0.1, delay });
                gsap.to(element.children, {
                    rotateY: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: delay + 0.1,
                    stagger: 0.03,
                    ease: "power3.out"
                });
                break;
        }
    }, [text, delay, effect]);

    return <div ref={textRef} className={className}></div>;
};

// 3D Card Component with Advanced Interactions
const Advanced3DCard: React.FC<{
    children: React.ReactNode;
    delay?: number;
    className?: string;
    hoverEffect?: 'lift' | 'tilt' | 'glow' | 'morph';
    glowColor?: string;
}> = ({ children, delay = 0, className = "", hoverEffect = 'lift', glowColor = "#3b82f6" }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const card = cardRef.current;
        if (!card) return;

        // Initial animation
        gsap.fromTo(card,
            {
                y: 50,
                opacity: 0,
                rotateX: -15,
                transformPerspective: 1000
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                delay,
                ease: "power3.out"
            }
        );

        const handleMouseMove = (e: MouseEvent) => {
            if (hoverEffect !== 'tilt') return;

            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const rotateX = (e.clientY - centerY) / 10;
            const rotateY = (centerX - e.clientX) / 10;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power2.out"
            });
        };

        const handleMouseEnter = () => {
            switch (hoverEffect) {
                case 'lift':
                    gsap.to(card, {
                        y: -10,
                        scale: 1.02,
                        boxShadow: `0 20px 40px rgba(0,0,0,0.1)`,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    break;

                case 'glow':
                    gsap.to(card, {
                        boxShadow: `0 0 30px ${glowColor}40`,
                        scale: 1.01,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    break;

                case 'morph':
                    gsap.to(card, {
                        borderRadius: "20px",
                        scale: 1.03,
                        duration: 0.3,
                        ease: "back.out(1.7)"
                    });
                    break;
            }
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                duration: 0.3,
                ease: "power2.out"
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [delay, hoverEffect, glowColor]);

    return (
        <div ref={cardRef} className={`${className} cursor-pointer`}>
            {children}
        </div>
    );
};

// Holographic Data Visualization
const HolographicMetric: React.FC<{
    value: string;
    label: string;
    trend: number;
    icon: React.ReactNode;
    color: string;
    delay?: number;
}> = ({ value, label, trend, icon, color, delay = 0 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const container = containerRef.current;
        const valueElement = valueRef.current;
        if (!container || !valueElement) return;

        // Create holographic effect
        const hologramTl = gsap.timeline({ delay, repeat: -1 });

        hologramTl
            .to(container, {
                boxShadow: `inset 0 0 20px ${color}30, 0 0 20px ${color}20`,
                duration: 2,
                ease: "sine.inOut"
            })
            .to(container, {
                boxShadow: `inset 0 0 40px ${color}50, 0 0 40px ${color}30`,
                duration: 2,
                ease: "sine.inOut"
            });

        // Animate value with counting effect
        gsap.fromTo(valueElement,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                delay: delay + 0.3,
                ease: "back.out(1.7)"
            }
        );

        // Create scanning line effect
        const scanLine = document.createElement('div');
        scanLine.className = 'absolute inset-0 opacity-30';
        scanLine.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
        scanLine.style.transform = 'translateX(-100%)';
        container.appendChild(scanLine);

        gsap.to(scanLine, {
            x: '200%',
            duration: 3,
            repeat: -1,
            ease: "sine.inOut",
            delay: delay + 0.5
        });

        return () => {
            if (container.contains(scanLine)) {
                container.removeChild(scanLine);
            }
        };
    }, [value, color, delay]);

    return (
        <div ref={containerRef} className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
            <ParticleField count={15} color={color} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                        <MorphingIcon
                            icons={[icon, <Sparkles className="w-6 h-6" />, <Zap className="w-6 h-6" />]}
                            className="w-6 h-6 text-white"
                        />
                    </div>
                    <div className={`flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="text-sm font-medium ml-1">{Math.abs(trend)}%</span>
                    </div>
                </div>

                <AdvancedAnimatedText
                    text={label}
                    className="text-sm font-medium text-slate-300 mb-2"
                    delay={delay + 0.2}
                    effect="wave"
                />

                <div ref={valueRef}>
                    <AdvancedAnimatedText
                        text={value}
                        className="text-3xl font-bold text-white"
                        delay={delay + 0.4}
                        effect="gradient"
                    />
                </div>
            </div>
        </div>
    );
};

// Neural Network Background
const NeuralNetworkBG: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];
        const nodeCount = 50;

        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
                ctx.fill();

                // Draw connections
                nodes.slice(i + 1).forEach(otherNode => {
                    const distance = Math.sqrt(
                        Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
                    );

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20 z-0" />;
};

// Main Dashboard Component
const Dashboard_Business_Professional: React.FC = () => {
    const { logout } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');
    const [realTimeData, setRealTimeData] = useState({
        totalUsers: 2847,
        monthlyRevenue: 284800,
        systemPerformance: 91.8,
        operationalEfficiency: 94.2
    });

    // Enhanced color scheme
    const businessColors = {
        primary: '#1e40af',
        secondary: '#7c3aed',
        accent: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        success: '#059669',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        holographic: '#00d4ff'
    };

    // Metric cards data with enhanced styling
    const metricCards = [
        {
            id: 'users',
            title: 'Total Users',
            value: realTimeData.totalUsers.toLocaleString(),
            trend: 8.2,
            icon: <Users className="w-6 h-6" />,
            color: businessColors.primary,
            bgGradient: 'from-blue-50 to-indigo-50',
            textColor: 'text-blue-900',
            borderColor: 'border-blue-200'
        },
        {
            id: 'revenue',
            title: 'Monthly Revenue',
            value: `$${(realTimeData.monthlyRevenue / 1000).toFixed(1)}K`,
            trend: 12.5,
            icon: <DollarSign className="w-6 h-6" />,
            color: businessColors.success,
            bgGradient: 'from-green-50 to-emerald-50',
            textColor: 'text-green-900',
            borderColor: 'border-green-200'
        },
        {
            id: 'performance',
            title: 'System Performance',
            value: `${realTimeData.systemPerformance}%`,
            trend: 5.8,
            icon: <Activity className="w-6 h-6" />,
            color: businessColors.secondary,
            bgGradient: 'from-purple-50 to-violet-50',
            textColor: 'text-purple-900',
            borderColor: 'border-purple-200'
        },
        {
            id: 'efficiency',
            title: 'Operational Efficiency',
            value: `${realTimeData.operationalEfficiency}%`,
            trend: 3.2,
            icon: <TrendingUp className="w-6 h-6" />,
            color: businessColors.warning,
            bgGradient: 'from-orange-50 to-amber-50',
            textColor: 'text-orange-900',
            borderColor: 'border-orange-200'
        }
    ];

    // Real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setRealTimeData(prev => ({
                totalUsers: prev.totalUsers + Math.floor(Math.random() * 5),
                monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 1000),
                systemPerformance: Math.min(100, prev.systemPerformance + (Math.random() - 0.5) * 2),
                operationalEfficiency: Math.min(100, prev.operationalEfficiency + (Math.random() - 0.5) * 1)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (currentView === 'reports') {
        return <GenerateReport onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'settings') {
        return <SystemSettings onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'users') {
        return <UserManagement onBack={() => setCurrentView('dashboard')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            <NeuralNetworkBG />

            <div className="relative z-10 p-6 space-y-6">
                {/* Revolutionary Header */}
                <Advanced3DCard delay={0.1} hoverEffect="glow" glowColor="#3b82f6">
                    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl border border-slate-700 p-8 relative overflow-hidden">
                        <ParticleField count={30} color="#00d4ff" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-2">
                                <AdvancedAnimatedText
                                    text="Welcome back, Executive"
                                    className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-300 bg-clip-text text-transparent"
                                    delay={0.2}
                                    effect="split"
                                />
                                <AdvancedAnimatedText
                                    text="Enterprise Neural Intelligence Command Center"
                                    className="text-xl text-slate-300"
                                    delay={0.4}
                                    effect="wave"
                                />
                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-green-400 font-medium">System Optimal</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Brain className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm text-blue-400">AI Enhanced</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Network className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm text-purple-400">Neural Connected</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="text-right space-y-1">
                                    <AdvancedAnimatedText
                                        text={new Date().toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        className="text-sm text-slate-400"
                                        delay={0.6}
                                        effect="typewriter"
                                    />
                                    <AdvancedAnimatedText
                                        text={new Date().toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        className="text-2xl font-bold text-white"
                                        delay={0.8}
                                        effect="gradient"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                        <MorphingIcon
                                            icons={[
                                                <Building2 className="w-8 h-8 text-white" />,
                                                <Command className="w-8 h-8 text-white" />,
                                                <Eye className="w-8 h-8 text-white" />
                                            ]}
                                            className="w-8 h-8 text-white"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Advanced3DCard>

                {/* Revolutionary Holographic Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metricCards.map((card, index) => (
                        <Advanced3DCard key={card.id} delay={0.2 + index * 0.1} hoverEffect="morph">
                            <HolographicMetric
                                value={card.value}
                                label={card.title}
                                trend={card.trend}
                                icon={card.icon}
                                color={card.color}
                                delay={0.3 + index * 0.1}
                            />
                        </Advanced3DCard>
                    ))}
                </div>

                {/* Navigation */}
                <Advanced3DCard delay={0.8} hoverEffect="lift">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
                        <div className="flex justify-center space-x-4">
                            {[
                                { id: 'reports', label: 'Generate Reports', icon: <FileText className="w-5 h-5" /> },
                                { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
                                { id: 'users', label: 'User Management', icon: <Shield className="w-5 h-5" /> }
                            ].map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}

                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                <ArrowDownRight className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </Advanced3DCard>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard_Business_Professional;
