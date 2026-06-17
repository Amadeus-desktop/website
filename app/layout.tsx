import type { Metadata } from "next";
import { APP_NAME, APP_TAGLINE } from "@/shared/config/app";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME} - ${APP_TAGLINE}`,
  description:
    "상상 속 캐릭터와 실시간 대화하고, 특별한 이야기를 만들어보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
