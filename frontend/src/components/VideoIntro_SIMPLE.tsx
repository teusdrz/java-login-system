import React, { useRef, useEffect, useState } from 'react';
import './VideoIntro.css';

interface VideoIntroProps {
    onComplete: () => void;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        console.log('🎬 VideoIntro: Inicializando...');

        const tryPlayWithSound = async () => {
            try {
                // TENTATIVA 1: Play direto com som
                video.muted = false;
                video.volume = 1.0;
                await video.play();

                console.log('✅ Vídeo rodando COM SOM!');
                setAudioEnabled(true);

            } catch (error) {
                console.log('⚠️ Bloqueado pelo browser, tentando fallback...');

                try {
                    // TENTATIVA 2: Play muted primeiro
                    video.muted = true;
                    await video.play();

                    // Tenta ativar som após 500ms
                    setTimeout(() => {
                        video.muted = false;
                        video.volume = 1.0;
                        setAudioEnabled(true);
                        console.log('🔊 Som ativado após delay!');
                    }, 500);

                } catch (secondError) {
                    console.log('❌ Precisa de interação do usuário');
                    setShowHint(true);

                    // Play muted
                    video.muted = true;
                    video.play().catch(console.error);
                }
            }
        };

        // Event listeners
        const handleCanPlay = () => {
            console.log('📹 Vídeo carregado, tentando reproduzir...');
            tryPlayWithSound();
        };

        const handleEnded = () => {
            console.log('🎬 Vídeo terminou!');
            setTimeout(() => {
                onComplete();
            }, 500);
        };

        const handleError = (e: any) => {
            console.error('❌ Erro no vídeo:', e);
        };

        // Click para ativar áudio se necessário
        const handleClick = () => {
            if (video.muted) {
                video.muted = false;
                video.volume = 1.0;
                setAudioEnabled(true);
                setShowHint(false);
                console.log('🔊 Áudio ativado por clique!');
            }
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('error', handleError);
        video.addEventListener('click', handleClick);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('error', handleError);
            video.removeEventListener('click', handleClick);
        };
    }, [onComplete]);

    return (
        <div className="video-intro-container">
            <video
                ref={videoRef}
                className="intro-video"
                autoPlay
                playsInline
                preload="auto"
                controls={false}
            >
                <source
                    src="/videoforIntro/watermarked-dbfcf2d4-29b6-415e-8070-d669de5a0283.mp4"
                    type="video/mp4"
                />
                Seu navegador não suporta vídeo.
            </video>

            {/* Indicador de áudio */}
            {audioEnabled && (
                <div className="audio-indicator">
                    <div className="audio-waves">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    🔊
                </div>
            )}

            {/* Hint para ativar áudio */}
            {showHint && (
                <div className="audio-activation-hint">
                    Clique para ativar o áudio 🔊
                </div>
            )}
        </div>
    );
};

export default VideoIntro;
