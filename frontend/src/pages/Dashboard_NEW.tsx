import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Role } from '../types/api';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Observer } from 'gsap/Observer';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import '../styles/dashboard-animations.css';
import {
    BarChart3, Users, Settings, Shield, UserPlus, Bell, TrendingUp,
    Activity, Wifi, CheckCircle, AlertTriangle, AlertCircle, CheckSquare,
    HardDrive, CpuIcon, MemoryStick, Network, Target,
    RefreshCw, Rocket
} from 'lucide-react';
import {
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Registrar plugins do GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin, Observer, Flip, CustomEase, MotionPathPlugin, MorphSVGPlugin, DrawSVGPlugin);

// Custom Eases para animações extraordinárias
CustomEase.create("holographic", "M0,0 C0.126,0.382 0.263,0.674 0.5,0.9 0.737,1.126 0.874,0.618 1,1");
CustomEase.create("quantum", "M0,0 C0.215,0.610 0.355,1.000 0.68,1.000 0.90,1.000 0.79,0.44 1,1");
CustomEase.create("morphic", "M0,0 C0.42,0 0.58,1 1,1");
CustomEase.create("cosmic", "M0,0 C0.25,0.46 0.45,0.94 0.69,0.99 0.83,1.01 0.97,1 1,1");

// Interfaces
interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    onlineUsers: number;
    totalSessions: number;
    avgSessionTime: string;
    systemUptime: string;
    errorRate: number;
    revenue: number;
    growth: number;
}

interface SystemMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
}

interface ActivityLog {
    id: string;
    action: string;
    user: string;
    timestamp: string;
    type: 'success' | 'warning' | 'error' | 'info';
    details: string;
    ip?: string;
}

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read: boolean;
    timestamp: string;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    life: number;
    trail: { x: number; y: number }[];
    energy: number;
    magnetic: boolean;
}

interface HolographicNode {
    id: number;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    size: number;
    color: string;
    connections: number[];
    pulse: number;
}

interface DataStream {
    id: number;
    path: { x: number; y: number }[];
    speed: number;
    color: string;
    width: number;
    progress: number;
}

interface QuantumField {
    id: number;
    amplitude: number;
    frequency: number;
    phase: number;
    decay: number;
}

interface Matrix3DNode {
    id: number;
    x: number;
    y: number;
    z: number;
    char: string;
    opacity: number;
    speed: number;
    color: string;
}

interface HolographicRing {
    id: number;
    radius: number;
    thickness: number;
    speed: number;
    color: string;
    pulse: number;
}

type ViewType = 'overview' | 'users' | 'activity' | 'analytics' | 'notifications' | 'settings';

// Mock Data
const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@admin.com',
        firstName: 'Admin',
        lastName: 'User',
        role: Role.ADMIN,
        active: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
    }
];

const mockActivityData: ActivityLog[] = [
    {
        id: '1',
        action: 'User Login',
        user: 'admin',
        timestamp: '27/08/2025, 17:05:35',
        type: 'success',
        details: 'Successful login from dashboard',
        ip: '192.168.1.100'
    },
    {
        id: '2',
        action: 'User Created',
        user: 'admin',
        timestamp: '27/08/2025, 17:00:35',
        type: 'success',
        details: 'New user account created',
        ip: '192.168.1.100'
    },
    {
        id: '3',
        action: 'Failed Login Attempt',
        user: 'unknown',
        timestamp: '27/08/2025, 16:55:35',
        type: 'warning',
        details: 'Invalid credentials provided',
        ip: '192.168.1.150'
    },
    {
        id: '4',
        action: 'System Update',
        user: 'system',
        timestamp: '27/08/2025, 16:50:35',
        type: 'info',
        details: 'System security update applied',
        ip: 'localhost'
    }
];

const mockNotificationData: NotificationItem[] = [
    {
        id: '1',
        title: 'Nova atualização disponível',
        message: 'Sistema atualizado para versão 2.1.0',
        type: 'info',
        read: false,
        timestamp: new Date().toLocaleString()
    },
    {
        id: '2',
        title: 'Backup concluído',
        message: 'Backup automático realizado com sucesso',
        type: 'success',
        read: false,
        timestamp: new Date().toLocaleString()
    }
];

const userGrowthChartData = [
    { month: 'Jan', users: 120, revenue: 12500, sessions: 450 },
    { month: 'Fev', users: 150, revenue: 18200, sessions: 620 },
    { month: 'Mar', users: 180, revenue: 22800, sessions: 780 },
    { month: 'Abr', users: 200, revenue: 28500, sessions: 920 },
    { month: 'Mai', users: 250, revenue: 35600, sessions: 1150 },
    { month: 'Jun', users: 300, revenue: 45890, sessions: 1420 }
];

const roleDistributionChartData = [
    { name: 'Usuários', value: 50, color: '#3B82F6' },
    { name: 'Moderadores', value: 25, color: '#10B981' },
    { name: 'Admins', value: 25, color: '#F59E0B' }
];

const networkAnalyticsChartData = [
    { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
    { subject: 'Segurança', A: 98, B: 130, fullMark: 150 },
    { subject: 'Usabilidade', A: 86, B: 130, fullMark: 150 },
    { subject: 'Escalabilidade', A: 99, B: 100, fullMark: 150 },
    { subject: 'Confiabilidade', A: 85, B: 90, fullMark: 150 },
    { subject: 'Manutenibilidade', A: 65, B: 85, fullMark: 150 }
];

// Helper Functions
const getActivityIcon = (type: ActivityLog['type']): React.ReactElement => {
    switch (type) {
        case 'success':
            return <CheckCircle className="h-5 w-5" />;
        case 'warning':
            return <AlertTriangle className="h-5 w-5" />;
        case 'error':
            return <AlertCircle className="h-5 w-5" />;
        case 'info':
        default:
            return <CheckSquare className="h-5 w-5" />;
    }
};

const generateParticles = (count: number): Particle[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'][Math.floor(Math.random() * 6)],
        life: Math.random() * 100 + 50,
        trail: [],
        energy: Math.random() * 100 + 50,
        magnetic: Math.random() > 0.7
    }));
};

