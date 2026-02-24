import type { Metadata, Viewport } from "next";
import { Oxanium } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
const oxanium = Oxanium({
    subsets: ["latin"],
    weight: ["400", "700", "800"], // Беремо жирні накреслення
    variable: "--font-oxanium",    // Створюємо CSS змінну
    display: "swap",
});
export const metadata: Metadata = {
    title: "QwikTwik - PC Optimization Utility",
    description: "Maximize FPS and minimize input lag.",
    appleWebApp: {
        title: "QwikTwik",
        statusBarStyle: "black-translucent",
    },
};

export const viewport: Viewport = {
    colorScheme: "dark",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#050505" },
        { media: "(prefers-color-scheme: dark)", color: "#050505" },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={oxanium.className}>
                <Toaster theme="dark" position="bottom-right" richColors />
                {children}
            </body>
        </html>
    );
}
