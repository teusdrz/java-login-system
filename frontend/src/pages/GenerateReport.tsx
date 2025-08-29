import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    FileText,
    Download,
    BarChart3,
    Users,
    TrendingUp,
    Database,
    PieChart as PieChartIcon,
    Activity,
    ArrowLeft,
    RefreshCw,
    Send,
    CheckCircle,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Professional Animation Components
const BusinessAnimatedText: React.FC<{ text: string; className?: string; delay?: number }> = ({
    text,
    className = "",
    delay = 0
}) => {
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (textRef.current) {
            gsap.fromTo(textRef.current, {
                opacity: 0,
                y: 15,
                scale: 0.98
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                delay: delay,
                ease: "power2.out"
            });
        }
    }, [text, delay]);

    return <div ref={textRef} className={className}>{text}</div>;
};

const BusinessCard: React.FC<{
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hoverEffect?: boolean;
}> = ({ children, className = "", delay = 0, hoverEffect = true }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current, {
                opacity: 0,
                y: 30,
                scale: 0.95,
                rotationX: 10
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                duration: 0.8,
                delay: delay,
                ease: "power3.out"
            });

            if (hoverEffect) {
                const card = cardRef.current;

                const handleMouseEnter = () => {
                    gsap.to(card, {
                        scale: 1.02,
                        y: -5,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                };

                const handleMouseLeave = () => {
                    gsap.to(card, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                };

                card.addEventListener('mouseenter', handleMouseEnter);
                card.addEventListener('mouseleave', handleMouseLeave);

                return () => {
                    card.removeEventListener('mouseenter', handleMouseEnter);
                    card.removeEventListener('mouseleave', handleMouseLeave);
                };
            }
        }
    }, [delay, hoverEffect]);

    return <div ref={cardRef} className={className}>{children}</div>;
};

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: string;
    estimatedTime: string;
    lastGenerated: string;
    color: string;
    bgColor: string;
}

interface ReportHistory {
    id: string;
    name: string;
    generatedDate: string;
    status: 'completed' | 'processing' | 'failed';
    size: string;
    downloadUrl: string;
}

