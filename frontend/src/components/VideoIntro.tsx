import React, { useRef, useEffect, useState } from 'react';
import './VideoIntro.css';

interface VideoIntroProps {
    onComplete: () => void;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showTransitionOverlay, setShowTransitionOverlay] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [playAttempted, setPlayAttempted] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        console.log('🎬 Inicializando VideoIntro...');

        // ESTRATÉGIA AGRESSIVA: Força áudio ativo IMEDIATAMENTE
        const initializeVideoWithSound = () => {
            // Configurações IMPERATIVAS para áudio ativo
            video.muted = false;
            video.volume = 1.0;
            video.defaultMuted = false;

            // Remove qualquer atributo muted do HTML
            video.removeAttribute('muted');

            console.log('🔊 FORÇANDO áudio ativo desde o INÍCIO!');
            setAudioEnabled(true);
        };

        // FORÇA áudio antes de qualquer tentativa de reprodução
        initializeVideoWithSound();

        // Estratégia SEGURA e CONTROLADA para áudio ativo
        const playVideo = async () => {
            // Evita múltiplas tentativas simultâneas
            if (playAttempted) {
                console.log('⚠️ Reprodução já tentada, aguardando...');
                return;
            }

            setPlayAttempted(true);

            try {
                console.log('🚀 Iniciando reprodução controlada com som ATIVO...');

                // Pausa qualquer reprodução anterior para evitar conflitos
                video.pause();
                video.currentTime = 0;

                // CONFIGURAÇÕES ULTRA IMPERATIVAS
                video.muted = false;
                video.volume = 1.0;
                video.controls = false;
                video.defaultMuted = false;

                // Aguarda um frame antes de tentar reproduzir
                await new Promise(resolve => requestAnimationFrame(resolve));

                // PRIMEIRA tentativa: Som ativo direto
                await video.play();
                console.log('✅ PERFEITO! Vídeo COM SOM reproduzindo desde o início!');
                setAudioEnabled(true);

            } catch (error) {
                console.log('⚠️ Navegador bloqueou, aplicando estratégia segura:', error);

                try {
                    // Reset antes da segunda tentativa
                    video.pause();
                    video.currentTime = 0;

                    // ESTRATÉGIA INTERMEDIÁRIA: Força som após pequeno delay
                    video.muted = false;
                    video.volume = 1.0;

                    await video.play();

                    // REFORÇA áudio após 100ms
                    setTimeout(() => {
                        if (video && !video.paused) {
                            video.muted = false;
                            video.volume = 1.0;
                            setAudioEnabled(true);
                            console.log('🔊 Som GARANTIDO após reprodução!');
                        }
                    }, 100);

                } catch (secondError) {
                    console.log('⚠️ Usando fallback com interação:', secondError);

                    // FALLBACK SEGURO: Inicia muted, ativa na primeira interação
                    try {
                        video.pause();
                        video.currentTime = 0;
                        video.muted = true;

                        await video.play();

                        // ATIVAÇÃO na primeira interação
                        const instantActivation = () => {
                            if (video && !video.paused) {
                                video.muted = false;
                                video.volume = 1.0;
                                setAudioEnabled(true);
                                video.controls = false;
                                console.log('🔊 ÁUDIO ATIVADO na interação!');
                            }

                            // Remove listeners
                            ['click', 'touchstart', 'keydown', 'mousemove'].forEach(event => {
                                document.removeEventListener(event, instantActivation);
                            });
                        };

                        // Listeners para interação
                        ['click', 'touchstart', 'keydown', 'mousemove'].forEach(event => {
                            document.addEventListener(event, instantActivation, { once: true });
                        });

                    } catch (finalError) {
                        console.error('❌ Erro crítico na reprodução:', finalError);
                        setPlayAttempted(false); // Permite nova tentativa
                    }
                }
            }
        };

        playVideo();

        // Configura comportamento dos controles: APENAS no hover, SEMPRE escondidos por padrão
        const handleMouseEnter = () => {
            // Só mostra controles se realmente precisar (áudio desativado)
            if (video.muted) {
                video.controls = true;
            }
        };

        const handleMouseLeave = () => {
            // SEMPRE esconde controles quando o mouse sai
            video.controls = false;
        };

        // Monitora o progresso do vídeo para fade out e transição
        const handleTimeUpdate = () => {
            const currentTime = video.currentTime;
            const duration = video.duration;

            // FADE OUT do áudio 3 segundos antes do fim (corte seco suave)
            if (duration - currentTime <= 3 && duration - currentTime > 2.5 && video.volume > 0) {
                // Fade out rápido em 0.5 segundos
                const fadeOutInterval = setInterval(() => {
                    if (video.volume > 0.1) {
                        video.volume = Math.max(0, video.volume - 0.1);
                    } else {
                        video.volume = 0;
                        clearInterval(fadeOutInterval);
                    }
                }, 50); // Fade out em 0.5s
            }

            // Inicia a transição 2.5 segundos antes do fim
            if (duration - currentTime <= 2.5 && !isTransitioning) {
                setIsTransitioning(true);
                startSeamlessTransition();
            }
        };

        // Função que cria a transição imperceptível
        const startSeamlessTransition = () => {
            // Fase 1: Overlay gradual que simula continuidade do vídeo
            setShowTransitionOverlay(true);

            // Fase 2: Após 1.8s, inicia o fade para dashboard
            setTimeout(() => {
                container.classList.add('video-to-dashboard-transition');
            }, 1800);

            // Fase 3: Completa a transição após 3.2s total
            setTimeout(() => {
                onComplete();
            }, 3200);
        };

        // Backup: se o vídeo terminar antes da transição programada
        const handleVideoEnd = () => {
            if (!isTransitioning) {
                setIsTransitioning(true);
                // Transição mais rápida se chegou ao final
                container.classList.add('video-to-dashboard-transition');
                setTimeout(() => onComplete(), 1200);
            }
        };

        // Evento OTIMIZADO quando vídeo está pronto
        const handleCanPlay = () => {
            if (playAttempted) return; // Evita múltiplas execuções

            console.log('📹 Vídeo pronto - INICIANDO reprodução controlada!');

            // CONFIGURA áudio ativo
            video.muted = false;
            video.volume = 1.0;
            video.controls = false;
            video.defaultMuted = false;
            setVideoLoaded(true);
            setAudioEnabled(true);

            // INICIA reprodução de forma controlada
            playVideo();
        };

        const handleLoadedData = () => {
            if (videoLoaded) return; // Evita execução duplicada

            console.log('📊 Dados carregados - PRÉ-CONFIGURANDO áudio!');

            // CONFIGURAÇÕES INICIAIS
            video.muted = false;
            video.volume = 1.0;
            video.controls = false;
            video.defaultMuted = false;
            setVideoLoaded(true);
            setAudioEnabled(true);
        };

        const handleLoadedMetadata = () => {
            console.log('📋 Metadados carregados - PREPARANDO reprodução!');

            // PRÉ-CONFIGURA áudio desde os metadados
            video.muted = false;
            video.volume = 1.0;
            video.controls = false;
            video.defaultMuted = false;
            setAudioEnabled(true);
        };

        const handleError = (e: Event) => {
            console.error('❌ Erro no vídeo:', e);
            video.controls = true;
        };

        // Adiciona eventos do vídeo (ordem otimizada para áudio ativo)
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleVideoEnd);
        video.addEventListener('mouseenter', handleMouseEnter);
        video.addEventListener('mouseleave', handleMouseLeave);

        // Tenta reproduzir apenas uma vez quando estiver realmente pronto
        if (video.readyState >= 3 && !playAttempted) { // HAVE_FUTURE_DATA
            console.log('🚀 Vídeo já carregado, iniciando reprodução única');
            setTimeout(() => playVideo(), 100); // Pequeno delay para evitar conflitos
        }

        // Cleanup otimizado
        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('loadeddata', handleLoadedData);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleVideoEnd);
            video.removeEventListener('mouseenter', handleMouseEnter);
            video.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [onComplete, isTransitioning, playAttempted, videoLoaded]);

    return (
        <div ref={containerRef} className="video-intro-container">
            {/* Loading indicator quando vídeo não carregou */}
            {!videoLoaded && (
                <div className="video-loading">
                    <div className="loading-spinner"></div>
                    <p>Carregando vídeo...</p>
                </div>
            )}

            <video
                ref={videoRef}
                className="intro-video"
                autoPlay
                playsInline
                preload="auto"
                loop={false}
                muted={false}
                style={{ opacity: videoLoaded ? 1 : 0 }}
            >
                <source
                    src="/videoforIntro/watermarked-dbfcf2d4-29b6-415e-8070-d669de5a0283.mp4"
                    type="video/mp4"
                />
                Seu navegador não suporta a reprodução de vídeo.
            </video>

            {/* Overlay de transição imperceptível */}
            {showTransitionOverlay && (
                <div className="seamless-transition-overlay">
                    <div className="transition-gradient"></div>
                    <div className="transition-particles"></div>
                    <div className="transition-glow"></div>
                </div>
            )}

            {/* Indicador discreto de áudio */}
            {audioEnabled && (
                <div className="audio-indicator">
                    <div className="audio-wave"></div>
                    <div className="audio-wave"></div>
                    <div className="audio-wave"></div>
                </div>
            )}
        </div>
    );
};

export default VideoIntro;
