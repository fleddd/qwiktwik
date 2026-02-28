'use client';

import { ReactLenis } from 'lenis/react';
import React from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                // 1. Чутливість: чим вище значення, тим менша затримка (0.1 — золота середина)
                lerp: 0.1,

                // 2. Тривалість: трохи менше значення прибере відчуття "важкого" скролу
                duration: 1.0,

                // 3. Плавність зупинки
                smoothWheel: true,

                // 4. Потужність прокрутки: 1.0 — стандарт, щоб не було "ефекту льоду"
                wheelMultiplier: 1.0,

                // 5. Покращення для тачпадів та сенсорів
                touchMultiplier: 1.5,

                // Додатково: допомагає зберегти інерцію
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}