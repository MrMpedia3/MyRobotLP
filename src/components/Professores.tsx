"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useEffect, useRef, useState } from "react";

const professores = [
  {
    nome: "Ryan Trevizan",
    thumb: "/images/Ryan1.jpeg",
    foto: "/images/Ryan2.jpeg",
    desc: "Artista musical e designer gráfico, Ryanex está aqui para trazer criatividade e inovação para nossas soluções educacionais. (Há quem diga que ele é O Cara)",
  },
  {
    nome: "Sara Eduarda",
    thumb: "/images/Sara1.jpeg",
    foto: "/images/Sara2.jpeg",
    desc: "Pedagoga e especialista em educação especial, Sara é a mente por trás de nossos programas educacionais.",
  },
  {
    nome: "Felipe Borges",
    thumb: "/images/Felipe1.jpeg",
    foto: "/images/Felipe3.jpeg",
    desc: "Programador, designer formado e responsável por este site. Ama aprender e ensinar e usa desse amor aqui. (Há quem diga que ele é O Cara)",
  },
  {
    nome: 'Anderson "Big Boss" Jr.',
    thumb: "/images/Anderson3.jpeg",
    foto: "/images/Anderson2.jpeg",
    desc: "Diretor da escola e professor dedicado, trazendo disciplina e paixão. (Ele é O Cara)",
  },
];

const RYAN_INDEX = 0;
const FELIPE_INDEX = 2;

const BRANCO = "#ffffff";
const LARANJA = "#F97316";

/**
 * Coreografia da abertura do card. Cada etapa começa onde a anterior está
 * terminando, então a sequência lê como um encadeamento e não como um monte de
 * coisas acontecendo junto. Total: ~1,1s.
 */
const TEMPOS = {
  saidaDosOutros: { duracao: 0.22 },
  viraLaranja: { atraso: 0.2, duracao: 0.28 },
  cresce: { atraso: 0.42 },
  conteudo: { atraso: 0.78, duracao: 0.32 },
  foto: { atraso: 0.88, duracao: 0.34 },
} as const;

/**
 * Dispara um easter egg em intervalos aleatórios enquanto o card estiver aberto.
 * Todos os timers são registrados para não vazarem setState após o unmount.
 */
function useEasterEgg(ativo: boolean, duracaoMs: number) {
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    if (!ativo) return;

    let cancelado = false;
    let agendamento: ReturnType<typeof setTimeout>;
    let encerramento: ReturnType<typeof setTimeout>;

    const agendar = () => {
      // Entre 5s e 15s.
      const espera = 5000 + Math.random() * 10000;

      agendamento = setTimeout(() => {
        if (cancelado) return;
        setRodando(true);

        encerramento = setTimeout(() => {
          if (cancelado) return;
          setRodando(false);
          agendar();
        }, duracaoMs);
      }, espera);
    };

    agendar();

    return () => {
      cancelado = true;
      clearTimeout(agendamento);
      clearTimeout(encerramento);
      // Zera na limpeza para o efeito não reaparecer travado ao reabrir o card.
      setRodando(false);
    };
  }, [ativo, duracaoMs]);

  return ativo && rodando;
}

