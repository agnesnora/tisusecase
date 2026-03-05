import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Bebas_Neue, Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import "./globals.scss";
import styles from "./Layout.module.scss";
import { getLocale } from "next-intl/server";

import Providers from "@/app/providers/Providers";

import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider } from "next-intl";
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-primary",
});

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgnesNora Studio TisUsecase",
  description: "Energy dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body
        className={`${bebasNeue.variable} ${plusJakartaSans.variable} ${inter.variable}`}
      >
        <NextIntlClientProvider>
          {" "}
          <Providers>
            <div className={styles.appContainer}>
              <Navbar />
              <div className={styles.mainContainer}>
                <Header />
                <main>{children}</main>
              </div>
            </div>
            <ToastContainer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
