import React, { useRef, useEffect, useState } from 'react';
import './VideoIntro.css';

interface VideoIntroProps {
    onComplete: () => void;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        console.log('🎬 VideoIntro: Inicializando vídeo...');

        const handleCanPlay = () => {
            console.log('📹 Vídeo carregado!');
            setVideoLoaded(true);

            // Reprodução muted para evitar problemas
            video.muted = true;
            video.play().catch(error => {
                console.log('⚠️ Erro na reprodução:', error);
            });
        };

        const handleEnded = () => {
            console.log('🎬 Vídeo finalizado!');
            setTimeout(() => {
                onComplete();
            }, 500);
        };

        const handleError = (e: any) => {
            console.error('❌ Erro no vídeo:', e);
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('error', handleError);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('error', handleError);
        };
    }, [onComplete]);

    return (
        <div className="video-intro-container">
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
                muted
                playsInline
                preload="auto"
                style={{ opacity: videoLoaded ? 1 : 0 }}
            >
                <source
                    src="/videoforIntro/watermarked-dbfcf2d4-29b6-415e-8070-d669de5a0283.mp4"
                    type="video/mp4"
                />
                Seu navegador não suporta vídeo.
            </video>
        </div>
    );
};

export default VideoIntro;