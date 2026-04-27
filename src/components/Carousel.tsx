"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const baseItems = [
  {
    image: "/images/First1.jpeg",
    title: "Firstbot",
    desc: "Integra robótica aos conteúdos com peças grandes e encaixes fáceis, usando cartões de comando para programação intuitiva, e estimula criatividade e lógica em projetos práticos.",
  },
  {
    image: "/images/One2.jpeg",
    title: "Onebot",
    desc: "No Onebot, o aluno cria projetos robóticos interdisciplinares que fortalecem cognição, desempenho escolar e social, com kit de encaixes finos e programação por blocos.",
  },
  {
    image: "/images/Tech2.jpeg",
    title: "Techbot",
    desc: "A robótica integra-se aos conteúdos educacionais com parafusos e encaixes finos para montagens precisas e programação em blocos na plataforma Scratch, que simplifica a lógica computacional.",
  },
  {
    image: "/images/Auto2.jpeg",
    title: "Autobot",
    desc: "O Arduino é uma plataforma de prototipagem versátil e acessível, e no curso AutoBot os alunos usam sensores e atuadores para criar projetos práticos.",
  },
  {
    image: "/images/Emp1.jpeg",
    title: "Empreendedorismo",
    desc: "Uma jornada criativa para desenvolver um plano de negócios prático, onde os alunos criam ideias, metas e aprendem produtos, serviços e finanças na prática.",
  },
  {
    image: "/images/Emp3.jpeg",
    title: "Educação Financeira",
    desc: "Com My Robot Business, os alunos aprendem a equilibrar receitas e despesas e a planejar finanças pessoais e familiares de forma prática.",
  },
  {
    image: "/images/Emp2.jpeg",
    title: "Liderança",
    desc: "Através de atividades lúdicas, os alunos desenvolvem empatia, comunicação e inteligência emocional para liderar com confiança e foco em resultados.",
  },
];

const CARD_WIDTH_RATIO = 0.72;
const CARD_GAP = 16;
// Duplica muitos itens para criar efeito infinito perfeito
const items = Array(5).fill([...baseItems]).flat();

function getItemScrollPosition(container: HTMLDivElement, index: number) {
  const cardWidth = container.offsetWidth * CARD_WIDTH_RATIO;
  const offset = (container.offsetWidth - cardWidth) / 2;

  return index * (cardWidth + CARD_GAP) - offset;
}

