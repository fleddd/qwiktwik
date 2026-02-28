'use client';

import { ReactLenis } from 'lenis/react';
import React from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1, // 0.1 - чудово для ПК
                duration: 1.2, // Трохи збільшив для плавності
                smoothWheel: true,
                wheelMultiplier: 1.0,

                // Синхронізує нативний скрол пальцем із віртуальним скролом Lenis
                syncTouch: true,
                // Робимо тач трохи більш чутливим, бо syncTouch може здаватись "тугим"
                touchMultiplier: 2.0,

                // Додатково: допомагає зберегти інерцію
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}