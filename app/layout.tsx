import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({

  variable: "--font-geist-sans",

  subsets: ["latin"],

});


const geistMono = Geist_Mono({

  variable: "--font-geist-mono",

  subsets: ["latin"],

});



export const metadata: Metadata = {

  title:
    "Dental Revenue Recovery Calculator",

  description:
    "Calculate how much revenue your dental practice is losing from missed calls and discover recovery opportunities.",

};



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {


  return (

    <html

      lang="en"

      className={`${geistSans.variable} ${geistMono.variable} h-full`}

    >

      <body className="min-h-full">

        {children}

      </body>

    </html>

  );

}