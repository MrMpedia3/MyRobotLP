import Image from "next/image";
import Hero from "@/components/Hero";
import Sobre from "@/components/Sobre";
import Carousel from "@/components/Carousel";
import Professores from "@/components/Professores";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";
import { linkWhatsapp } from "@/lib/site";

const MENSAGEM_WHATSAPP =
  "Olá, gostaria de saber mais sobre os cursos de robótica educacional.";

export default function Home() {
  return (
    <main className="relative">

      {/* MOBILE: snap | DESKTOP: scroll livre */}
      <div className="
        h-[100dvh] overflow-y-scroll snap-y snap-mandatory
        md:h-auto md:overflow-visible md:snap-none
      ">

        <section id="Hero" className="min-h-[100dvh] snap-start md:snap-none">
          <Hero />
        </section>
        <div className="md:h-16 bg-secondary" />
        <section id="Sobre" className="min-h-[100dvh] snap-start md:snap-none">
          <Sobre />
        </section>
        <div className="md:h-16 bg-white" />
        <section id="Cursos" className="min-h-[100dvh] snap-start md:snap-none">
          <Carousel />
        </section>
        <div className="md:h-16 bg-white" />
        <section id="Professores" className="min-h-[100dvh] snap-start md:snap-none">
          <Professores />
        </section>

        <section id="Contato" className="min-h-[100dvh] snap-start md:snap-none">
          <Contato />
        </section>

        <section className="snap-start md:snap-none">
          <Footer />
        </section>

      </div>

      {/* BOTÃO WHATSAPP */}
      <a
        href={linkWhatsapp(MENSAGEM_WHATSAPP)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a MyRobot Araraquara no WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        <Image src="/images/ZapLogo.svg" alt="" aria-hidden width={20} height={20} />
      </a>

    </main>
  );
}
