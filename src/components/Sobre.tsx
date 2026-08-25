"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// TEXTOS DO SLIDER — fora do componente: são constantes, não precisam
// ser recriados a cada render nem entrar nas dependências do efeito.
const textos = [
  "Muito mais que uma escola de robótica, somos um espaço de aprendizado, criatividade e inovação. Nossos cursos despertam curiosidade e interesse pela tecnologia.",
  "Na MyRobot, a criança cria, testa, erra, aprende e evolui de forma divertida e inteligente.",
  "Mais que aulas, entregamos habilidades que farão a diferença na escola e no futuro.",
];

export default function Sobre() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // LOOP DO SLIDE
  useEffect(() => {
    let timeoutTroca: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      setVisible(false);

      timeoutTroca = setTimeout(() => {
        setIndex((prev) => (prev + 1) % textos.length);
        setVisible(true);
      }, 500);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutTroca);
    };
  }, []);

  return (
    <div
      className="
        relative w-full min-h-[100dvh]
        flex items-center justify-center
        overflow-hidden bg-secondary
        px-6
        scroll-mt-20
      "
    >
      {/* BACKGROUND — só aparece a partir do md, onde o overlay é translúcido.
          No mobile o overlay é sólido, então nem carregamos a imagem. */}
      <div className="absolute inset-0 scale-110 hidden md:block" aria-hidden>
        <Image
          src="/images/pexels-vanessa-loring-7869229.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-secondary md:bg-black/50" aria-hidden />

      {/* CONTEÚDO */}
      <div
        className="
          relative z-10
          text-white
          max-w-xl
          text-center
          md:text-left
          flex flex-col
          items-center
          gap-6
        "
      >
        {/* TÍTULO */}
        <h2 className="text-3xl font-bold leading-tight">
          Robótica pode ser educativa e divertida!
        </h2>

        {/* CARD COM SLIDER */}
        <p
          aria-live="polite"
          className={`
            bg-accent-mint/85 backdrop-blur-md
            border border-white/40
            rounded-xl
            p-5
            text-sm text-justify text-emerald-950
            transition-all duration-500
            ${visible
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-2 blur-sm"}
          `}
        >
          {textos[index]}
        </p>

        {/* BOTÃO */}
        <a
          href="https://myrobot.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 bg-primary px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 active:scale-95 transition inline-block"
        >
          Conheça mais
        </a>
      </div>
    </div>
  );
}
