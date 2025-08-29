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
    AlertTriangle,
    Calendar,
    Filter,
    Mail,
    Save,
    Eye,
    Trash2,
    Plus,
    Settings
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
    fields: string[];
}

interface ReportHistory {
    id: string;
    name: string;
    generatedDate: string;
    status: 'completed' | 'processing' | 'failed';
    size: string;
    downloadUrl: string;
    template: string;
}

interface ReportConfig {
    template: string;
    dateRange: { start: string; end: string };
    format: 'PDF' | 'Excel' | 'CSV' | 'Word';
    includeCharts: boolean;
    includeRawData: boolean;
    emailDelivery: boolean;
    emailRecipients: string[];
    scheduledGeneration: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

const GenerateReport: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { state } = useAuth();
    const { user } = state;
    const pageRef = useRef<HTMLDivElement>(null);

    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [reportConfig, setReportConfig] = useState<ReportConfig>({
        template: '',
        dateRange: { start: '', end: '' },
        format: 'PDF',
        includeCharts: true,
        includeRawData: false,
        emailDelivery: false,
        emailRecipients: [],
        scheduledGeneration: false,
        frequency: 'monthly'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [newEmailRecipient, setNewEmailRecipient] = useState('');

    // Mock data para templates de relatório
    const reportTemplates: ReportTemplate[] = [
        {
            id: 'user-analytics',
            name: 'Relatório de Análise de Usuários',
            description: 'Análise detalhada de atividade e engajamento dos usuários',
            icon: <Users className="w-6 h-6" />,
            category: 'Usuários',
            estimatedTime: '2-3 min',
            lastGenerated: '2025-08-28 14:30',
            color: 'text-blue-700',
            bgColor: 'bg-blue-50',
            fields: ['Total de usuários', 'Usuários ativos', 'Taxa de retenção', 'Demografia', 'Atividade por hora']
        },
        {
            id: 'financial-summary',
            name: 'Resumo Financeiro',
            description: 'Relatório abrangente de performance financeira e métricas',
            icon: <TrendingUp className="w-6 h-6" />,
            category: 'Financeiro',
            estimatedTime: '3-5 min',
            lastGenerated: '2025-08-28 09:15',
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            fields: ['Receita total', 'Lucro líquido', 'Despesas', 'ROI', 'Projeções']
        },
        {
            id: 'system-performance',
            name: 'Performance do Sistema',
            description: 'Métricas de desempenho, tempo de resposta e disponibilidade',
            icon: <Activity className="w-6 h-6" />,
            category: 'Sistema',
            estimatedTime: '1-2 min',
            lastGenerated: '2025-08-28 16:45',
            color: 'text-purple-700',
            bgColor: 'bg-purple-50',
            fields: ['Tempo de resposta', 'Uptime', 'Uso de CPU', 'Memória', 'Throughput']
        },
        {
            id: 'sales-analytics',
            name: 'Análise de Vendas',
            description: 'Insights detalhados sobre vendas, conversões e pipeline',
            icon: <BarChart3 className="w-6 h-6" />,
            category: 'Vendas',
            estimatedTime: '4-6 min',
            lastGenerated: '2025-08-27 11:20',
            color: 'text-orange-700',
            bgColor: 'bg-orange-50',
            fields: ['Volume de vendas', 'Taxa de conversão', 'Pipeline', 'Previsões', 'Performance por vendedor']
        },
        {
            id: 'data-insights',
            name: 'Insights de Dados',
            description: 'Análise profunda de padrões e tendências nos dados',
            icon: <Database className="w-6 h-6" />,
            category: 'Dados',
            estimatedTime: '5-8 min',
            lastGenerated: '2025-08-26 15:10',
            color: 'text-indigo-700',
            bgColor: 'bg-indigo-50',
            fields: ['Qualidade dos dados', 'Padrões', 'Anomalias', 'Correlações', 'Tendências']
        },
        {
            id: 'custom-dashboard',
            name: 'Dashboard Personalizado',
            description: 'Relatório customizável com métricas específicas do negócio',
            icon: <PieChartIcon className="w-6 h-6" />,
            category: 'Personalizado',
            estimatedTime: '3-4 min',
            lastGenerated: '2025-08-28 10:30',
            color: 'text-red-700',
            bgColor: 'bg-red-50',
            fields: ['KPIs selecionados', 'Métricas customizadas', 'Gráficos personalizados', 'Comparações']
        }
    ];

    // Mock data para histórico de relatórios
    const [reportHistory, setReportHistory] = useState<ReportHistory[]>([
        {
            id: '1',
            name: 'Relatório de Análise de Usuários',
            generatedDate: '2025-08-28 14:30',
            status: 'completed',
            size: '2.3 MB',
            downloadUrl: '#',
            template: 'user-analytics'
        },
        {
            id: '2',
            name: 'Performance do Sistema',
            generatedDate: '2025-08-28 16:45',
            status: 'completed',
            size: '1.8 MB',
            downloadUrl: '#',
            template: 'system-performance'
        },
        {
            id: '3',
            name: 'Resumo Financeiro',
            generatedDate: '2025-08-28 09:15',
            status: 'processing',
            size: '---',
            downloadUrl: '#',
            template: 'financial-summary'
        },
        {
            id: '4',
            name: 'Análise de Vendas',
            generatedDate: '2025-08-27 11:20',
            status: 'completed',
            size: '4.1 MB',
            downloadUrl: '#',
            template: 'sales-analytics'
        },
        {
            id: '5',
            name: 'Insights de Dados',
            generatedDate: '2025-08-26 15:10',
            status: 'failed',
            size: '---',
            downloadUrl: '#',
            template: 'data-insights'
        }
    ]);

    // Funções de manipulação
    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId);
        setReportConfig(prev => ({ ...prev, template: templateId }));
    };