// Componente principal do Dashboard
const Dashboard: React.FC = () => {
    const { state } = useAuth();
    const { user } = state;

    // Refs para animações GSAP
    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const statsCardsRef = useRef<HTMLDivElement>(null);
    const chartsRef = useRef<HTMLDivElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);
    const metricsRef = useRef<HTMLDivElement>(null);

    // Estados
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 1247,
        activeUsers: 892,
        newUsersToday: 23,
        onlineUsers: 156,
        totalSessions: 3245,
        avgSessionTime: '24m',
        systemUptime: '15d 8h 32m',
        errorRate: 2.1,
        revenue: 45890,
        growth: 12.5
    });
    const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
        cpu: 64.11,
        memory: 66.48,
        disk: 35.33,
        network: 24.81
    });
    const [notifications] = useState<NotificationItem[]>(mockNotificationData);
    const [realTimeUpdates, setRealTimeUpdates] = useState(true);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [holographicMode, setHolographicMode] = useState(false);
    const [quantumEffects, setQuantumEffects] = useState(true);
    const [neuralNetwork, setNeuralNetwork] = useState(true);
    const [dataVisualization, setDataVisualization] = useState('3d');
    const [energyField, setEnergyField] = useState(100);
    const [matrixMode, setMatrixMode] = useState(false);
    const [cosmicField, setCosmicField] = useState(75);
    const [dimensionalShift, setDimensionalShift] = useState(0);
    const [alert, setAlert] = useState<{
        show: boolean;
        title: string;
        message: string;
        type: 'warning' | 'critical' | 'info';
    }>({
        show: false,
        title: '',
        message: '',
        type: 'info'
    });

    // Sistema de partículas extraordinário
    useEffect(() => {
        setParticles(generateParticles(quantumEffects ? 80 : 50));
    }, [quantumEffects]);

    // Animação do sistema de partículas avançado
    useGSAP(() => {
        if (particleCanvasRef.current && particles.length > 0) {
            const canvas = particleCanvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            let animationFrame: number;

            const animateParticles = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Efeito de campo quântico de fundo
                if (quantumEffects) {
                    const gradient = ctx.createRadialGradient(
                        canvas.width / 2, canvas.height / 2, 0,
                        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
                    );
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.02)');
                    gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.01)');
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                particles.forEach((particle, index) => {
                    // Atualizar trilha
                    particle.trail.push({ x: particle.x, y: particle.y });
                    if (particle.trail.length > 10) {
                        particle.trail.shift();
                    }

                    // Física magnética para partículas especiais
                    if (particle.magnetic) {
                        particles.forEach((otherParticle, otherIndex) => {
                            if (index !== otherIndex) {
                                const dx = otherParticle.x - particle.x;
                                const dy = otherParticle.y - particle.y;
                                const distance = Math.sqrt(dx * dx + dy * dy);

                                if (distance < 200 && distance > 0) {
                                    const force = particle.energy / (distance * distance) * 0.001;
                                    particle.vx += (dx / distance) * force;
                                    particle.vy += (dy / distance) * force;
                                }
                            }
                        });
                    }

                    // Atualizar posição
                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // Bordas com efeito portal
                    if (particle.x < 0) {
                        particle.x = canvas.width;
                        particle.trail = [];
                    }
                    if (particle.x > canvas.width) {
                        particle.x = 0;
                        particle.trail = [];
                    }
                    if (particle.y < 0) {
                        particle.y = canvas.height;
                        particle.trail = [];
                    }
                    if (particle.y > canvas.height) {
                        particle.y = 0;
                        particle.trail = [];
                    }

                    // Desenhar trilha
                    if (particle.trail.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(particle.trail[0].x, particle.trail[0].y);

                        for (let i = 1; i < particle.trail.length; i++) {
                            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                        }

                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = particle.opacity * 0.3;
                        ctx.lineWidth = particle.size * 0.5;
                        ctx.stroke();
                    }

                    // Desenhar partícula com efeito holográfico
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

                    // Gradiente holográfico
                    const particleGradient = ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size * 2
                    );
                    particleGradient.addColorStop(0, particle.color);
                    particleGradient.addColorStop(0.7, particle.color + '80');
                    particleGradient.addColorStop(1, 'transparent');

                    ctx.fillStyle = particleGradient;
                    ctx.globalAlpha = particle.opacity;
                    ctx.fill();

                    // Anel de energia para partículas magnéticas
                    if (particle.magnetic) {
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = particle.opacity * 0.2;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }

                    // Conexões neurais
                    if (neuralNetwork) {
                        particles.forEach((otherParticle, otherIndex) => {
                            if (index !== otherIndex) {
                                const dx = particle.x - otherParticle.x;
                                const dy = particle.y - otherParticle.y;
                                const distance = Math.sqrt(dx * dx + dy * dy);

                                if (distance < 150) {
                                    ctx.beginPath();
                                    ctx.moveTo(particle.x, particle.y);
                                    ctx.lineTo(otherParticle.x, otherParticle.y);

                                    const connectionOpacity = (150 - distance) / 150 * 0.3;
                                    ctx.strokeStyle = particle.color;
                                    ctx.globalAlpha = connectionOpacity;
                                    ctx.lineWidth = 0.5;
                                    ctx.stroke();

                                    // Pulso de dados
                                    const progress = (Date.now() * 0.005) % 1;
                                    const pulseX = particle.x + (otherParticle.x - particle.x) * progress;
                                    const pulseY = particle.y + (otherParticle.y - particle.y) * progress;

                                    ctx.beginPath();
                                    ctx.arc(pulseX, pulseY, 1, 0, Math.PI * 2);
                                    ctx.fillStyle = '#ffffff';
                                    ctx.globalAlpha = connectionOpacity * 2;
                                    ctx.fill();
                                }
                            }
                        });
                    }

                    // Diminuir energia
                    particle.energy *= 0.999;
                    if (particle.energy < 10) {
                        particle.energy = Math.random() * 100 + 50;
                    }
                });

                animationFrame = requestAnimationFrame(animateParticles);
            };

            animateParticles();

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        }
    }, [particles, quantumEffects, neuralNetwork]);

    // Animações extraordinárias de entrada
    useGSAP(() => {
        if (containerRef.current && !loading) {
            gsap.set([sidebarRef.current, mainContentRef.current], {
                opacity: 0,
                scale: 0.8,
                rotationY: -30,
                filter: "blur(20px)",
                transformPerspective: 1000
            });

            const masterTimeline = gsap.timeline();

            // Entrada com efeito holográfico
            masterTimeline
                .to(sidebarRef.current, {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    filter: "blur(0px)",
                    duration: 2,
                    ease: "holographic"
                })
                .to(sidebarRef.current, {
                    boxShadow: "0 0 60px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.2)",
                    duration: 1.5,
                    ease: "power2.out"
                }, "-=1")
                .to(mainContentRef.current, {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    filter: "blur(0px)",
                    duration: 1.8,
                    ease: "quantum"
                }, "-=1.5");

            // Respiração holográfica contínua
            gsap.to(sidebarRef.current, {
                scale: 1.02,
                boxShadow: "0 0 80px rgba(59, 130, 246, 0.8), inset 0 0 30px rgba(147, 51, 234, 0.3)",
                duration: 4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });

            // Efeito de aurora no fundo
            gsap.to(mainContentRef.current, {
                background: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 50%, transparent 100%)",
                duration: 6,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }, [loading]);

    // Animação dos cartões com física avançada
    useGSAP(() => {
        if (statsCardsRef.current && currentView === 'overview') {
            const cards = Array.from(statsCardsRef.current.children);

            gsap.set(cards, {
                opacity: 0,
                y: 200,
                rotationX: -60,
                scale: 0.3,
                filter: "blur(25px)",
                transformPerspective: 1000
            });

            gsap.to(cards, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 2,
                stagger: {
                    amount: 1.5,
                    ease: "power4.out",
                    from: "random"
                },
                ease: "elastic.out(1, 0.8)"
            });

            // Levitação e rotação orbital
            cards.forEach((card, index) => {
                gsap.to(card, {
                    y: Math.sin(index * 0.8) * 12,
                    rotationY: Math.cos(index * 0.5) * 3,
                    rotationX: Math.sin(index * 0.3) * 2,
                    duration: 4 + (index * 0.5),
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.2
                });

                // Aura energética pulsante
                gsap.to(card, {
                    boxShadow: `0 20px 50px rgba(${59 + index * 30}, ${130 + index * 25}, 246, ${0.3 + index * 0.1}),
                               0 0 30px rgba(${147 + index * 20}, ${51 + index * 30}, 234, ${0.2 + index * 0.05}),
                               inset 0 1px 20px rgba(255, 255, 255, ${0.1 + index * 0.02})`,
                    duration: 3 + (index * 0.3),
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            });
        }
    }, [currentView]);

    // Navegação items com ícones 3D
    const navigationItems = [
        { id: 'overview', label: 'Dashboard', icon: BarChart3, color: '#3B82F6' },
        { id: 'users', label: 'Usuários', icon: Users, color: '#10B981' },
        { id: 'activity', label: 'Atividade', icon: Activity, color: '#F59E0B' },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: '#8B5CF6' },
        { id: 'notifications', label: 'Notificações', icon: Bell, color: '#EF4444' },
        { id: 'settings', label: 'Configurações', icon: Settings, color: '#6B7280' }
    ];

    // Carregamento de dados
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    // Atualização em tempo real das métricas com efeitos extraordinários
    useEffect(() => {
        if (!realTimeUpdates) return;

        const interval = setInterval(() => {
            setSystemMetrics(prev => {
                const newMetrics = {
                    cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
                    memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
                    disk: Math.max(10, Math.min(80, prev.disk + (Math.random() - 0.5) * 5)),
                    network: Math.max(5, Math.min(60, prev.network + (Math.random() - 0.5) * 15))
                };

                // Atualizar campo de energia baseado nas métricas
                const avgMetric = Object.values(newMetrics).reduce((a, b) => a + b, 0) / 4;
                setEnergyField(Math.round(100 - avgMetric + Math.random() * 20));

                // Verificar valores críticos e mostrar alertas
                Object.entries(newMetrics).forEach(([key, value]) => {
                    if (value > 85 && Math.random() > 0.8) {
                        setAlert({
                            show: true,
                            title: 'Alerta Crítico do Sistema',
                            message: `${key.toUpperCase()} atingiu ${value.toFixed(1)}% de utilização. Verificação necessária.`,
                            type: 'critical'
                        });
                    } else if (value > 70 && Math.random() > 0.9) {
                        setAlert({
                            show: true,
                            title: 'Aviso de Performance',
                            message: `${key.toUpperCase()} está em ${value.toFixed(1)}% de utilização.`,
                            type: 'warning'
                        });
                    }
                });

                return newMetrics;
            });

            // Atualizar estatísticas com flutuações realistas
            setStats(prev => ({
                ...prev,
                onlineUsers: Math.max(100, Math.min(200, prev.onlineUsers + Math.round((Math.random() - 0.5) * 10))),
                activeUsers: Math.max(800, Math.min(950, prev.activeUsers + Math.round((Math.random() - 0.5) * 20))),
                totalSessions: prev.totalSessions + Math.round(Math.random() * 5),
                errorRate: Math.max(0.1, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5))
            }));

            // Regenerar algumas partículas para efeito dinâmico
            if (quantumEffects && Math.random() > 0.7) {
                setParticles(prev => {
                    const newParticles = [...prev];
                    const randomIndex = Math.floor(Math.random() * newParticles.length);
                    newParticles[randomIndex] = {
                        ...newParticles[randomIndex],
                        energy: Math.random() * 100 + 50,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'][Math.floor(Math.random() * 6)]
                    };
                    return newParticles;
                });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [realTimeUpdates, quantumEffects, setStats, setEnergyField]);

    const handleViewChange = (view: ViewType) => {
        if (view === currentView) return;

        // Animação de transição
        gsap.to(mainContentRef.current, {
            opacity: 0,
            scale: 0.9,
            rotationY: 20,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                setCurrentView(view);
                gsap.to(mainContentRef.current, {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                });
            }
        });
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900 flex relative overflow-hidden">
            {/* Canvas de partículas */}
            <canvas
                ref={particleCanvasRef}
                className="absolute inset-0 pointer-events-none z-0"
                style={{ mixBlendMode: 'screen' }}
            />

            {/* Efeito Matrix 3D */}
            <Matrix3DEffect active={matrixMode} intensity={cosmicField} />

            {/* Anéis Cósmicos Holográficos */}
            <CosmicRings active={holographicMode} energy={energyField} />

            {/* Portal Dimensional */}
            <DimensionalPortal active={dimensionalShift > 50} shift={dimensionalShift} />

            {/* Alerta Holográfico */}
            <HolographicAlert
                show={alert.show}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
            />

            {/* Sidebar com efeitos holográficos */}
            <div ref={sidebarRef} className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl relative z-10">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                            <Shield className="w-7 h-7 text-white z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AdminPanel
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sistema de Gestão</p>
                        </div>
                    </div>
                </div>

                <nav className="mt-6">
                    <div className="px-3 space-y-2">
                        {navigationItems.map((item, index) => (
                            <NavigationItem
                                key={item.id}
                                item={item}
                                index={index}
                                isActive={currentView === item.id}
                                onClick={() => handleViewChange(item.id as ViewType)}
                                notificationCount={item.id === 'notifications' ? notifications.filter(n => !n.read).length : 0}
                            />
                        ))}
                    </div>
                </nav>

                {/* Informações do usuário */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                <main ref={mainContentRef} className="flex-1 overflow-y-auto p-8">
                    {currentView === 'overview' && (
                        <OverviewSection
                            stats={stats}
                            systemMetrics={systemMetrics}
                            userGrowthData={userGrowthChartData}
                            roleDistributionData={roleDistributionChartData}
                            networkAnalyticsData={networkAnalyticsChartData}
                            recentActivity={mockActivityData.slice(0, 4)}
                            statsCardsRef={statsCardsRef}
                            chartsRef={chartsRef}
                            metricsRef={metricsRef}
                            realTimeUpdates={realTimeUpdates}
                            onToggleRealTime={() => setRealTimeUpdates(!realTimeUpdates)}
                            quantumEffects={quantumEffects}
                            setQuantumEffects={setQuantumEffects}
                            neuralNetwork={neuralNetwork}
                            setNeuralNetwork={setNeuralNetwork}
                            holographicMode={holographicMode}
                            setHolographicMode={setHolographicMode}
                            energyField={energyField}
                            setEnergyField={setEnergyField}
                            dataVisualization={dataVisualization}
                            setDataVisualization={setDataVisualization}
                            matrixMode={matrixMode}
                            setMatrixMode={setMatrixMode}
                            cosmicField={cosmicField}
                            setCosmicField={setCosmicField}
                            dimensionalShift={dimensionalShift}
                            setDimensionalShift={setDimensionalShift}
                        />
                    )}

                    {currentView !== 'overview' && (
                        <ComingSoonSection
                            view={currentView}
                            navigationItems={navigationItems}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

// Componente Matrix 3D Extraordinário
const Matrix3DEffect: React.FC<{ active: boolean; intensity: number }> = ({ active, intensity }) => {
    const matrixRef = useRef<HTMLCanvasElement>(null);
    const nodesRef = useRef<Matrix3DNode[]>([]);

    useGSAP(() => {
        if (matrixRef.current && active) {
            const canvas = matrixRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Gerar caracteres da matrix
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|\\:";\'<>?,./`~';
            const columns = Math.floor(canvas.width / 20);

            // Inicializar nós 3D
            nodesRef.current = Array.from({ length: columns * 30 }, (_, i) => ({
                id: i,
                x: (i % columns) * 20,
                y: Math.random() * canvas.height,
                z: Math.random() * 100,
                char: chars[Math.floor(Math.random() * chars.length)],
                opacity: Math.random(),
                speed: Math.random() * 3 + 1,
                color: ['#00ff00', '#00dd00', '#00bb00', '#009900'][Math.floor(Math.random() * 4)]
            }));

            let animationFrame: number;

            const animate = () => {
                // Fundo semi-transparente para efeito de trail
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                nodesRef.current.forEach(node => {
                    // Movimento 3D simulado
                    node.y += node.speed * (intensity / 50);
                    node.z = Math.sin(Date.now() * 0.001 + node.id * 0.1) * 50 + 50;

                    // Resetar quando sair da tela
                    if (node.y > canvas.height + 20) {
                        node.y = -20;
                        node.char = chars[Math.floor(Math.random() * chars.length)];
                    }

                    // Calcular tamanho baseado na profundidade Z
                    const scale = node.z / 100;
                    const fontSize = 12 + (scale * 8);

                    // Desenhar caractere
                    ctx.font = `${fontSize}px 'Courier New', monospace`;
                    ctx.fillStyle = node.color;
                    ctx.globalAlpha = node.opacity * scale * (intensity / 100);

                    // Efeito 3D com sombra
                    ctx.shadowColor = node.color;
                    ctx.shadowBlur = scale * 10;
                    ctx.fillText(node.char, node.x + (50 - node.z) * 0.5, node.y);

                    // Resetar sombra
                    ctx.shadowBlur = 0;

                    // Variação aleatória do caractere
                    if (Math.random() > 0.98) {
                        node.char = chars[Math.floor(Math.random() * chars.length)];
                    }
                });

                animationFrame = requestAnimationFrame(animate);
            };

            animate();

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        }
    }, [active, intensity]);

    if (!active) return null;

    return (
        <canvas
            ref={matrixRef}
            className="absolute inset-0 pointer-events-none z-5"
            style={{
                mixBlendMode: 'screen',
                opacity: intensity / 100
            }}
        />
    );
};

// Componente de Anéis Holográficos Cósmicos
const CosmicRings: React.FC<{ active: boolean; energy: number }> = ({ active, energy }) => {
    const ringsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (ringsRef.current && active) {
            const rings = Array.from(ringsRef.current.children);

            rings.forEach((ring, index) => {
                const radius = 100 + (index * 80);
                const speed = 1 + (index * 0.3);

                // Rotação orbital
                gsap.to(ring, {
                    rotation: 360,
                    duration: 20 / speed,
                    ease: "none",
                    repeat: -1
                });

                // Pulsação baseada na energia
                gsap.to(ring, {
                    scale: 1 + (energy / 1000) + (Math.sin(index) * 0.1),
                    duration: 3 + index,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });

                // Efeito holográfico
                gsap.to(ring, {
                    opacity: 0.3 + (energy / 200),
                    duration: 2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: index * 0.5
                });
            });
        }
    }, [active, energy]);

    if (!active) return null;

    return (
        <div ref={ringsRef} className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            {Array.from({ length: 5 }, (_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full border-2"
                    style={{
                        width: `${200 + i * 160}px`,
                        height: `${200 + i * 160}px`,
                        borderColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][i],
                        borderStyle: 'dashed',
                        opacity: 0.3
                    }}
                />
            ))}

            {/* Centro energético */}
            <div
                className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500"
                style={{
                    boxShadow: `0 0 ${energy}px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(147, 51, 234, 0.6)`,
                    filter: `blur(${energy / 50}px)`
                }}
            />
        </div>
    );
};

// Componente de Portal Dimensional
const DimensionalPortal: React.FC<{ active: boolean; shift: number }> = ({ active, shift }) => {
    const portalRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (portalRef.current && active) {
            // Rotação dimensional
            gsap.to(portalRef.current, {
                rotationY: 360 + shift,
                rotationX: shift * 0.5,
                duration: 10,
                ease: "none",
                repeat: -1
            });

            // Distorção espacial
            gsap.to(portalRef.current, {
                scale: 1 + (shift / 500),
                filter: `hue-rotate(${shift * 2}deg) blur(${shift / 20}px)`,
                duration: 5,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }, [active, shift]);

    if (!active) return null;

    return (
        <div
            ref={portalRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            style={{ perspective: '1000px' }}
        >
            <div className="relative w-32 h-32">
                {/* Anéis dimensionais */}
                {Array.from({ length: 8 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 rounded-full border"
                        style={{
                            borderColor: `hsl(${(shift + i * 45) % 360}, 70%, 60%)`,
                            borderWidth: '2px',
                            transform: `scale(${1 - i * 0.1}) rotateZ(${i * 45}deg)`,
                            opacity: 0.7 - i * 0.08,
                            animation: `spin ${20 - i * 2}s linear infinite ${i % 2 === 0 ? 'reverse' : ''}`
                        }}
                    />
                ))}

                {/* Centro do portal */}
                <div
                    className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400"
                    style={{
                        boxShadow: `0 0 ${20 + shift / 5}px rgba(147, 51, 234, 0.8), inset 0 0 ${10 + shift / 10}px rgba(59, 130, 246, 0.6)`,
                        filter: `saturate(${1 + shift / 100})`
                    }}
                />
            </div>
        </div>
    );
};

// Componente de Alerta Holográfico
const HolographicAlert: React.FC<{
    show: boolean;
    title: string;
    message: string;
    type: 'warning' | 'critical' | 'info';
    onClose: () => void;
}> = ({ show, title, message, type, onClose }) => {
    const alertRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (alertRef.current && show) {
            gsap.fromTo(alertRef.current,
                {
                    opacity: 0,
                    scale: 0.3,
                    rotationY: 180,
                    filter: "blur(20px)",
                    transformPerspective: 1000
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    filter: "blur(0px)",
                    duration: 1.5,
                    ease: "elastic.out(1, 0.8)"
                }
            );

            // Efeito de pulsação
            gsap.to(alertRef.current, {
                scale: 1.02,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });

            // Auto-fechar após 10 segundos
            gsap.delayedCall(10, onClose);
        }
    }, [show]);

    if (!show) return null;

    const getTypeColor = () => {
        switch (type) {
            case 'warning': return 'from-yellow-500 to-orange-500';
            case 'critical': return 'from-red-500 to-pink-500';
            default: return 'from-blue-500 to-purple-500';
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'warning': return <AlertTriangle className="h-6 w-6" />;
            case 'critical': return <AlertCircle className="h-6 w-6" />;
            default: return <CheckCircle className="h-6 w-6" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div
                ref={alertRef}
                className="relative max-w-md w-full mx-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            >
                {/* Gradiente holográfico de fundo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor()} opacity-10`} />

                {/* Efeito de shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />

                <div className="relative p-6">
                    <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getTypeColor()} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                            {getTypeIcon()}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {message}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <AlertCircle className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className={`px-4 py-2 bg-gradient-to-r ${getTypeColor()} text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Rede Neural Holográfica 3D
const NeuralNetworkVisualizer: React.FC<{
    active: boolean;
    dataVisualization: string;
    stats: DashboardStats;
}> = ({ active, dataVisualization, stats }) => {
    const networkRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<HTMLDivElement[]>([]);
    const [nodes, setNodes] = useState<HolographicNode[]>([]);

    // Gerar nós da rede neural
    useEffect(() => {
        if (active) {
            const newNodes: HolographicNode[] = Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: Math.random() * 400,
                y: Math.random() * 400,
                z: Math.random() * 200,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                vz: (Math.random() - 0.5) * 1,
                size: Math.random() * 20 + 10,
                color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)],
                connections: [],
                pulse: Math.random()
            }));

            // Criar conexões entre nós próximos
            newNodes.forEach((node, index) => {
                newNodes.forEach((otherNode, otherIndex) => {
                    if (index !== otherIndex) {
                        const distance = Math.sqrt(
                            Math.pow(node.x - otherNode.x, 2) +
                            Math.pow(node.y - otherNode.y, 2) +
                            Math.pow(node.z - otherNode.z, 2)
                        );
                        if (distance < 150 && node.connections.length < 3) {
                            node.connections.push(otherNode.id);
                        }
                    }
                });
            });

            setNodes(newNodes);
        }
    }, [active]);

    // Animações 3D da rede neural
    useGSAP(() => {
        if (networkRef.current && nodes.length > 0 && nodesRef.current.length > 0) {
            nodes.forEach((node, index) => {
                const nodeElement = nodesRef.current[index];
                if (nodeElement) {
                    // Movimento flutuante 3D
                    gsap.set(nodeElement, {
                        x: node.x,
                        y: node.y,
                        z: node.z,
                        transformPerspective: 1000,
                        transformStyle: "preserve-3d"
                    });

                    // Animação orbital complexa
                    gsap.to(nodeElement, {
                        x: node.x + Math.sin(Date.now() * 0.001 + index) * 30,
                        y: node.y + Math.cos(Date.now() * 0.001 + index) * 30,
                        z: node.z + Math.sin(Date.now() * 0.0005 + index) * 50,
                        rotationX: 360,
                        rotationY: 360,
                        duration: 10 + index,
                        ease: "none",
                        repeat: -1
                    });

                    // Pulsação baseada em dados
                    const intensity = (stats.activeUsers / stats.totalUsers) * 100;
                    gsap.to(nodeElement, {
                        scale: 1 + (intensity / 1000) + Math.sin(Date.now() * 0.002 + index) * 0.3,
                        duration: 2 + (index * 0.1),
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1
                    });

                    // Efeito holográfico
                    gsap.to(nodeElement, {
                        boxShadow: `0 0 ${20 + intensity}px ${node.color}, inset 0 0 ${10 + intensity * 0.2}px rgba(255,255,255,0.3)`,
                        duration: 3,
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1
                    });
                }
            });
        }
    }, [nodes, stats]);

    if (!active) return null;

    return (
        <div
            ref={networkRef}
            className="relative w-full h-96 bg-black/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-cyan-500/30"
            style={{
                perspective: '1000px',
                background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 50%, transparent 100%)'
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Nós da rede neural */}
                    {nodes.map((node, index) => (
                        <div
                            key={node.id}
                            ref={(el) => {
                                if (el) nodesRef.current[index] = el;
                            }}
                            className="absolute rounded-full border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold"
                            style={{
                                width: `${node.size}px`,
                                height: `${node.size}px`,
                                background: `linear-gradient(135deg, ${node.color}80, ${node.color}40)`,
                                left: '0px',
                                top: '0px',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {node.id}
                        </div>
                    ))}

                    {/* Conexões entre nós */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: 'screen' }}>
                        <defs>
                            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                                <stop offset="50%" stopColor="rgba(147, 51, 234, 0.6)" />
                                <stop offset="100%" stopColor="rgba(6, 182, 212, 0.8)" />
                            </linearGradient>
                        </defs>
                        {nodes.map((node) =>
                            node.connections.map((connectionId) => {
                                const targetNode = nodes.find(n => n.id === connectionId);
                                if (!targetNode) return null;

                                return (
                                    <line
                                        key={`${node.id}-${connectionId}`}
                                        x1={node.x + node.size / 2}
                                        y1={node.y + node.size / 2}
                                        x2={targetNode.x + targetNode.size / 2}
                                        y2={targetNode.y + targetNode.size / 2}
                                        stroke="url(#neuralGradient)"
                                        strokeWidth="2"
                                        opacity="0.6"
                                        className="animate-pulse"
                                    />
                                );
                            })
                        )}
                    </svg>

                    {/* Pulsos de dados */}
                    <div className="absolute inset-0">
                        {nodes.slice(0, 5).map((node, index) => (
                            <div
                                key={`pulse-${node.id}`}
                                className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                                style={{
                                    left: `${node.x}px`,
                                    top: `${node.y}px`,
                                    animation: `pulse 2s infinite ${index * 0.4}s`,
                                    boxShadow: '0 0 10px #ffffff'
                                }}
                            />
                        ))}
                    </div>

                    {/* Grade holográfica de fundo */}
                    <div className="absolute inset-0 opacity-20">
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={`grid-h-${i}`}
                                className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                                style={{ top: `${i * 10}%` }}
                            />
                        ))}
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={`grid-v-${i}`}
                                className="absolute h-full w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
                                style={{ left: `${i * 10}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Labels informativos */}
            <div className="absolute top-4 left-4 text-white">
                <h4 className="text-sm font-semibold mb-1">Neural Network Active</h4>
                <p className="text-xs text-cyan-300">Nodes: {nodes.length} | Connections: {nodes.reduce((acc, node) => acc + node.connections.length, 0)}</p>
                <p className="text-xs text-cyan-300">Mode: {dataVisualization.toUpperCase()}</p>
            </div>

            {/* Indicador de atividade */}
            <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            </div>
        </div>
    );
};

// Componente de Stream de Dados em Tempo Real
const DataStreamVisualizer: React.FC<{
    metrics: SystemMetrics;
    realTimeUpdates: boolean;
}> = ({ metrics, realTimeUpdates }) => {
    const streamRef = useRef<HTMLCanvasElement>(null);
    const [streams, setStreams] = useState<DataStream[]>([]);

    useEffect(() => {
        if (realTimeUpdates) {
            const newStreams: DataStream[] = Array.from({ length: 4 }, (_, i) => ({
                id: i,
                path: [],
                speed: Math.random() * 3 + 1,
                color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i],
                width: Math.random() * 3 + 2,
                progress: 0
            }));

            // Gerar caminhos curvos para os streams
            newStreams.forEach(stream => {
                const points = 20;
                for (let j = 0; j <= points; j++) {
                    const progress = j / points;
                    const x = progress * 400;
                    const y = 200 + Math.sin(progress * Math.PI * 2 + stream.id) * 50;
                    stream.path.push({ x, y });
                }
            });

            setStreams(newStreams);
        }
    }, [realTimeUpdates, metrics]);

    useGSAP(() => {
        if (streamRef.current && streams.length > 0) {
            const canvas = streamRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = 400;
            canvas.height = 400;

            let animationFrame: number;

            const animateStreams = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                streams.forEach((stream, index) => {
                    const metricValue = Object.values(metrics)[index] || 50;

                    // Atualizar progresso baseado na métrica
                    stream.progress = (stream.progress + stream.speed * (metricValue / 100)) % stream.path.length;

                    // Desenhar o caminho
                    ctx.beginPath();
                    ctx.strokeStyle = stream.color + '40';
                    ctx.lineWidth = stream.width;
                    ctx.lineCap = 'round';

                    if (stream.path.length > 1) {
                        ctx.moveTo(stream.path[0].x, stream.path[0].y);
                        for (let i = 1; i < stream.path.length; i++) {
                            ctx.lineTo(stream.path[i].x, stream.path[i].y);
                        }
                        ctx.stroke();
                    }

                    // Desenhar partícula em movimento
                    const currentIndex = Math.floor(stream.progress);
                    const nextIndex = (currentIndex + 1) % stream.path.length;
                    const localProgress = stream.progress - currentIndex;

                    if (stream.path[currentIndex] && stream.path[nextIndex]) {
                        const currentPoint = stream.path[currentIndex];
                        const nextPoint = stream.path[nextIndex];

                        const x = currentPoint.x + (nextPoint.x - currentPoint.x) * localProgress;
                        const y = currentPoint.y + (nextPoint.y - currentPoint.y) * localProgress;

                        // Partícula principal
                        ctx.beginPath();
                        ctx.arc(x, y, stream.width * 2, 0, Math.PI * 2);
                        ctx.fillStyle = stream.color;
                        ctx.fill();

                        // Aura da partícula
                        ctx.beginPath();
                        ctx.arc(x, y, stream.width * 4, 0, Math.PI * 2);
                        ctx.fillStyle = stream.color + '30';
                        ctx.fill();

                        // Trilha
                        for (let j = 1; j <= 5; j++) {
                            const trailIndex = Math.max(0, currentIndex - j);
                            const trailPoint = stream.path[trailIndex];
                            if (trailPoint) {
                                ctx.beginPath();
                                ctx.arc(trailPoint.x, trailPoint.y, stream.width * (1 - j * 0.2), 0, Math.PI * 2);
                                ctx.fillStyle = stream.color + Math.floor((1 - j * 0.2) * 255).toString(16).padStart(2, '0');
                                ctx.fill();
                            }
                        }
                    }
                });

                animationFrame = requestAnimationFrame(animateStreams);
            };

            animateStreams();

            return () => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        }
    }, [streams, metrics]);

    return (
        <div className="relative bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
            <h4 className="text-white text-sm font-semibold mb-2">Data Streams</h4>
            <canvas
                ref={streamRef}
                className="w-full max-w-sm mx-auto"
                style={{ filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))' }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>CPU</span>
                <span>Memory</span>
                <span>Disk</span>
                <span>Network</span>
            </div>
        </div>
    );
};

// Componente de Visualização 3D Extraordinária
const Metrics3DVisualizer: React.FC<{ metrics: SystemMetrics; energyField: number }> = ({ metrics, energyField }) => {
    const visualizerRef = useRef<HTMLDivElement>(null);
    const sphereRefs = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        if (visualizerRef.current && sphereRefs.current.length > 0) {
            const spheres = sphereRefs.current;
            const metricsValues = Object.values(metrics);

            // Animação orbital das esferas de métricas
            spheres.forEach((sphere, index) => {
                const radius = 80 + (index * 20);
                const speed = 1 + (index * 0.3);
                const value = metricsValues[index];

                gsap.set(sphere, {
                    transformPerspective: 1000,
                    transformOrigin: "center center"
                });

                // Órbita circular
                gsap.to(sphere, {
                    rotation: 360,
                    duration: 10 / speed,
                    ease: "none",
                    repeat: -1,
                    motionPath: {
                        path: `M0,0 A${radius},${radius} 0 1,1 0,1 A${radius},${radius} 0 1,1 0,0`,
                        autoRotate: false
                    }
                });

                // Pulsação baseada no valor da métrica
                gsap.to(sphere, {
                    scale: 1 + (value / 100) * 0.5,
                    duration: 2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });

                // Rotação 3D
                gsap.to(sphere, {
                    rotationY: 360,
                    rotationX: 180,
                    duration: 8 + (index * 2),
                    ease: "none",
                    repeat: -1
                });

                // Efeito holográfico
                gsap.to(sphere, {
                    boxShadow: `0 0 ${20 + value}px rgba(${59 + index * 40}, ${130 + index * 30}, 246, 0.8),
                               inset 0 0 ${10 + value * 0.3}px rgba(147, 51, 234, 0.6)`,
                    duration: 3,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1
                });
            });

            // Efeito de energia central
            gsap.to(visualizerRef.current, {
                background: `radial-gradient(circle, 
                    rgba(59, 130, 246, ${energyField / 1000}) 0%, 
                    rgba(147, 51, 234, ${energyField / 2000}) 30%, 
                    transparent 70%)`,
                duration: 4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }, [metrics, energyField]);

    const getMetricColor = (index: number) => {
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
        return colors[index] || '#6B7280';
    };

    const getMetricLabel = (index: number) => {
        const labels = ['CPU', 'Memory', 'Disk', 'Network'];
        return labels[index] || 'Unknown';
    };

    return (
        <div
            ref={visualizerRef}
            className="relative w-80 h-80 mx-auto rounded-full border-2 border-white/20 backdrop-blur-xl overflow-hidden"
            style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 50%, transparent 100%)'
            }}
        >
            {/* Centro de energia */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-full shadow-2xl">
                <div className="absolute inset-2 bg-white/10 rounded-full backdrop-blur-sm" />
                <div className="absolute inset-4 bg-white/20 rounded-full animate-pulse" />
            </div>

            {/* Esferas de métricas */}
            {Object.values(metrics).map((value, index) => (
                <div
                    key={index}
                    ref={(el) => {
                        if (el) sphereRefs.current[index] = el;
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: '24px',
                        height: '24px',
                        background: `linear-gradient(135deg, ${getMetricColor(index)} 0%, ${getMetricColor(index)}80 100%)`,
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {getMetricLabel(index)}: {value.toFixed(1)}%
                    </div>
                </div>
            ))}

            {/* Linhas de conexão dinâmicas */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
                        <stop offset="50%" stopColor="rgba(147, 51, 234, 0.4)" />
                        <stop offset="100%" stopColor="rgba(6, 182, 212, 0.6)" />
                    </linearGradient>
                </defs>
                {Object.values(metrics).map((_, index) => (
                    <line
                        key={`connection-${index}`}
                        x1="50%"
                        y1="50%"
                        x2="50%"
                        y2="50%"
                        stroke="url(#connectionGradient)"
                        strokeWidth="1"
                        opacity="0.5"
                        className="animate-pulse"
                    />
                ))}
            </svg>

            {/* Anel de energia pulsante */}
            <div className="absolute inset-8 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-12 rounded-full border border-purple-500/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-16 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '25s' }} />
        </div>
    );
};

// Componente de Loading extraordinário
const LoadingScreen: React.FC = () => {
    const loadingRef = useRef<HTMLDivElement>(null);
    const orbsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (loadingRef.current && orbsRef.current) {
            const orbs = Array.from(orbsRef.current.children);

            gsap.set(orbs, {
                scale: 0,
                opacity: 0,
                rotationY: 180,
                transformPerspective: 1000
            });

            const tl = gsap.timeline({ repeat: -1 });

            tl
                .to(orbs, {
                    scale: 1,
                    opacity: 1,
                    rotationY: 0,
                    duration: 1.5,
                    stagger: {
                        amount: 0.8,
                        ease: "elastic.out(1, 0.8)"
                    }
                })
                .to(orbs, {
                    scale: 1.3,
                    boxShadow: "0 0 40px currentColor",
                    duration: 0.6,
                    stagger: 0.1
                })
                .to(orbs, {
                    scale: 1,
                    boxShadow: "0 0 10px currentColor",
                    duration: 0.6,
                    stagger: 0.1
                })
                .to(orbs, {
                    rotationY: 360,
                    duration: 2,
                    ease: "power1.inOut"
                }, "-=1.2");

            // Efeito de respiração no fundo
            gsap.to(loadingRef.current, {
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.05) 50%, transparent 100%)",
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        }
    }, []);

    return (
        <div ref={loadingRef} className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div ref={orbsRef} className="flex space-x-4 mb-8">
                    <div className="w-6 h-6 bg-blue-500 rounded-full text-blue-500"></div>
                    <div className="w-6 h-6 bg-purple-500 rounded-full text-purple-500"></div>
                    <div className="w-6 h-6 bg-cyan-500 rounded-full text-cyan-500"></div>
                    <div className="w-6 h-6 bg-pink-500 rounded-full text-pink-500"></div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Carregando Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Preparando experiência extraordinária...
                </p>
            </div>
        </div>
    );
};

// Componente de item de navegação com efeitos 3D
interface NavigationItemProps {
    item: {
        id: string;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
    };
    index: number;
    isActive: boolean;
    onClick: () => void;
    notificationCount: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
    item,
    index,
    isActive,
    onClick,
    notificationCount
}) => {
    const itemRef = useRef<HTMLButtonElement>(null);
    const IconComponent = item.icon;

    useGSAP(() => {
        if (itemRef.current) {
            gsap.fromTo(itemRef.current,
                {
                    opacity: 0,
                    x: -100,
                    rotationY: -45,
                    scale: 0.7,
                    transformPerspective: 1000
                },
                {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "elastic.out(1, 0.6)",
                    delay: index * 0.1
                }
            );
        }
    }, []);

    const handleMouseEnter = () => {
        if (!isActive && itemRef.current) {
            gsap.to(itemRef.current, {
                scale: 1.05,
                x: 12,
                rotationY: 5,
                boxShadow: `12px 0 35px ${item.color}40`,
                background: `linear-gradient(90deg, ${item.color}15 0%, transparent 100%)`,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    };

    const handleMouseLeave = () => {
        if (!isActive && itemRef.current) {
            gsap.to(itemRef.current, {
                scale: 1,
                x: 0,
                rotationY: 0,
                boxShadow: "none",
                background: "transparent",
                duration: 0.3,
                ease: "power2.out"
            });
        }
    };

    return (
        <button
            ref={itemRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-600 dark:text-blue-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            style={isActive ? {
                boxShadow: `8px 0 30px ${item.color}30, inset 2px 0 8px ${item.color}20`
            } : {}}
        >
            <div className={`relative ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                <IconComponent className="h-5 w-5" />
                {isActive && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl" />
                )}
            </div>
            <span className="font-medium">{item.label}</span>

            {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                    {notificationCount}
                </div>
            )}

            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
            )}
        </button>
    );
};

// Seção Overview com gráficos extraordinários
interface OverviewSectionProps {
    stats: DashboardStats;
    systemMetrics: SystemMetrics;
    userGrowthData: any[];
    roleDistributionData: any[];
    networkAnalyticsData: any[];
    recentActivity: ActivityLog[];
    statsCardsRef: React.RefObject<HTMLDivElement | null>;
    chartsRef: React.RefObject<HTMLDivElement | null>;
    metricsRef: React.RefObject<HTMLDivElement | null>;
    realTimeUpdates: boolean;
    onToggleRealTime: () => void;
    quantumEffects: boolean;
    setQuantumEffects: (value: boolean) => void;
    neuralNetwork: boolean;
    setNeuralNetwork: (value: boolean) => void;
    holographicMode: boolean;
    setHolographicMode: (value: boolean) => void;
    energyField: number;
    setEnergyField: (value: number) => void;
    dataVisualization: string;
    setDataVisualization: (value: string) => void;
    matrixMode: boolean;
    setMatrixMode: (value: boolean) => void;
    cosmicField: number;
    setCosmicField: (value: number) => void;
    dimensionalShift: number;
    setDimensionalShift: (value: number) => void;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
    stats,
    systemMetrics,
    userGrowthData,
    roleDistributionData,
    networkAnalyticsData,
    recentActivity,
    statsCardsRef,
    chartsRef,
    metricsRef,
    realTimeUpdates,
    onToggleRealTime,
    quantumEffects,
    setQuantumEffects,
    neuralNetwork,
    setNeuralNetwork,
    holographicMode,
    setHolographicMode,
    energyField,
    setEnergyField,
    dataVisualization,
    setDataVisualization,
    matrixMode,
    setMatrixMode,
    cosmicField,
    setCosmicField,
    dimensionalShift,
    setDimensionalShift
}) => {
    return (
        <div className="space-y-8">
            {/* Header com controles extraordinários */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Dashboard Extraordinário
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Visão geral do sistema com tecnologia quântica
                    </p>
                </div>

                <div className="flex items-center space-x-6">
                    {/* Controles de Efeitos */}
                    <div className="flex items-center space-x-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setQuantumEffects(!quantumEffects)}
                                className={`w-10 h-6 rounded-full relative transition-all duration-300 ${quantumEffects ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${quantumEffects ? 'left-5' : 'left-1'
                                    }`} />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Quantum</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setNeuralNetwork(!neuralNetwork)}
                                className={`w-10 h-6 rounded-full relative transition-all duration-300 ${neuralNetwork ? 'bg-purple-500' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${neuralNetwork ? 'left-5' : 'left-1'
                                    }`} />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Neural</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setHolographicMode(!holographicMode)}
                                className={`w-10 h-6 rounded-full relative transition-all duration-300 ${holographicMode ? 'bg-cyan-500' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${holographicMode ? 'left-5' : 'left-1'
                                    }`} />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Holo</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setMatrixMode(!matrixMode)}
                                className={`w-10 h-6 rounded-full relative transition-all duration-300 ${matrixMode ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${matrixMode ? 'left-5' : 'left-1'
                                    }`} />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Matrix</span>
                        </div>
                    </div>

                    {/* Status em tempo real */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${realTimeUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tempo Real</span>
                            <button
                                onClick={onToggleRealTime}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {realTimeUpdates ? 'Pausar' : 'Ativar'}
                            </button>
                        </div>

                        {/* Medidor de energia */}
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Energia:</span>
                            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${energyField}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">{energyField}%</span>
                        </div>

                        {/* Slider Campo Cósmico */}
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Cósmico:</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={cosmicField}
                                onChange={(e) => setCosmicField(parseInt(e.target.value))}
                                className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-cosmic"
                            />
                            <span className="text-xs text-gray-500">{cosmicField}%</span>
                        </div>

                        {/* Slider Dimensional */}
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Dimensional:</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={dimensionalShift}
                                onChange={(e) => setDimensionalShift(parseInt(e.target.value))}
                                className="w-16 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-dimensional"
                            />
                            <span className="text-xs text-gray-500">{dimensionalShift}%</span>
                        </div>

                        <button
                            onClick={() => setEnergyField(Math.min(100, energyField + 10))}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Cards de estatísticas com efeitos 3D */}
            <div ref={statsCardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total de Usuários"
                    value={stats.totalUsers.toLocaleString()}
                    icon={Users}
                    trend="+12%"
                    color="blue"
                    gradient="from-blue-500 to-cyan-500"
                />
                <StatsCard
                    title="Usuários Ativos"
                    value={stats.activeUsers.toLocaleString()}
                    icon={CheckCircle}
                    trend="+8%"
                    color="green"
                    gradient="from-green-500 to-emerald-500"
                />
                <StatsCard
                    title="Novos Hoje"
                    value={stats.newUsersToday.toString()}
                    icon={UserPlus}
                    trend="+23%"
                    color="purple"
                    gradient="from-purple-500 to-pink-500"
                />
                <StatsCard
                    title="Online Agora"
                    value={stats.onlineUsers.toString()}
                    icon={Wifi}
                    trend="+5%"
                    color="orange"
                    gradient="from-orange-500 to-red-500"
                />
            </div>

            {/* Gráficos e Analytics */}
            <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Crescimento de Usuários */}
                <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <span>Crescimento de Usuários</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={userGrowthData}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="users"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fill="url(#colorUsers)"
                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Distribuição de Roles */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <span>Distribuição de Roles</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={roleDistributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {roleDistributionData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke={entry.color}
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center space-x-4 mt-4">
                        {roleDistributionData.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.name} {item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analytics de Rede */}
                <div className="lg:col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Target className="h-5 w-5 text-purple-500" />
                        <span>Analytics Avançadas</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={networkAnalyticsData}>
                            <PolarGrid stroke="rgba(156, 163, 175, 0.3)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                            <PolarRadiusAxis
                                domain={[0, 150]}
                                tick={false}
                                axisLine={false}
                            />
                            <Radar
                                name="Atual"
                                dataKey="A"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                            <Radar
                                name="Meta"
                                dataKey="B"
                                stroke="#8B5CF6"
                                fill="#8B5CF6"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Visualizações Extraordinárias */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Rede Neural Holográfica */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-cyan-500" />
                        <span>Rede Neural Holográfica</span>
                        <div className="flex items-center space-x-2 ml-auto">
                            <button
                                onClick={() => setDataVisualization(dataVisualization === '3d' ? '2d' : '3d')}
                                className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                            >
                                {dataVisualization.toUpperCase()}
                            </button>
                        </div>
                    </h3>
                    <NeuralNetworkVisualizer
                        active={neuralNetwork}
                        dataVisualization={dataVisualization}
                        stats={stats}
                    />
                </div>

                {/* Streams de Dados */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Network className="h-5 w-5 text-purple-500" />
                        <span>Fluxo de Dados Quântico</span>
                    </h3>
                    <DataStreamVisualizer
                        metrics={systemMetrics}
                        realTimeUpdates={realTimeUpdates}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visualizador 3D */}
                <div className="lg:col-span-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Target className="h-5 w-5 text-purple-500" />
                        <span>Sistema Quântico 3D</span>
                    </h3>
                    <Metrics3DVisualizer metrics={systemMetrics} energyField={energyField} />
                </div>

                {/* Métricas Tradicionais */}
                <div ref={metricsRef} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(systemMetrics).map(([key, value], index) => (
                        <SystemMetricCard
                            key={key}
                            title={key === 'cpu' ? 'CPU' : key === 'memory' ? 'Memória' : key === 'disk' ? 'Disco' : 'Rede'}
                            value={value}
                            icon={key === 'cpu' ? CpuIcon : key === 'memory' ? MemoryStick : key === 'disk' ? HardDrive : Network}
                            color={value > 80 ? 'red' : value > 60 ? 'yellow' : 'green'}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Painel de Controle Holográfico */}
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
                <div className="relative z-10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-cyan-400" />
                        <span>Controle de Ambiente Holográfico</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Quantum Field Intensity */}
                        <div className="space-y-2">
                            <label className="text-sm text-cyan-300">Campo Quântico</label>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={energyField}
                                    onChange={(e) => setEnergyField(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-cyan"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>0%</span>
                                    <span className="text-cyan-400 font-bold">{energyField}%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>

                        {/* Neural Network Density */}
                        <div className="space-y-2">
                            <label className="text-sm text-purple-300">Densidade Neural</label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setNeuralNetwork(!neuralNetwork)}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${neuralNetwork
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {neuralNetwork ? 'Ativo' : 'Inativo'}
                                </button>
                                <div className="text-xs text-purple-300 text-center">
                                    Nós: {neuralNetwork ? '20' : '0'}
                                </div>
                            </div>
                        </div>

                        {/* Holographic Mode */}
                        <div className="space-y-2">
                            <label className="text-sm text-pink-300">Modo Holográfico</label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setHolographicMode(!holographicMode)}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-300 ${holographicMode
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {holographicMode ? 'Hologram ON' : 'Hologram OFF'}
                                </button>
                                <div className="text-xs text-pink-300 text-center">
                                    {holographicMode ? 'Matriz Ativa' : 'Matriz Inativa'}
                                </div>
                            </div>
                        </div>

                        {/* Visualization Mode */}
                        <div className="space-y-2">
                            <label className="text-sm text-blue-300">Visualização</label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setDataVisualization(dataVisualization === '3d' ? '2d' : '3d')}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                                >
                                    Modo {dataVisualization.toUpperCase()}
                                </button>
                                <div className="text-xs text-blue-300 text-center">
                                    {dataVisualization === '3d' ? 'Projeção 3D' : 'Matriz 2D'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Global */}
                    <div className="mt-6 p-4 bg-black/50 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-white">Status do Sistema</h4>
                                <p className="text-xs text-gray-400">
                                    Quantum: {quantumEffects ? 'ON' : 'OFF'} |
                                    Neural: {neuralNetwork ? 'ACTIVE' : 'IDLE'} |
                                    Holo: {holographicMode ? 'ENABLED' : 'DISABLED'}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <div className={`w-3 h-3 rounded-full ${quantumEffects ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                <div className={`w-3 h-3 rounded-full ${neuralNetwork ? 'bg-purple-500 animate-pulse' : 'bg-gray-500'}`} />
                                <div className={`w-3 h-3 rounded-full ${holographicMode ? 'bg-cyan-500 animate-pulse' : 'bg-gray-500'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Efeito de borda pulsante */}
                <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/30 animate-pulse" />
            </div>

            {/* Atividades Recentes */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>Monitor de Atividade</span>
                </h3>
                <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente de card de estatísticas com efeitos 3D
interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    trend: string;
    color: string;
    gradient: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color, gradient }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        if (cardRef.current) {
            const handleMouseEnter = () => {
                gsap.timeline()
                    .to(cardRef.current, {
                        scale: 1.05,
                        rotationY: 10,
                        rotationX: 5,
                        z: 50,
                        transformPerspective: 1000,
                        duration: 0.4,
                        ease: "power2.out"
                    })
                    .to(cardRef.current, {
                        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.2), 0 0 40px rgba(59, 130, 246, 0.4), inset 0 1px 20px rgba(255, 255, 255, 0.1)",
                        duration: 0.3
                    }, "-=0.2");
            };

            const handleMouseLeave = () => {
                gsap.to(cardRef.current, {
                    scale: 1,
                    rotationY: 0,
                    rotationX: 0,
                    z: 0,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    duration: 0.4,
                    ease: "power2.out"
                });
            };

            cardRef.current.addEventListener('mouseenter', handleMouseEnter);
            cardRef.current.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                if (cardRef.current) {
                    cardRef.current.removeEventListener('mouseenter', handleMouseEnter);
                    cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
                }
            };
        }
    }, []);

    // Animação de contagem de números
    useGSAP(() => {
        if (numberRef.current) {
            const numericValue = parseInt(value.replace(/[^\d]/g, ''));
            if (!isNaN(numericValue)) {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: numericValue,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: function () {
                        if (numberRef.current) {
                            const currentVal = Math.round(obj.val);
                            numberRef.current.textContent = currentVal.toLocaleString();
                        }
                    }
                });
            }
        }
    }, [value]);

    return (
        <div
            ref={cardRef}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden group cursor-pointer transform-gpu"
        >
            {/* Efeito de gradiente animado */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

            {/* Efeito de partículas de fundo */}
            <div className="absolute inset-0 opacity-30">
                {Array.from({ length: 5 }, (_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-gradient-to-r ${gradient} rounded-full animate-pulse`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${2 + i}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
                        <Icon className="h-6 w-6 text-white z-10" />
                        {/* Efeito de brilho no ícone */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]" />
                    </div>
                    <div className="text-right">
                        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'} flex items-center space-x-1`}>
                            <TrendingUp className={`h-3 w-3 ${trend.startsWith('+') ? '' : 'rotate-180'}`} />
                            <span>{trend}</span>
                        </span>
                    </div>
                </div>

                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {title}
                </h3>
                <p ref={numberRef} className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                    {value}
                </p>
            </div>

            {/* Shimmer effect melhorado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]" />

            {/* Borda holográfica */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        </div>
    );
};

// Componente de métrica do sistema
interface SystemMetricCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: 'green' | 'yellow' | 'red';
    index: number;
}

const SystemMetricCard: React.FC<SystemMetricCardProps> = ({ title, value, icon: Icon, color, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const colorMap = {
        green: 'from-green-500 to-emerald-500',
        yellow: 'from-yellow-500 to-orange-500',
        red: 'from-red-500 to-pink-500'
    };

    useGSAP(() => {
        if (progressRef.current) {
            gsap.fromTo(progressRef.current,
                { width: '0%' },
                {
                    width: `${value}%`,
                    duration: 2,
                    ease: "power2.out",
                    delay: index * 0.2
                }
            );
        }
    }, [value, index]);

    return (
        <div
            ref={cardRef}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
        >
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {title}
                </h4>
                <Icon className="h-5 w-5 text-gray-500" />
            </div>

            <div className="mb-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value.toFixed(1)}%
                </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                    ref={progressRef}
                    className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full relative overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
            </div>
        </div>
    );
};

// Componente de item de atividade
interface ActivityItemProps {
    activity: ActivityLog;
    index: number;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, index }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (itemRef.current) {
            gsap.fromTo(itemRef.current,
                {
                    opacity: 0,
                    x: -50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    delay: index * 0.1
                }
            );
        }
    }, [index]);

    const getTypeColor = (type: ActivityLog['type']) => {
        switch (type) {
            case 'success': return 'text-green-500';
            case 'warning': return 'text-yellow-500';
            case 'error': return 'text-red-500';
            default: return 'text-blue-500';
        }
    };

    return (
        <div ref={itemRef} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
            <div className={`${getTypeColor(activity.type)} mt-1`}>
                {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    por {activity.user} • {activity.details}
                </p>
                {activity.ip && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        IP: {activity.ip}
                    </p>
                )}
            </div>
        </div>
    );
};

// Componente Coming Soon para outras seções
interface ComingSoonSectionProps {
    view: ViewType;
    navigationItems: any[];
}

const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ view, navigationItems }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (sectionRef.current) {
            gsap.fromTo(sectionRef.current,
                {
                    opacity: 0,
                    scale: 0.8,
                    rotationY: 20
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 1,
                    ease: "back.out(1.7)"
                }
            );
        }
    }, [view]);

    const currentItem = navigationItems.find(item => item.id === view);
    const IconComponent = currentItem?.icon || Settings;

    return (
        <div ref={sectionRef} className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <IconComponent className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                    {currentItem?.label}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Esta seção está sendo desenvolvida com tecnologias extraordinárias e animações avançadas do GSAP.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Rocket className="h-4 w-4 animate-bounce" />
                    <span>Em desenvolvimento...</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
