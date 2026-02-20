'use client';

import { ReactLenis } from 'lenis/react';
import React from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.06,
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1.1,
                touchMultiplier: 2,
            }}
        >
            {children}
        </ReactLenis>
    );
}