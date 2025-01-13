import type { Metadata } from "next";
import { geistMono, geistSans } from "@/app/fonts";
import { NavigationWrapper } from "@/components/navigation-wrapper";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "./globals.css";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Upcord",
  description: "Discord client for developers",
};

function getIsAuthPage() {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "/";
  return pathname.startsWith("/auth");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthPage = getIsAuthPage();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", geistSans.variable, geistMono.variable)}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {!isAuthPage && <NavigationWrapper />}
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
