import "./globals.css";
import type { ReactNode } from "react";
import Image from "next/image";
import Logo from "../logo.png";

export const metadata = {
  title: "Elite Immobilier • Chat Agent",
  description: "Chat with Elite Immobilier about property management in Gatineau."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-white text-brand-deep antialiased">
        <header className="border-b border-brand-deep/10">
          <div className="container-max px-6 py-4 flex items-center gap-3">
            <div className="shrink-0">
              <Image src={Logo} alt="Elite Immobilier logo" width={28} height={28} priority className="rounded-sm" />
            </div>
            <div className="font-semibold tracking-tight text-brand-deep">Elite Immobilier</div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

