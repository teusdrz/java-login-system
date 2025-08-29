import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface TypewriterProps {
    texts: string[];
    speed?: number;
    delay?: number;
    loop?: boolean;
    className?: string;
    onComplete?: () => void;
    styleType?: 'corporate' | 'console' | 'character' | 'multiline';
    showCursor?: boolean;
    pauseBetween?: number;
}

const TypewriterAnimation: React.FC<TypewriterProps> = ({
    texts,
    speed = 100,
    delay = 0,
    loop = false,
    className = '',
    onComplete,
    styleType = 'corporate',
    showCursor = true,
    pauseBetween = 1000
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [showBlinkingCursor, setShowBlinkingCursor] = useState(showCursor);

    const handleTextComplete = useCallback(() => {
        setTimeout(() => {
            if (currentTextIndex < texts.length - 1) {
                setCurrentTextIndex(prev => prev + 1);
            } else if (loop) {
                setCurrentTextIndex(0);
            } else {
                setShowBlinkingCursor(true);
                onComplete?.();
            }
        }, pauseBetween);
    }, [currentTextIndex, texts.length, loop, onComplete, pauseBetween]);

    // Corporate style typewriter effect
    const corporateTypewriter = useCallback(() => {
        const currentText = texts[currentTextIndex];
        let charIndex = 0;
        setDisplayText('');

        const typeChar = () => {
            if (charIndex < currentText.length) {
                setDisplayText(prev => prev + currentText[charIndex]);
                charIndex++;

                // Add slight typing pulse effect
                if (containerRef.current) {
                    gsap.to(containerRef.current, {
                        scale: 1.02,
                        duration: 0.05,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut"
                    });
                }

                setTimeout(typeChar, speed + Math.random() * 50); // Natural typing variation
            } else {
                handleTextComplete();
            }
        };

        setTimeout(typeChar, delay);
    }, [texts, currentTextIndex, speed, delay, handleTextComplete]);

    // Character-by-character animation with GSAP
    const characterTypewriter = useCallback(() => {
        if (!containerRef.current) return;

        const currentText = texts[currentTextIndex];
        setDisplayText(currentText);

        // Split text into individual characters
        const chars = currentText.split('').map((char, index) => (
            `<span class="char" style="opacity: 0; transform: translateY(10px) scale(0.8);">${char === ' ' ? '&nbsp;' : char}</span>`
        )).join('');

        containerRef.current.innerHTML = chars;

        const charElements = containerRef.current.querySelectorAll('.char');

        gsap.timeline()
            .set(charElements, { opacity: 0, y: 10, scale: 0.8 })
            .to(charElements, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.1,
                stagger: speed / 1000,
                ease: "back.out(1.7)",
                onComplete: () => {
                    handleTextComplete();
                }
            });
    }, [texts, currentTextIndex, speed, handleTextComplete]);

    // Console style typewriter
    const consoleTypewriter = useCallback(() => {
        const currentText = texts[currentTextIndex];
        let charIndex = 0;
        setDisplayText('$ ');

        const typeChar = () => {
            if (charIndex < currentText.length) {
                setDisplayText(prev => prev + currentText[charIndex]);
                charIndex++;
                setTimeout(typeChar, speed);
            } else {
                handleTextComplete();
            }
        };

        setTimeout(typeChar, delay);
    }, [texts, currentTextIndex, speed, delay, handleTextComplete]);

    // Multiline typewriter effect
    const multilineTypewriter = useCallback(() => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = '';
        const lines = texts[currentTextIndex].split('\n');

        let currentLineIndex = 0;

        const typeLine = () => {
            if (currentLineIndex < lines.length) {
                const lineElement = document.createElement('div');
                lineElement.className = 'line';
                lineElement.style.cssText = `
                    overflow: hidden;
                    white-space: nowrap;
                    opacity: 0;
                    border-right: 2px solid #3b82f6;
                `;

                containerRef.current?.appendChild(lineElement);

                // Animate line appearance
                gsap.to(lineElement, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });

                // Type the line
                let charIndex = 0;
                const currentLine = lines[currentLineIndex];

                const typeChar = () => {
                    if (charIndex < currentLine.length) {
                        lineElement.textContent += currentLine[charIndex];
                        charIndex++;
                        setTimeout(typeChar, speed);
                    } else {
                        // Remove cursor from completed line
                        lineElement.style.borderRight = 'none';
                        currentLineIndex++;
                        setTimeout(typeLine, pauseBetween / 2);
                    }
                };

                setTimeout(typeChar, 300);
            } else {
                handleTextComplete();
            }
        };

        setTimeout(typeLine, delay);
    }, [texts, currentTextIndex, speed, delay, pauseBetween, handleTextComplete]);

    useEffect(() => {
        if (texts.length === 0) return;

        const executeTypewriter = () => {
            switch (styleType) {
                case 'console':
                    consoleTypewriter();
                    break;
                case 'character':
                    characterTypewriter();
                    break;
                case 'multiline':
                    multilineTypewriter();
                    break;
                default:
                    corporateTypewriter();
                    break;
            }
        };

        executeTypewriter();
    }, [currentTextIndex, texts, styleType, corporateTypewriter, consoleTypewriter, characterTypewriter, multilineTypewriter]);

    const getStyleClasses = () => {
        const baseClasses = 'typewriter-container';
        const styleClasses = {
            corporate: 'typewriter-text corporate-text',
            console: 'console-typewriter',
            character: 'typewriter-chars corporate-text',
            multiline: 'typewriter-multiline corporate-text'
        };

        return `${baseClasses} ${styleClasses[styleType]} ${className}`;
    };

    const getCursorStyle = () => {
        if (!showCursor || !showBlinkingCursor) return {};

        const cursorStyles = {
            corporate: {
                borderRight: '3px solid #3b82f6',
                animation: 'blinking-cursor 1s infinite step-end'
            },
            console: {
                borderRight: '2px solid #10b981',
                animation: 'consoleCursor 1s infinite step-end'
            },
            character: {
                borderRight: '2px solid #3b82f6',
                animation: 'blinking-cursor 1s infinite step-end'
            },
            multiline: {}
        };

        return cursorStyles[styleType];
    };

    if (styleType === 'multiline' || styleType === 'character') {
        return (
            <div
                ref={containerRef}
                className={getStyleClasses()}
                style={getCursorStyle()}
            />
        );
    }

    return (
        <div className={getStyleClasses()}>
            {styleType === 'console' ? (
                <span
                    ref={containerRef}
                    className="command"
                    style={{
                        ...getCursorStyle(),
                        display: 'inline-block'
                    }}
                >
                    {displayText}
                </span>
            ) : (
                <span
                    ref={containerRef}
                    style={getCursorStyle()}
                >
                    {displayText}
                </span>
            )}
        </div>
    );
};

export default TypewriterAnimation;