const GenerateReport: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { state } = useAuth();
    const { user } = state;
    const pageRef = useRef<HTMLDivElement>(null);

    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isGenerating, setIsGenerating] = useState(false);

    // Professional color palette
    const businessColors = {
        primary: '#1e40af',
        secondary: '#059669',
        accent: '#7c3aed',
        warning: '#d97706',
        danger: '#dc2626',
        neutral: '#374151'
    };

    const reportTemplates: ReportTemplate[] = [
        {
            id: 'user-analytics',
            name: 'User Analytics Report',
            description: 'Comprehensive analysis of user behavior, engagement metrics, and growth trends',
            icon: <Users className="w-6 h-6" />,
            category: 'Analytics',
            estimatedTime: '3-5 minutes',
            lastGenerated: '2 hours ago',
            color: businessColors.primary,
            bgColor: 'bg-blue-50'
        },
        {
            id: 'financial-summary',
            name: 'Financial Summary',
            description: 'Revenue analysis, cost breakdown, and financial performance indicators',
            icon: <BarChart3 className="w-6 h-6" />,
            category: 'Finance',
            estimatedTime: '2-4 minutes',
            lastGenerated: '1 day ago',
            color: businessColors.secondary,
            bgColor: 'bg-green-50'
        },
        {
            id: 'system-performance',
            name: 'System Performance',
            description: 'Technical metrics, uptime analysis, and infrastructure health status',
            icon: <Activity className="w-6 h-6" />,
            category: 'Technical',
            estimatedTime: '1-2 minutes',
            lastGenerated: '6 hours ago',
            color: businessColors.accent,
            bgColor: 'bg-purple-50'
        },
        {
            id: 'security-audit',
            name: 'Security Audit Report',
            description: 'Security analysis, threat assessment, and compliance verification',
            icon: <Database className="w-6 h-6" />,
            category: 'Security',
            estimatedTime: '5-7 minutes',
            lastGenerated: '3 days ago',
            color: businessColors.warning,
            bgColor: 'bg-amber-50'
        },
        {
            id: 'business-intelligence',
            name: 'Business Intelligence',
            description: 'Market insights, competitive analysis, and strategic recommendations',
            icon: <TrendingUp className="w-6 h-6" />,
            category: 'Business',
            estimatedTime: '4-6 minutes',
            lastGenerated: '1 week ago',
            color: businessColors.danger,
            bgColor: 'bg-red-50'
        },
        {
            id: 'operational-efficiency',
            name: 'Operational Efficiency',
            description: 'Process optimization, resource utilization, and productivity metrics',
            icon: <PieChartIcon className="w-6 h-6" />,
            category: 'Operations',
            estimatedTime: '3-4 minutes',
            lastGenerated: '12 hours ago',
            color: businessColors.neutral,
            bgColor: 'bg-gray-50'
        }
    ];

    const reportHistory: ReportHistory[] = [
        {
            id: '1',
            name: 'Monthly User Analytics - August 2025',
            generatedDate: '2025-08-28 14:30',
            status: 'completed',
            size: '2.4 MB',
            downloadUrl: '#'
        },
        {
            id: '2',
            name: 'Financial Summary Q3 2025',
            generatedDate: '2025-08-27 09:15',
            status: 'completed',
            size: '1.8 MB',
            downloadUrl: '#'
        },
        {
            id: '3',
            name: 'System Performance Weekly',
            generatedDate: '2025-08-28 16:45',
            status: 'processing',
            size: '0 MB',
            downloadUrl: '#'
        },
        {
            id: '4',
            name: 'Security Audit Report',
            generatedDate: '2025-08-25 11:20',
            status: 'completed',
            size: '3.1 MB',
            downloadUrl: '#'
        }
    ];

    const handleGenerateReport = async () => {
        if (!selectedTemplate) return;

        setIsGenerating(true);

        // Simulate report generation
        setTimeout(() => {
            setIsGenerating(false);
            alert('Report generated successfully! Check your email for the download link.');
        }, 3000);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'processing':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'failed':
                return <AlertTriangle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-700 bg-green-100';
            case 'processing':
                return 'text-yellow-700 bg-yellow-100';
            case 'failed':
                return 'text-red-700 bg-red-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6"
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <BusinessCard delay={0.1}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={onBack}
                                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <BusinessAnimatedText
                                        text="Report Generation Center"
                                        className="text-3xl font-bold text-gray-900"
                                        delay={0.2}
                                    />
                                    <BusinessAnimatedText
                                        text="Generate comprehensive business reports and analytics"
                                        className="text-lg text-gray-600 mt-2"
                                        delay={0.4}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FileText className="w-12 h-12 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </BusinessCard>

                {/* Report Templates */}
                <BusinessCard delay={0.3}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <BusinessAnimatedText
                            text="Available Report Templates"
                            className="text-xl font-bold text-gray-900 mb-6"
                            delay={0.4}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reportTemplates.map((template, index) => (
                                <div
                                    key={template.id}
                                    className={`${template.bgColor} border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${template.color}20`, color: template.color }}>
                                            {template.icon}
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-white rounded-full text-gray-600">
                                            {template.category}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                                    <div className="space-y-1 text-xs text-gray-500">
                                        <div className="flex justify-between">
                                            <span>Est. Time:</span>
                                            <span>{template.estimatedTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Last Generated:</span>
                                            <span>{template.lastGenerated}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </BusinessCard>

                {/* Report Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BusinessCard delay={0.5}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="Report Configuration"
                                className="text-xl font-bold text-gray-900 mb-6"
                                delay={0.6}
                            />

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <input
                                                type="date"
                                                value={dateRange.start}
                                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <span className="text-xs text-gray-500">Start Date</span>
                                        </div>
                                        <div>
                                            <input
                                                type="date"
                                                value={dateRange.end}
                                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <span className="text-xs text-gray-500">End Date</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Output Format
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>PDF Document</option>
                                        <option>Excel Spreadsheet</option>
                                        <option>CSV Data</option>
                                        <option>PowerPoint Presentation</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Delivery Method
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input type="radio" name="delivery" value="email" className="mr-2" defaultChecked />
                                            <span className="text-sm">Email to {user?.email}</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="delivery" value="download" className="mr-2" />
                                            <span className="text-sm">Direct Download</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerateReport}
                                    disabled={!selectedTemplate || isGenerating}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${selectedTemplate && !isGenerating
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center justify-center">
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Generating Report...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <Send className="w-4 h-4 mr-2" />
                                            Generate Report
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </BusinessCard>

                    {/* Recent Reports */}
                    <BusinessCard delay={0.7}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <BusinessAnimatedText
                                    text="Recent Reports"
                                    className="text-xl font-bold text-gray-900"
                                    delay={0.8}
                                />
                                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                                    <RefreshCw className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {reportHistory.map((report, index) => (
                                    <div
                                        key={report.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1">{report.name}</h4>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>{report.generatedDate}</span>
                                                    <span>{report.size}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                    {getStatusIcon(report.status)}
                                                    <span className="ml-1 capitalize">{report.status}</span>
                                                </span>
                                                {report.status === 'completed' && (
                                                    <button className="p-1 rounded bg-blue-100 hover:bg-blue-200 transition-colors duration-200">
                                                        <Download className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BusinessCard>
                </div>
            </div>
        </div>
    );
};

export default GenerateReport;
