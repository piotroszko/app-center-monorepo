import { Provider } from "@repo/trpc/providers/provider";
import { Toaster } from "@repo/ui/components/ui/toaster";
import "@repo/ui/globals.css";
import { ThemeProvider } from "@repo/ui/theme/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App Center",
  description: "App Center is a platform for accessing all your apps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Head key={"favicon"}>
        <link rel="icon" href="/favicon.ico" key={"favicon-link"} />
      </Head>
      <Provider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  );
}
