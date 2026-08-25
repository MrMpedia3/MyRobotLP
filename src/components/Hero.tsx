"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

const secoes = [
  { id: "Sobre", rotulo: "Sobre", hover: "hover:text-accent-mint" },
  { id: "Cursos", rotulo: "Cursos", hover: "hover:text-accent-blue" },
  { id: "Professores", rotulo: "Professores", hover: "hover:text-white" },
  { id: "Contato", rotulo: "Contato", hover: "hover:text-accent-mint" },
];

export default function Hero() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useFocusTrap(menuRef, open);

  // SCROLL SUAVE
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setOpen(false);
  }, []);

  // FECHA O MENU COM ESC
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative w-full h-[100dvh] bg-secondary overflow-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-primary/80 backdrop-blur-md shadow-md">
        {/* LOGO */}
        <button
          onClick={() => scrollToSection("Hero")}
          aria-label="Voltar ao topo"
          className="flex items-center gap-3"
        >
          <Image
            src="/images/MyRobot-Logo-Branca.svg"
            alt=""
            aria-hidden
            width={40}
            height={40}
            className="rounded-md"
          />
        </button>

        {/* LOGOMARCA + CIDADE */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col leading-tight items-center pointer-events-none">
          <Image
            src="/images/Myrobot-Logomarca-Branca.svg"
            alt="MyRobot"
            width={120}
            height={40}
          />

          <span className="text-[10px] tracking-[0.35em] font-light text-white mt-1.5 leading-none">
            ARARAQUARA
          </span>
        </div>

        <div className="flex items-center gap-6">
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-6">
            {secoes.map((secao) => (
              <button
                key={secao.id}
                onClick={() => scrollToSection(secao.id)}
                className={`text-sm font-medium text-white ${secao.hover} transition`}
              >
                {secao.rotulo}
              </button>
            ))}
          </nav>

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md transition md:hidden"
          >
            {open ? (
              <X className="text-primary" aria-hidden />
            ) : (
              <Menu className="text-primary" aria-hidden />
            )}
          </button>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } md:hidden`}
      />

      {/* MENU LATERAL */}
      <nav
        ref={menuRef}
        id="menu-mobile"
        aria-label="Navegação principal"
        inert={!open}
        className={`fixed top-0 right-0 z-50 h-full w-3/4 max-w-[300px] bg-white shadow-xl rounded-l-2xl p-6 pt-24 flex flex-col gap-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {secoes.map((secao) => (
          <button
            key={secao.id}
            onClick={() => scrollToSection(secao.id)}
            className="text-lg font-medium text-center text-text hover:text-primary transition"
          >
            {secao.rotulo}
          </button>
        ))}
      </nav>

      {/* HERO IMAGE */}
      <div className="w-full h-full">
        {/* A foto é paisagem e o container no celular é retrato: o object-cover
            corta as laterais, então pedimos ~3x a largura da viewport para a
            imagem não ser esticada. No desktop 100vw já basta. */}
        <Image
          src="/images/pexels-vanessa-loring-7868888.jpg"
          alt="Crianças montando um robô em aula de robótica educacional"
          fill
          priority
          sizes="(max-width: 768px) 320vw, 100vw"
          className="object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/30" aria-hidden />
      </div>

      {/* TEXTO HERO */}
      <div className="absolute bottom-10 left-0 w-full px-6 text-white">
        <h1 className="text-3xl font-bold leading-tight md:text-6xl drop-shadow-lg">
          Robótica educacional em Araraquara
        </h1>

        <p className="mt-2 text-sm text-white drop-shadow md:text-lg">
          Faça com quem entende — o futuro começa aqui.
        </p>

        <button
          onClick={() => scrollToSection("Contato")}
          className="mt-4 bg-primary text-white px-5 py-3 rounded-full font-medium shadow-lg hover:scale-105 active:scale-95 transition"
        >
          Fale conosco
        </button>
      </div>
    </div>
  );
}
