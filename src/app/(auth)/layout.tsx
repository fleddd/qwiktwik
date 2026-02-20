import type { Metadata } from "next";
import GridBackground from "@/components/GridBackground";
import "../../styles/globals.css";
import SmoothScroll from "@/components/SmoothScroll";


export const metadata: Metadata = {
    title: "QwikTwik - PC Optimization Utility",
    description: "Maximize FPS and minimize input lag.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SmoothScroll>
            <GridBackground />
            <main>
                {children}
            </main>
        </SmoothScroll>
    );
}