    const handleGenerateReport = async () => {
        if (!reportConfig.template) {
            alert('Por favor, selecione um template de relatório');
            return;
        }

        setIsGenerating(true);

        // Simula geração de relatório
        setTimeout(() => {
            const template = reportTemplates.find(t => t.id === reportConfig.template);
            const newReport: ReportHistory = {
                id: Date.now().toString(),
                name: template?.name || 'Relatório',
                generatedDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
                status: 'completed',
                size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
                downloadUrl: '#',
                template: reportConfig.template
            };

            setReportHistory(prev => [newReport, ...prev]);
            setIsGenerating(false);
            alert('Relatório gerado com sucesso!');
        }, 3000);
    };

    const handleDownloadReport = (reportId: string) => {
        const report = reportHistory.find(r => r.id === reportId);
        if (report) {
            alert(`Baixando: ${report.name}`);
        }
    };

    const handleDeleteReport = (reportId: string) => {
        if (window.confirm('Tem certeza que deseja deletar este relatório?')) {
            setReportHistory(prev => prev.filter(r => r.id !== reportId));
        }
    };

    const addEmailRecipient = () => {
        if (newEmailRecipient && !reportConfig.emailRecipients.includes(newEmailRecipient)) {
            setReportConfig(prev => ({
                ...prev,
                emailRecipients: [...prev.emailRecipients, newEmailRecipient]
            }));
            setNewEmailRecipient('');
        }
    };

