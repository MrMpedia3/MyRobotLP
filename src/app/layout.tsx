import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "MyRobot Araraquara | Robótica Educacional e Programação",
    template: "%s | MyRobot Araraquara",
  },
  description: site.descricao,
  keywords: [
    "robótica educacional",
    "curso de robótica Araraquara",
    "programação para crianças",
    "escola de robótica",
    "Arduino para crianças",
    "Scratch",
    "empreendedorismo infantil",
    "Araraquara",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.nome,
    title: "MyRobot Araraquara | Robótica Educacional e Programação",
    description: site.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: "MyRobot Araraquara | Robótica Educacional e Programação",
    description: site.descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Os ícones vêm da convenção de arquivos do App Router
  // (src/app/icon.png e src/app/apple-icon.png), então não são declarados aqui.
};

export const viewport: Viewport = {
  themeColor: "#F97316",
};

const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.nome,
  description: site.descricao,
  url: site.url,
  telephone: site.telefone,
  sameAs: [site.instagram],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.endereco.rua,
    addressLocality: site.endereco.cidade,
    addressRegion: site.endereco.estado,
    addressCountry: site.endereco.pais,
  },
  areaServed: { "@type": "City", name: site.endereco.cidade },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
      </body>
    </html>
  );
}
