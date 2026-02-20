'use client';

import React, { useState, useRef } from 'react';

interface SliderProps {
    children: React.ReactNode;
    // Дозволяє налаштувати сітку для десктопу (за замовчуванням 3 колонки)
    desktopGridClasses?: string;
}

export default function Slider({
    children,
    desktopGridClasses = "md:grid-cols-2 lg:grid-cols-3"
}: SliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Точно визначаємо, яка картка зараз по центру екрана
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollPosition = container.scrollLeft + container.offsetWidth / 2;

        let active = 0;
        let minDistance = Infinity;

        Array.from(container.children).forEach((child, index) => {
            const htmlChild = child as HTMLElement;
            const childCenter = htmlChild.offsetLeft + htmlChild.offsetWidth / 2;
            const distance = Math.abs(childCenter - scrollPosition);

            if (distance < minDistance) {
                minDistance = distance;
                active = index;
            }
        });

        setActiveIndex(active);
    };

    const scrollTo = (index: number) => {
        if (!scrollRef.current) return;
        const child = scrollRef.current.children[index] as HTMLElement;
        if (child) {
            // Центруємо обраний слайд
            const scrollLeft = child.offsetLeft - scrollRef.current.offsetWidth / 2 + child.offsetWidth / 2;
            scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    };

    const childrenArray = React.Children.toArray(children);

    return (
        <div className="w-full relative">
            {/* Контейнер: на мобільному flex + snap, на десктопі grid */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={`flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar md:grid ${desktopGridClasses} md:gap-6 md:pb-0 md:overflow-visible md:snap-none`}
            >
                {childrenArray.map((child, i) => (
                    // Ширина 85vw на мобільному дозволяє побачити краєчок наступної картки
                    <div key={i} className="min-w-[85vw] sm:min-w-[320px] snap-center shrink-0 md:min-w-0 md:w-auto md:shrink-1 h-full">
                        {child}
                    </div>
                ))}
            </div>

            {/* Мобільні індикатори (Dots) - сховані на десктопі */}
            <div className="flex justify-center items-center gap-2 mt-4 md:hidden">
                {childrenArray.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i
                            ? 'bg-accent w-6'
                            : 'bg-white/20 w-2 hover:bg-white/40'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
}