    const removeEmailRecipient = (email: string) => {
        setReportConfig(prev => ({
            ...prev,
            emailRecipients: prev.emailRecipients.filter(e => e !== email)
        }));
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
                                        text="Geração de Relatórios"
                                        className="text-3xl font-bold text-gray-900"
                                        delay={0.2}
                                    />
                                    <BusinessAnimatedText
                                        text="Crie relatórios detalhados com análises profissionais"
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

                {/* Templates de Relatório */}
                <BusinessCard delay={0.3}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <BusinessAnimatedText
                                text="Templates de Relatório"
                                className="text-xl font-semibold text-gray-900"
                                delay={0.4}
                            />
                            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Template
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reportTemplates.map((template, index) => (
                                <BusinessCard key={template.id} delay={0.5 + index * 0.1}>
                                    <div
                                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${selectedTemplate === template.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleTemplateSelect(template.id)}
                                    >
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${template.bgColor} mb-4`}>
                                            <div className={template.color}>
                                                {template.icon}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {template.name}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4">
                                            {template.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{template.category}</span>
                                            <span>{template.estimatedTime}</span>
                                        </div>

                                        <div className="mt-3 text-xs text-gray-400">
                                            Último: {template.lastGenerated}
                                        </div>

                                        {/* Preview dos campos */}
                                        {selectedTemplate === template.id && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Campos incluídos:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {template.fields.map((field, idx) => (
                                                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                            {field}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </BusinessCard>
                            ))}
                        </div>
                    </div>
                </BusinessCard>

                {/* Configurações do Relatório */}
                {selectedTemplate && (
                    <BusinessCard delay={0.7}>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="Configurações do Relatório"
                                className="text-xl font-semibold text-gray-900 mb-6"
                                delay={0.8}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Configurações Básicas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Configurações Básicas</h3>

                                    {/* Período */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Período do Relatório
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Data Inicial</label>
                                                <input
                                                    type="date"
                                                    value={reportConfig.dateRange.start}
                                                    onChange={(e) => setReportConfig(prev => ({
                                                        ...prev,
                                                        dateRange: { ...prev.dateRange, start: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Data Final</label>
                                                <input
                                                    type="date"
                                                    value={reportConfig.dateRange.end}
                                                    onChange={(e) => setReportConfig(prev => ({
                                                        ...prev,
                                                        dateRange: { ...prev.dateRange, end: e.target.value }
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formato */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Formato de Saída
                                        </label>
                                        <select
                                            value={reportConfig.format}
                                            onChange={(e) => setReportConfig(prev => ({
                                                ...prev,
                                                format: e.target.value as any
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="PDF">PDF</option>
                                            <option value="Excel">Excel</option>
                                            <option value="CSV">CSV</option>
                                            <option value="Word">Word</option>
                                        </select>
                                    </div>

                                    {/* Opções de Conteúdo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Opções de Conteúdo
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={reportConfig.includeCharts}
                                                    onChange={(e) => setReportConfig(prev => ({
                                                        ...prev,
                                                        includeCharts: e.target.checked
                                                    }))}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Incluir gráficos</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={reportConfig.includeRawData}
                                                    onChange={(e) => setReportConfig(prev => ({
                                                        ...prev,
                                                        includeRawData: e.target.checked
                                                    }))}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Incluir dados brutos</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Configurações Avançadas */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Configurações Avançadas</h3>

                                    {/* Entrega por Email */}
                                    <div>
                                        <label className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                checked={reportConfig.emailDelivery}
                                                onChange={(e) => setReportConfig(prev => ({
                                                    ...prev,
                                                    emailDelivery: e.target.checked
                                                }))}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Enviar por email</span>
                                        </label>

                                        {reportConfig.emailDelivery && (
                                            <div className="space-y-3">
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="email"
                                                        placeholder="email@exemplo.com"
                                                        value={newEmailRecipient}
                                                        onChange={(e) => setNewEmailRecipient(e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <button
                                                        onClick={addEmailRecipient}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {reportConfig.emailRecipients.length > 0 && (
                                                    <div className="space-y-1">
                                                        {reportConfig.emailRecipients.map((email, index) => (
                                                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                                                <span className="text-sm text-gray-700">{email}</span>
                                                                <button
                                                                    onClick={() => removeEmailRecipient(email)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Geração Programada */}
                                    <div>
                                        <label className="flex items-center mb-3">
                                            <input
                                                type="checkbox"
                                                checked={reportConfig.scheduledGeneration}
                                                onChange={(e) => setReportConfig(prev => ({
                                                    ...prev,
                                                    scheduledGeneration: e.target.checked
                                                }))}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">Geração programada</span>
                                        </label>

                                        {reportConfig.scheduledGeneration && (
                                            <select
                                                value={reportConfig.frequency}
                                                onChange={(e) => setReportConfig(prev => ({
                                                    ...prev,
                                                    frequency: e.target.value as any
                                                }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="daily">Diário</option>
                                                <option value="weekly">Semanal</option>
                                                <option value="monthly">Mensal</option>
                                                <option value="quarterly">Trimestral</option>
                                            </select>
                                        )}
                                    </div>

                                    {/* Botões de Ação */}
                                    <div className="space-y-3 pt-4">
                                        <button
                                            onClick={() => setShowPreview(true)}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Visualizar Prévia
                                        </button>

                                        <button
                                            onClick={handleGenerateReport}
                                            disabled={isGenerating}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Gerando...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Gerar Relatório
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BusinessCard>
                )}

                {/* Histórico de Relatórios */}
                <BusinessCard delay={0.9}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <BusinessAnimatedText
                                text="Histórico de Relatórios"
                                className="text-xl font-semibold text-gray-900"
                                delay={1.0}
                            />
                            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <Download className="w-4 h-4 mr-2" />
                                Baixar Todos
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Relatório
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data de Geração
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tamanho
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportHistory.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{report.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{report.generatedDate}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                                    {getStatusIcon(report.status)}
                                                    <span className="ml-1 capitalize">{report.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {report.size}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    {report.status === 'completed' && (
                                                        <button
                                                            onClick={() => handleDownloadReport(report.id)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteReport(report.id)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </BusinessCard>

                {/* Modal de Prévia */}
                {showPreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <BusinessCard className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Prévia do Relatório</h3>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                        Prévia do Relatório: {reportTemplates.find(t => t.id === selectedTemplate)?.name}
                                    </h4>
                                    <p className="text-gray-600">
                                        Período: {reportConfig.dateRange.start || 'Não definido'} até {reportConfig.dateRange.end || 'Não definido'}
                                    </p>
                                    <p className="text-gray-600">
                                        Formato: {reportConfig.format}
                                    </p>
                                    <div className="mt-4 text-sm text-gray-500">
                                        Esta é uma prévia mockup. O relatório real será gerado com dados reais.
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Fechar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPreview(false);
                                            handleGenerateReport();
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Gerar Relatório
                                    </button>
                                </div>
                            </div>
                        </BusinessCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateReport;
