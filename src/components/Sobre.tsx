"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Sobre() {

  // TEXTOS DO SLIDER
  const textos = [
    "Muito mais que uma escola de robótica, somos um espaço de aprendizado, criatividade e inovação. Nossos cursos despertam curiosidade e interesse pela tecnologia.",

    "Na MyRobot, a criança cria, testa, erra, aprende e evolui de forma divertida e inteligente.",

    "Mais que aulas, entregamos habilidades que farão a diferença na escola e no futuro.",
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // LOOP DO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % textos.length);
        setVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="Sobre"
      className="
        relative w-full min-h-screen
        flex items-center justify-center
        overflow-hidden bg-white
        px-6
        scroll-mt-20
      "
    >
      {/*BACKGROUND*/}
      <div className="absolute inset-0 scale-110">
        <Image
          src="/images/pexels-vanessa-loring-7869229.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-secondary md:bg-black/50" />

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
          className={`
            bg-accent-mint/30 backdrop-blur-md
            border border-white/10
            rounded-xl
            p-5
            text-sm text-justify text-white/90
            transition-all duration-500
            ${visible
              ? "opacity-100 translate-y-0 blur-0"
              : "opacity-0 translate-y-2 blur-sm"}
          `}
        >
          {textos[index]}
        </p>

        {/* BOTÃO */}
        <a href="https://myrobot.com.br" className="mt-2 bg-primary px-6 py-3 rounded-full font-medium shadow-lg hover:scale-105 active:scale-95 transition inline-block">
          Conheça mais
        </a>
      </div>
    </section>
  );
}