import React, { useRef, useState } from 'react';
import {
    Settings,
    ArrowLeft,
    Shield,
    Bell,
    Database,
    Globe,
    Palette,
    Eye,
    EyeOff,
    Save,
    RefreshCw,
    AlertTriangle,
    Monitor,
    Smartphone,
    Lock,
    Mail,
    Users,
    Server,
    Wifi,
    HardDrive,
    Cpu,
    MemoryStick,
    Clock,
    Key,
    FileText,
    Download,
    Upload,
    Trash2,
    Plus,
    Edit,
    Check,
    X
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

interface SystemSettingsConfig {
    general: {
        systemName: string;
        timezone: string;
        dateFormat: string;
        language: string;
        maintenanceMode: boolean;
        autoUpdates: boolean;
        debugMode: boolean;
        logLevel: 'error' | 'warn' | 'info' | 'debug';
    };
    security: {
        passwordMinLength: number;
        requireSpecialChars: boolean;
        sessionTimeout: number;
        maxLoginAttempts: number;
        twoFactorAuth: boolean;
        ipWhitelist: string[];
        sslOnly: boolean;
        autoLogoutTime: number;
    };
    notifications: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsNotifications: boolean;
        systemAlerts: boolean;
        userActivityAlerts: boolean;
        securityAlerts: boolean;
        maintenanceAlerts: boolean;
        emailServer: string;
        smtpPort: number;
    };
    database: {
        host: string;
        port: number;
        name: string;
        connectionPool: number;
        backupFrequency: 'daily' | 'weekly' | 'monthly';
        autoBackup: boolean;
        retentionDays: number;
        compressionEnabled: boolean;
    };
    integrations: {
        apiRateLimit: number;
        webhookRetries: number;
        externalApiTimeout: number;
        enableAnalytics: boolean;
        googleAnalytics: string;
        slackWebhook: string;
        discordWebhook: string;
        enableLogging: boolean;
    };
    appearance: {
        theme: 'light' | 'dark' | 'auto';
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        fontFamily: string;
        fontSize: 'small' | 'medium' | 'large';
        compactMode: boolean;
        showTooltips: boolean;
    };
}

type SettingsCategory = 'general' | 'security' | 'notifications' | 'database' | 'integrations' | 'appearance';

const SystemSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const pageRef = useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [newIpAddress, setNewIpAddress] = useState('');

    const [settings, setSettings] = useState<SystemSettingsConfig>({
        general: {
            systemName: 'Sistema de Login Corporativo',
            timezone: 'America/Sao_Paulo',
            dateFormat: 'DD/MM/YYYY',
            language: 'pt-BR',
            maintenanceMode: false,
            autoUpdates: true,
            debugMode: false,
            logLevel: 'info'
        },
        security: {
            passwordMinLength: 8,
            requireSpecialChars: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            twoFactorAuth: false,
            ipWhitelist: ['192.168.1.1', '10.0.0.1'],
            sslOnly: true,
            autoLogoutTime: 60
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            systemAlerts: true,
            userActivityAlerts: true,
            securityAlerts: true,
            maintenanceAlerts: true,
            emailServer: 'smtp.company.com',
            smtpPort: 587
        },
        database: {
            host: 'localhost',
            port: 3306,
            name: 'login_system',
            connectionPool: 10,
            backupFrequency: 'daily',
            autoBackup: true,
            retentionDays: 30,
            compressionEnabled: true
        },
        integrations: {
            apiRateLimit: 1000,
            webhookRetries: 3,
            externalApiTimeout: 30,
            enableAnalytics: true,
            googleAnalytics: 'GA-XXXXXXXXX',
            slackWebhook: '',
            discordWebhook: '',
            enableLogging: true
        },
        appearance: {
            theme: 'light',
            primaryColor: '#1e40af',
            secondaryColor: '#059669',
            accentColor: '#7c3aed',
            fontFamily: 'Inter',
            fontSize: 'medium',
            compactMode: false,
            showTooltips: true
        }
    });

    const settingsCategories = [
        {
            id: 'general' as SettingsCategory,
            name: 'Configurações Gerais',
            icon: <Settings className="w-5 h-5" />,
            description: 'Configurações básicas do sistema'
        },
        {
            id: 'security' as SettingsCategory,
            name: 'Segurança',
            icon: <Shield className="w-5 h-5" />,
            description: 'Políticas de segurança e autenticação'
        },
        {
            id: 'notifications' as SettingsCategory,
            name: 'Notificações',
            icon: <Bell className="w-5 h-5" />,
            description: 'Configurações de alertas e notificações'
        },
        {
            id: 'database' as SettingsCategory,
            name: 'Banco de Dados',
            icon: <Database className="w-5 h-5" />,
            description: 'Configurações de conexão e backup'
        },
        {
            id: 'integrations' as SettingsCategory,
            name: 'Integrações',
            icon: <Globe className="w-5 h-5" />,
            description: 'APIs e serviços externos'
        },
        {
            id: 'appearance' as SettingsCategory,
            name: 'Aparência',
            icon: <Palette className="w-5 h-5" />,
            description: 'Temas e personalização visual'
        }
    ];

    const handleSettingChange = (category: SettingsCategory, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);

        // Simula salvamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSaving(false);
        setHasChanges(false);
        alert('Configurações salvas com sucesso!');
    };

    const handleResetSettings = () => {
        if (window.confirm('Tem certeza que deseja resetar as configurações para os valores padrão?')) {
            // Reset para valores padrão (implementar conforme necessário)
            setHasChanges(false);
            alert('Configurações resetadas!');
        }
    };

    const addIpToWhitelist = () => {
        if (newIpAddress && !settings.security.ipWhitelist.includes(newIpAddress)) {
            handleSettingChange('security', 'ipWhitelist', [...settings.security.ipWhitelist, newIpAddress]);
            setNewIpAddress('');
        }
    };

    const removeIpFromWhitelist = (ip: string) => {
        handleSettingChange('security', 'ipWhitelist', settings.security.ipWhitelist.filter(item => item !== ip));
    };

    const handleTestConnection = () => {
        alert('Testando conexão com o banco de dados...');
    };

    const handleBackupNow = () => {
        alert('Iniciando backup manual...');
    };

    const handleImportSettings = () => {
        alert('Função de importação de configurações');
    };

    const handleExportSettings = () => {
        alert('Baixando configurações...');
    };

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Sistema</label>
                    <input
                        type="text"
                        value={settings.general.systemName}
                        onChange={(e) => handleSettingChange('general', 'systemName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuso Horário</label>
                    <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                        <option value="America/New_York">Nova York (GMT-5)</option>
                        <option value="Europe/London">Londres (GMT+0)</option>
                        <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Data</label>
                    <select
                        value={settings.general.dateFormat}
                        onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                        <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                        <option value="YYYY-MM-DD">AAAA-MM-DD</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                    <select
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Log</label>
                    <select
                        value={settings.general.logLevel}
                        onChange={(e) => handleSettingChange('general', 'logLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Opções do Sistema</h3>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.general.maintenanceMode}
                            onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Modo de manutenção</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.general.autoUpdates}
                            onChange={(e) => handleSettingChange('general', 'autoUpdates', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Atualizações automáticas</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.general.debugMode}
                            onChange={(e) => handleSettingChange('general', 'debugMode', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Modo debug</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho Mínimo da Senha</label>
                    <input
                        type="number"
                        min="6"
                        max="20"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeout de Sessão (minutos)</label>
                    <input
                        type="number"
                        min="5"
                        max="480"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Tentativas de Login</label>
                    <input
                        type="number"
                        min="3"
                        max="10"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logout Automático (minutos)</label>
                    <input
                        type="number"
                        min="30"
                        max="720"
                        value={settings.security.autoLogoutTime}
                        onChange={(e) => handleSettingChange('security', 'autoLogoutTime', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Políticas de Segurança</h3>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.security.requireSpecialChars}
                            onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Exigir caracteres especiais na senha</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Autenticação de dois fatores</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.security.sslOnly}
                            onChange={(e) => handleSettingChange('security', 'sslOnly', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Permitir apenas conexões SSL</span>
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Lista de IPs Permitidos</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="192.168.1.1"
                        value={newIpAddress}
                        onChange={(e) => setNewIpAddress(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={addIpToWhitelist}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-2">
                    {settings.security.ipWhitelist.map((ip, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <span className="text-sm text-gray-700">{ip}</span>
                            <button
                                onClick={() => removeIpFromWhitelist(ip)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Servidor de Email</label>
                    <input
                        type="text"
                        value={settings.notifications.emailServer}
                        onChange={(e) => handleSettingChange('notifications', 'emailServer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Porta SMTP</label>
                    <input
                        type="number"
                        value={settings.notifications.smtpPort}
                        onChange={(e) => handleSettingChange('notifications', 'smtpPort', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Tipos de Notificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Notificações por email</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notifications.pushNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Push notifications</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notifications.smsNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Notificações SMS</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notifications.systemAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Alertas do sistema</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notifications.userActivityAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'userActivityAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Alertas de atividade</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notifications.securityAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'securityAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Alertas de segurança</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notifications.maintenanceAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'maintenanceAlerts', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Alertas de manutenção</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderDatabaseSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host do Banco</label>
                    <input
                        type="text"
                        value={settings.database.host}
                        onChange={(e) => handleSettingChange('database', 'host', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Porta</label>
                    <input
                        type="number"
                        value={settings.database.port}
                        onChange={(e) => handleSettingChange('database', 'port', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Banco</label>
                    <input
                        type="text"
                        value={settings.database.name}
                        onChange={(e) => handleSettingChange('database', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pool de Conexões</label>
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={settings.database.connectionPool}
                        onChange={(e) => handleSettingChange('database', 'connectionPool', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequência de Backup</label>
                    <select
                        value={settings.database.backupFrequency}
                        onChange={(e) => handleSettingChange('database', 'backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retenção (dias)</label>
                    <input
                        type="number"
                        min="1"
                        max="365"
                        value={settings.database.retentionDays}
                        onChange={(e) => handleSettingChange('database', 'retentionDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Opções de Backup</h3>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.database.autoBackup}
                            onChange={(e) => handleSettingChange('database', 'autoBackup', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Backup automático</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.database.compressionEnabled}
                            onChange={(e) => handleSettingChange('database', 'compressionEnabled', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Compressão habilitada</span>
                    </label>
                </div>
            </div>

            <div className="flex space-x-3">
                <button
                    onClick={handleTestConnection}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Testar Conexão
                </button>
                <button
                    onClick={handleBackupNow}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Backup Manual
                </button>
            </div>
        </div>
    );

    const renderIntegrationsSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Limite de API (req/min)</label>
                    <input
                        type="number"
                        value={settings.integrations.apiRateLimit}
                        onChange={(e) => handleSettingChange('integrations', 'apiRateLimit', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tentativas de Webhook</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={settings.integrations.webhookRetries}
                        onChange={(e) => handleSettingChange('integrations', 'webhookRetries', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeout API Externa (seg)</label>
                    <input
                        type="number"
                        min="5"
                        max="300"
                        value={settings.integrations.externalApiTimeout}
                        onChange={(e) => handleSettingChange('integrations', 'externalApiTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                    <input
                        type="text"
                        placeholder="GA-XXXXXXXXX"
                        value={settings.integrations.googleAnalytics}
                        onChange={(e) => handleSettingChange('integrations', 'googleAnalytics', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slack Webhook URL</label>
                    <input
                        type="url"
                        placeholder="https://hooks.slack.com/..."
                        value={settings.integrations.slackWebhook}
                        onChange={(e) => handleSettingChange('integrations', 'slackWebhook', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discord Webhook URL</label>
                    <input
                        type="url"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={settings.integrations.discordWebhook}
                        onChange={(e) => handleSettingChange('integrations', 'discordWebhook', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Opções de Integração</h3>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.integrations.enableAnalytics}
                            onChange={(e) => handleSettingChange('integrations', 'enableAnalytics', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Habilitar analytics</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.integrations.enableLogging}
                            onChange={(e) => handleSettingChange('integrations', 'enableLogging', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Habilitar logging</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderAppearanceSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                    <select
                        value={settings.appearance.theme}
                        onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="light">Claro</option>
                        <option value="dark">Escuro</option>
                        <option value="auto">Automático</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho da Fonte</label>
                    <select
                        value={settings.appearance.fontSize}
                        onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="small">Pequeno</option>
                        <option value="medium">Médio</option>
                        <option value="large">Grande</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Família da Fonte</label>
                    <select
                        value={settings.appearance.fontFamily}
                        onChange={(e) => handleSettingChange('appearance', 'fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
                    <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                    <input
                        type="color"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Destaque</label>
                    <input
                        type="color"
                        value={settings.appearance.accentColor}
                        onChange={(e) => handleSettingChange('appearance', 'accentColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Opções de Interface</h3>
                <div className="space-y-3">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.appearance.compactMode}
                            onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Modo compacto</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.appearance.showTooltips}
                            onChange={(e) => handleSettingChange('appearance', 'showTooltips', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">Mostrar tooltips</span>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Prévia das Cores</h4>
                <div className="flex space-x-3">
                    <div
                        className="w-12 h-12 rounded-lg border"
                        style={{ backgroundColor: settings.appearance.primaryColor }}
                        title="Cor Primária"
                    ></div>
                    <div
                        className="w-12 h-12 rounded-lg border"
                        style={{ backgroundColor: settings.appearance.secondaryColor }}
                        title="Cor Secundária"
                    ></div>
                    <div
                        className="w-12 h-12 rounded-lg border"
                        style={{ backgroundColor: settings.appearance.accentColor }}
                        title="Cor de Destaque"
                    ></div>
                </div>
            </div>
        </div>
    );

    const renderActiveCategory = () => {
        switch (activeCategory) {
            case 'general':
                return renderGeneralSettings();
            case 'security':
                return renderSecuritySettings();
            case 'notifications':
                return renderNotificationSettings();
            case 'database':
                return renderDatabaseSettings();
            case 'integrations':
                return renderIntegrationsSettings();
            case 'appearance':
                return renderAppearanceSettings();
            default:
                return renderGeneralSettings();
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
                                        text="Configurações do Sistema"
                                        className="text-3xl font-bold text-gray-900"
                                        delay={0.2}
                                    />
                                    <BusinessAnimatedText
                                        text="Gerencie todas as configurações e políticas do sistema"
                                        className="text-lg text-gray-600 mt-2"
                                        delay={0.4}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Settings className="w-12 h-12 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </BusinessCard>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <BusinessCard delay={0.3} className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <BusinessAnimatedText
                                text="Categorias"
                                className="text-lg font-semibold text-gray-900 mb-4"
                                delay={0.4}
                            />
                            <nav className="space-y-2">
                                {settingsCategories.map((category, index) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${activeCategory === category.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`mr-3 ${activeCategory === category.id ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {category.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{category.name}</div>
                                            <div className="text-xs text-gray-500">{category.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </BusinessCard>

                    {/* Settings Content */}
                    <BusinessCard delay={0.5} className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <BusinessAnimatedText
                                    text={settingsCategories.find(c => c.id === activeCategory)?.name || 'Configurações'}
                                    className="text-xl font-semibold text-gray-900"
                                    delay={0.6}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleImportSettings}
                                        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        <Upload className="w-4 h-4 mr-1" />
                                        Importar
                                    </button>
                                    <button
                                        onClick={handleExportSettings}
                                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        Exportar
                                    </button>
                                </div>
                            </div>

                            {renderActiveCategory()}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                                <button
                                    onClick={handleResetSettings}
                                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Resetar
                                </button>

                                <div className="flex space-x-3">
                                    {hasChanges && (
                                        <span className="flex items-center text-sm text-yellow-600">
                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                            Alterações não salvas
                                        </span>
                                    )}
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isSaving || !hasChanges}
                                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                                    >
                                        {isSaving ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Salvar Configurações
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </BusinessCard>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