export default function Carousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const [centerIndex, setCenterIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const activeItem = items[selectedIndex ?? centerIndex];
  const autoPlayEnabled = selectedIndex === null && expandedIndex === null;

  // RESETAR TIMER DE AUTOPLAY
  const resetAutoplayTimer = () => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }

    if (!autoPlayEnabled) return;

    autoplayIntervalRef.current = setInterval(() => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;
      const cardWidth = container.offsetWidth * CARD_WIDTH_RATIO;

      isProgrammaticScrollRef.current = true;
      container.scrollBy({
        left: cardWidth + CARD_GAP,
        behavior: "smooth",
      });
    }, 10000);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // POSIÇÃO INICIAL
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollLeft = getItemScrollPosition(container, baseItems.length);
  }, []);

  // AUTOPLAY
  useEffect(() => {
    resetAutoplayTimer();
    
    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };
  }, [autoPlayEnabled]);

  // SCROLL HANDLER
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    // Resetar timer se o scroll foi manual (não programático)
    if (!isProgrammaticScrollRef.current) {
      resetAutoplayTimer();
    }
    isProgrammaticScrollRef.current = false;

    const cardWidth = container.offsetWidth * CARD_WIDTH_RATIO;
    const step = cardWidth + CARD_GAP;
    const offset = (container.offsetWidth - cardWidth) / 2;
    const index = Math.round((container.scrollLeft + offset) / step);

    setCenterIndex(index);

    // Reset imperceptível: quando chegar perto do final, volta pro começo suavemente
    const totalSets = 5; // Quantidade de vezes que duplicamos
    const cycleLength = baseItems.length;
    const maxScroll = getItemScrollPosition(container, cycleLength * (totalSets - 1));
    const minScroll = getItemScrollPosition(container, cycleLength);

    // Se passou muito pra frente, volta sem animação
    if (container.scrollLeft >= maxScroll - step) {
      const resetIndex = index - cycleLength * 2;
      container.scrollLeft = getItemScrollPosition(container, resetIndex);
      setCenterIndex(resetIndex);
    }

    // Se passou muito pra trás, volta sem animação
    if (container.scrollLeft <= minScroll - step * 2) {
      const resetIndex = index + cycleLength * 2;
      container.scrollLeft = getItemScrollPosition(container, resetIndex);
      setCenterIndex(resetIndex);
    }
  };

  const scrollByStep = (direction: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.offsetWidth * CARD_WIDTH_RATIO;

    container.scrollBy({
      left: direction * (cardWidth + CARD_GAP),
      behavior: "smooth",
    });

    resetAutoplayTimer();
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;

    container.scrollTo({
      left: getItemScrollPosition(container, index),
      behavior: "smooth",
    });

    resetAutoplayTimer();
  };

  return (
    <section className="w-full h-full py-24 bg-(--color-third) flex flex-col items-center">

      {/* TÍTULO */}
      <h2 className="text-2xl font-semibold text-center px-6 bg-accent-blue rounded-full shadow-lg">
        Nossos Cursos
      </h2>

      {/* CARROSSEL */}
      <div className="w-full px-6">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto mt-12 w-full max-w-lg md:max-w-5xl mx-auto snap-x scroll-smooth"
          >
          {items.map((item, index) => {
            const isCenter = index === centerIndex;
            const isSelected = selectedIndex === index;
            const showText = !isDesktop && isSelected;

            return (
              <div
                key={index}
                onClick={() => {
                  if (isDesktop) {
                    setExpandedIndex(expandedIndex === index ? null : index);
                  } else {
                    setSelectedIndex(isSelected ? null : index);
                  }
                }}
                className={`
                  relative shrink-0 snap-center cursor-pointer
                  transition-all duration-500 ease-out
                  ${isCenter ? "scale-100" : "scale-90 opacity-60"}
                  h-[38vh] md:h-[45vh]
                `}
                style={{
                  width: `${CARD_WIDTH_RATIO * 100}%`,
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className={`
                    object-cover transition duration-500
                    ${!isCenter ? "blur-[1px]" : ""}
                    ${isSelected ? "scale-105 blur-sm" : ""}
                  `}
                />

                {/* OVERLAY DEPTH */}
                <div
                  className={`
                    absolute inset-0 transition duration-500
                    ${isCenter ? "bg-black/20" : "bg-black/40"}
                  `}
                />

                {/* TEXTO CLICK */}
                <div
                  className={`
                    absolute inset-0 flex flex-col justify-center items-center text-center px-4 text-white
                    transition-all duration-500
                    ${
                      showText
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }
                  `}
                >
                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm mt-2 text-white/90">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
          </div>

          {isDesktop && (
            <>
              <button
                onClick={() => scrollByStep(-1)}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-black/40 text-white shadow-lg hover:bg-black/60"
              >
                ‹
              </button>
              <button
                onClick={() => scrollByStep(1)}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center h-12 w-12 rounded-full bg-black/40 text-white shadow-lg hover:bg-black/60"
              >
                ›
              </button>
            </>
          )}
        </div>

        {isDesktop && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {baseItems.map((_, index) => {
              const currentDot = ((centerIndex % baseItems.length) + baseItems.length) % baseItems.length;
              const isActiveDot = index === currentDot;
              return (
                <button
                  key={index}
                  onClick={() => scrollToIndex(baseItems.length + index)}
                  className={`h-3 w-3 rounded-full transition ${isActiveDot ? "bg-white" : "bg-white/40"}`}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="hidden md:flex w-full max-w-5xl justify-center">
        <div className="relative -mt-16 w-full max-w-3xl rounded-3xl bg-white/10 border border-white/10 p-6 backdrop-blur-md shadow-2xl">
          <h3 className="text-xl font-semibold text-white">{activeItem.title}</h3>
          <p className="mt-3 text-sm text-white/80">{activeItem.desc}</p>
        </div>
      </div>

      {isDesktop && expandedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <button
            onClick={() => setExpandedIndex(null)}
            className="absolute top-6 right-6 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-primary shadow-lg"
          >
            Fechar
          </button>

          <div className="relative w-full max-w-5xl h-[75vh] rounded-3xl overflow-hidden bg-black">
            <Image
              src={items[expandedIndex].image}
              alt={items[expandedIndex].title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* TEXTO ABAIXO */}
      <p className="mt-12 text-sm text-center text-white px-6 max-w-md">
        Cursos para todas as idades, do básico ao avançado. Aprenda a programar, construir e inovar com nossos kits de robótica educacional. Inscreva-se hoje e transforme seu futuro!
      </p>
    </section>
  );
}