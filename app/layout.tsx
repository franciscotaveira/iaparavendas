import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lux Growth IA | Automação Comercial Inteligente",
  description: "IA que qualifica leads, não só responde. Instale um cérebro comercial no seu WhatsApp e pare de perder tempo com curiosos.",
  keywords: ["automação comercial", "IA vendas", "chatbot whatsapp", "qualificação de leads", "agente de vendas IA"],
  authors: [{ name: "Lux Growth IA" }],
  openGraph: {
    title: "Lux Growth IA | O Fim do Lead Desqualificado",
    description: "IA que qualifica leads, não só responde. Instale um cérebro comercial no seu WhatsApp.",
    url: "https://mycodingteam.com",
    siteName: "Lux Growth IA",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lux Growth IA | Automação Comercial Inteligente",
    description: "IA que qualifica leads, não só responde.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "LKq88uN8CSHZx8WJSNDyDR2FisAA51YApbGVrsFpYmU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MH85ZML9');
          `}
        </Script>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C10QGGXKVF"
          strategy="afterInteractive"
        />
        <Script id="ga4-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C10QGGXKVF', {
              page_title: document.title,
              page_location: window.location.href
            });
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ur2tldk81p");
          `}
        </Script>

        {/* Calendly Widget */}
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-blue-500/30`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MH85ZML9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
