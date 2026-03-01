"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// --- НАЛАШТУВАННЯ АНІМАЦІЇ ---
const FRAME_COUNT = 102; // Твої 55 кадрів
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// --- НАЛАШТУВАННЯ ДИНАМІКИ ---
// Швидкість "дихання", коли юзер не скролить. Збільш, якщо хочеш швидше.
const IDLE_SPEED = 0.002;
// Скільки разів анімація змінить напрямок за всю висоту сторінки.
const SCROLL_CYCLES = 4.0;

const getFramePath = (index: number) =>
    `/animation/bg_${index.toString().padStart(3, '0')}.webp`;

export default function GridBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    const currentFrame = useRef<number>(0);

    // Нові рефи для гібридного приводу
    const scrollYRef = useRef<number>(0);
    const timeOffset = useRef<number>(0);

    // 1. Preload
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        const onLoad = () => {
            loadedCount++;
            if (loadedCount === FRAME_COUNT) {
                imagesRef.current = imgArray;
                setImagesLoaded(true);
            }
        };

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = onLoad;
            img.onerror = () => console.error(`Не знайдено: ${getFramePath(i)}`);
            imgArray.push(img);
        }
    }, []);

    // 2. Малювання кадру
    const drawFrame = useCallback((index: number) => {
        const ctx = contextRef.current;
        const img = imagesRef.current[index];

        if (ctx && img && imagesLoaded) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            const imgRatio = img.width / img.height;
            const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

            let drawWidth, drawHeight, drawX, drawY;

            if (imgRatio > canvasRatio) {
                drawHeight = CANVAS_HEIGHT;
                drawWidth = CANVAS_HEIGHT * imgRatio;
                drawX = (CANVAS_WIDTH - drawWidth) / 2;
                drawY = 0;
            } else {
                drawWidth = CANVAS_WIDTH;
                drawHeight = CANVAS_WIDTH / imgRatio;
                drawX = 0;
                drawY = (CANVAS_HEIGHT - drawHeight) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }
    }, [imagesLoaded]);

    // 3. Гібридний цикл анімації (Скрол + Час)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        contextRef.current = canvas.getContext("2d", { alpha: true });
        let animationFrameId: number;

        // Тепер подія scroll просто записує позицію (дуже дешева операція)
        const handleScroll = (): void => {
            scrollYRef.current = window.scrollY;
        };

        const updateAnimation = (): void => {
            if (imagesLoaded) {
                // 1. Час йде вперед незалежно від скролу
                timeOffset.current += IDLE_SPEED;

                // 2. Вираховуємо прогрес скролу
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollFraction = docHeight > 0 ? scrollYRef.current / docHeight : 0;

                // 3. МАГІЯ: Об'єднуємо скрол і час
                const totalProgress = (scrollFraction * SCROLL_CYCLES) + timeOffset.current;

                // 4. Математика Ping-Pong
                const currentCycle = Math.floor(totalProgress);
                const cycleProgress = totalProgress - currentCycle;
                const isForward = currentCycle % 2 === 0;
                const frameProgress = isForward ? cycleProgress : (1 - cycleProgress);

                // 5. Визначаємо цільовий кадр
                const targetFrame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(frameProgress * (FRAME_COUNT - 1))));

                // 6. Згладжування (Lerp)
                const diff = targetFrame - currentFrame.current;
                currentFrame.current += diff * 0.1;

                if (Math.abs(diff) > 0.01) {
                    drawFrame(Math.round(currentFrame.current));
                }
            }
            animationFrameId = requestAnimationFrame(updateAnimation);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        animationFrameId = requestAnimationFrame(updateAnimation);

        if (imagesLoaded && imagesRef.current[0]) {
            drawFrame(0);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [imagesLoaded, drawFrame]);

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-bg-dark" aria-hidden="true">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className={`absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 ${imagesLoaded ? 'opacity-20' : 'opacity-0'}`}
            />

            <svg className="absolute w-full h-full text-white/10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="1.5" height="1.5" fill="currentColor" x="0" y="0" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-bg-dark)_100%)]"></div>
        </div>
    );
}