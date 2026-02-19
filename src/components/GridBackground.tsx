export default function GridBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden" aria-hidden="true">
            <svg className="absolute w-full h-full text-white/[0.07]" xmlns="http://www.w3.org/2000/svg">
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