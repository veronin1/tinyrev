import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const mono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
    title: "tinyrev",
    description: "tinyrev - tiny reviews",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="scroll-smooth">
        <body
            className={`${geist.className} ${mono.className} bg-neutral-50 text-neutral-900 antialiased`}
        >
        <div className="min-h-screen flex flex-col">{children}</div>
        </body>
        </html>
    );
}
