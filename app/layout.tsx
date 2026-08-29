import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revenue Recovery Calculator",
  description:
    "Calculate the potential revenue opportunity from missed patient enquiries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Meta Pixel */}

        <Script id="meta-pixel" strategy="afterInteractive">
          {`

!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function()
{n.callMethod?
n.callMethod.apply(n,arguments):
n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;
n.push=n;
n.loaded=!0;
n.version='2.0';
n.queue=[];
t=b.createElement(e);
t.async=!0;
t.src=v;
s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}
(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');


fbq('init',
'${process.env.NEXT_PUBLIC_META_PIXEL_ID}'
);


fbq('track','PageView');

`}
        </Script>

        {/* Google Ads Tag */}

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-ads" strategy="afterInteractive">
          {`

window.dataLayer = window.dataLayer || [];

function gtag(){
dataLayer.push(arguments);
}

gtag('js', new Date());


gtag(
'config',
'${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}'
);

`}
        </Script>
      </body>
    </html>
  );
}