export default function Professores() {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduzir = useReducedMotion();

  useFocusTrap(dialogRef, active !== null);

  const isGlitching = useEasterEgg(active === FELIPE_INDEX, 800);
  const isRyanActive = useEasterEgg(active === RYAN_INDEX, 1200);
  const eggAtivo = isGlitching || isRyanActive;

  // FECHA A EXPANSÃO COM ESC
  useEffect(() => {
    if (active === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // Com movimento reduzido tudo acontece de uma vez, sem encenação.
  const semTempo = { duration: 0 };
  const t = (config: { atraso?: number; duracao?: number }) =>
    reduzir
      ? semTempo
      : {
          delay: config.atraso ?? 0,
          duration: config.duracao ?? 0.3,
          ease: [0.22, 1, 0.36, 1] as const,
        };

  const molaDoCrescimento = reduzir
    ? semTempo
    : {
        delay: TEMPOS.cresce.atraso,
        type: "spring" as const,
        stiffness: 260,
        damping: 30,
        mass: 0.9,
      };

  return (
    <div
      className="w-full min-h-[100dvh] pt-24 pb-6 px-6 flex justify-center bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/juntos.jpeg')",
        backgroundPosition: "top",
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/30" aria-hidden />

      <div className="w-full max-w-5xl relative z-10">

        {/* TÍTULO */}
        <h2 className="text-2xl font-semibold text-center bg-gray-100 rounded-full px-6 py-2 mb-6 shadow-lg text-black">
          Nossos Professores
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          {professores.map((prof, index) => {
            const isHidden = active !== null && active !== index;

            return (
              <AnimatePresence key={prof.nome}>
                {!isHidden && (
                  <motion.div
                    layoutId={`card-${index}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver perfil de ${prof.nome}`}
                    onClick={() => setActive(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(index);
                      }
                    }}
                    className="bg-white rounded-2xl p-6 flex flex-col items-center cursor-pointer shadow-md"
                    // Levantar em vez de escalar: `scale` no hover disputa com a
                    // correção de escala que o layoutId aplica no morph.
                    whileHover={reduzir ? undefined : { y: -6 }}
                    whileTap={reduzir ? undefined : { scale: 0.97 }}
                    initial={reduzir ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    // ETAPA 1: os outros somem, os mais distantes um pouco depois.
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: reduzir
                        ? semTempo
                        : {
                            duration: TEMPOS.saidaDosOutros.duracao,
                            delay: Math.abs((active ?? index) - index) * 0.04,
                          },
                    }}
                    transition={{ layout: molaDoCrescimento, duration: 0.25 }}
                  >
                    <motion.div
                      layoutId={`image-${index}`}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-2 ring-primary/20"
                    >
                      <Image
                        src={prof.thumb}
                        alt={`Foto de ${prof.nome}`}
                        fill
                        sizes="128px"
                        className="object-cover object-top"
                      />
                    </motion.div>

                    <motion.h3
                      layoutId={`name-${index}`}
                      className="mt-4 text-center text-black font-medium"
                    >
                      {prof.nome}
                    </motion.h3>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* EXPANSÃO */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="scrim"
              aria-hidden
              onClick={() => setActive(null)}
              className="absolute inset-0 -m-6 bg-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={t({ duracao: 0.25 })}
            />
          )}

          {active !== null && (
            <motion.div
              key="dialogo"
              ref={dialogRef}
              tabIndex={-1}
              layoutId={`card-${active}`}
              role="dialog"
              aria-modal="true"
              aria-label={`Perfil de ${professores[active].nome}`}
              className="absolute inset-0 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 overflow-hidden shadow-2xl"

              animate={
                active === RYAN_INDEX && isRyanActive
                  ? {
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0 0 0px rgba(168,85,247,0)",
                        "0 0 40px rgba(168,85,247,0.8)",
                        "0 0 0px rgba(168,85,247,0)",
                      ],
                    }
                  : {
                      scale: 1,
                      boxShadow: "0 0 0px rgba(168,85,247,0)",
                    }
              }

              transition={{
                // ETAPA 3: o crescimento tem mola e atraso próprios; a duração
                // longa abaixo continua servindo aos easter eggs.
                layout: molaDoCrescimento,
                duration: 0.8,
                ease: "easeInOut",
              }}

              style={
                active === FELIPE_INDEX && isGlitching
                  ? {
                      background: "#000",
                      color: "#fff",
                      border: "2px solid red",
                    }
                  : active === RYAN_INDEX && isRyanActive
                  ? {
                      background: "linear-gradient(135deg, #0a001a, #1a0033)",
                      border: isRyanActive ? "2px solid #facc15" : "none",
                    }
                  : undefined
              }
            >
              {/* ETAPA 2: camada própria só para o fundo. Fica separada porque os
                  easter eggs pintam o card com gradiente via `style`, e cor de
                  fundo animada e gradiente inline brigam pelo mesmo atributo.
                  Durante um egg esta camada some e o gradiente aparece. */}
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ backgroundColor: BRANCO, opacity: 1 }}
                animate={{
                  backgroundColor: LARANJA,
                  opacity: eggAtivo ? 0 : 1,
                }}
                transition={{
                  backgroundColor: t(TEMPOS.viraLaranja),
                  opacity: { duration: reduzir ? 0 : 0.2 },
                }}
              />

              {/* FLASH RYAN */}
              {active === RYAN_INDEX && isRyanActive && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-yellow-300/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* TEXTO — ETAPA 4 */}
              <motion.div
                className="relative rounded-2xl p-6 flex-1 max-w-[320px] shadow-xl"

                initial={reduzir ? false : { opacity: 0, y: 14 }}
                animate={
                  active === RYAN_INDEX && isRyanActive
                    ? { opacity: 1, y: 0, scale: [1, 0.96, 1.04, 1] }
                    : { opacity: 1, y: 0, scale: 1 }
                }

                transition={{
                  opacity: t(TEMPOS.conteudo),
                  y: t(TEMPOS.conteudo),
                  duration: 0.6,
                  ease: "easeInOut",
                }}

                style={
                  active === FELIPE_INDEX && isGlitching
                    ? {
                        background: "linear-gradient(135deg, #000 0%, #1a0000 100%)",
                        color: "#fff",
                        border: "1px solid red",
                        boxShadow: "0 0 15px rgba(255,0,0,0.5)",
                      }
                    : active === RYAN_INDEX && isRyanActive
                    ? {
                        background: "#0a001a",
                        color: "#facc15",
                      }
                    : {
                        backgroundColor: "#ffffff",
                        color: "#000",
                      }
                }
              >
                <motion.h2
                  layoutId={`name-${active}`}
                  className="text-xl font-semibold"

                  animate={
                    active === RYAN_INDEX && isRyanActive
                      ? { scale: [1, 1.1, 1] }
                      : { scale: 1 }
                  }

                  transition={{ duration: 0.6 }}

                  style={
                    active === FELIPE_INDEX && isGlitching
                      ? {
                          textShadow: "2px 0 red, -2px 0 cyan",
                          transform: "skewX(10deg)",
                        }
                      : active === RYAN_INDEX && isRyanActive
                      ? {
                          color: "#facc15",
                          textShadow: "0 0 20px rgba(250,204,21,0.8)",
                        }
                      : undefined
                  }
                >
                  {active === FELIPE_INDEX && isGlitching
                    ? "M̵͓͛̈́r̴̳̎́.̷͎̍͝ ̷̩̕Ṁ̶͎̈́p̴̳͌ė̵̲d̶͕̕i̴̪͊à̶̙"
                    : active === RYAN_INDEX && isRyanActive
                    ? "RYANEX"
                    : professores[active].nome}
                </motion.h2>

                {/* Filete que cresce sob o nome, entrando junto com o texto. */}
                <motion.span
                  aria-hidden
                  className="mt-2 block h-[3px] rounded-full bg-primary"
                  initial={reduzir ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: "left", width: 48 }}
                  transition={t({
                    atraso: TEMPOS.conteudo.atraso + 0.08,
                    duracao: 0.35,
                  })}
                />

                <p
                  className="mt-3 text-sm transition-all duration-300"
                  style={
                    active === FELIPE_INDEX && isGlitching
                      ? { color: "#ff4d4d" }
                      : active === RYAN_INDEX && isRyanActive
                      ? { color: "#fde68a" }
                      : { color: "#4b5563" }
                  }
                >
                  {professores[active].desc}
                </p>

                <button
                  onClick={() => setActive(null)}
                  autoFocus
                  className="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-110 active:scale-95"
                >
                  Voltar
                </button>
              </motion.div>

              {/* IMAGEM — ETAPA 5 */}
              <motion.div
                layoutId={`image-${active}`}
                className="relative w-full md:w-1/2 h-72 md:h-[26rem] rounded-2xl overflow-hidden"
                initial={reduzir ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  opacity: t(TEMPOS.foto),
                  scale: t(TEMPOS.foto),
                  layout: molaDoCrescimento,
                }}
              >
                <Image
                  src={
                    active === RYAN_INDEX && isRyanActive
                      ? "/images/RyanPhoto.jpeg"
                      : active === FELIPE_INDEX && isGlitching
                      ? "/images/FelipePhoto.jpg"
                      : professores[active].foto
                  }
                  alt={`Foto de ${professores[active].nome}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-contain"
                />

                {/* 🌊 RYAN RIPPLE */}
                {active === RYAN_INDEX && isRyanActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="absolute rounded-full border border-purple-400/40"
                        style={{ width: 120, height: 120 }}
                        animate={{
                          scale: [1, 2.5],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          duration: 1.2,
                          delay: i * 0.2,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* 💀 FELIPE GLITCH */}
                {active === FELIPE_INDEX && isGlitching && (
                  <div aria-hidden>
                    <div className="absolute inset-0 mix-blend-screen opacity-70 animate-glitch1">
                      <Image
                        src="/images/FelipePhoto.jpg"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-contain translate-x-[2px] hue-rotate-[-20deg]"
                      />
                    </div>

                    <div className="absolute inset-0 mix-blend-screen opacity-70 animate-glitch2">
                      <Image
                        src="/images/FelipePhoto.jpg"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-contain -translate-x-[2px] hue-rotate-[20deg]"
                      />
                    </div>

                    <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
