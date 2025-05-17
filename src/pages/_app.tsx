import "@/styles/globals.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";

import { api } from "@/utils/api";
import { ThemeProvider } from "@/components/theme-provider";
import { Poppins } from "next/font/google";
import Head from "next/head";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const isDashboardRoute = router.pathname.startsWith("/dashboard");

  return (
    <>
      <Head>
        <title>kkü | sınav takvim</title>
        <meta name="description" content="kku schedule app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isDashboardRoute ? (
            <SidebarProvider>
              <main
                className={`font-sans ${poppins.variable} w-full h-screen md:grid md:grid-cols-[260px_1fr] md:grid-rows-[auto_1fr]`}
              >
                <div className="md:row-span-2">
                  <AppSidebar />
                </div>
                <div className="md:col-start-2 md:row-start-1">
                  <Navbar />
                </div>
                <div className="md:col-start-2 md:row-start-2 md:overflow-auto">
                  <Component {...pageProps} />
                  <Toaster />
                </div>
              </main>
            </SidebarProvider>
          ) : (
            <main  className={`font-sans ${poppins.variable} w-full h-screen`}>
              <Navbar />
              <Component {...pageProps} />
              <Toaster />
            </main>
          )}
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
