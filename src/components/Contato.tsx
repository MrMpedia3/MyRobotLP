"use client";

import { useState } from "react";
import { Phone, MessageCircle, Share2 } from "lucide-react";
import FormDropdown from "./FormDropdown";
import { linkWhatsapp, site } from "@/lib/site";

const faqs = [
  {
    pergunta: "Quantas aulas por semana?",
    resposta:
      "Uma vez por semana. Com aulas de robótica com duração de 2 horas e empreendedorismo com duração de 1 hora.",
  },
  {
    pergunta: "A partir de quantos anos vocês atendem?",
    resposta: "Atendemos crianças de 5 a 105 anos!",
  },
  {
    pergunta: "Quanto tempo dura um curso?",
    resposta: "Entre 10 a 12 meses.",
  },
  {
    pergunta: "O que está incluso no curso?",
    resposta: "O curso matriculado e 3 livros de aula com tarefas.",
  },
];

const MENSAGEM = "Olá, gostaria de saber mais sobre os cursos de robótica educacional.";

export default function Contato() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full h-full bg-white px-6 py-24 flex flex-col items-center">

      {/* CTA */}
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-semibold">
          Comece agora com a gente 🚀
        </h2>

        <p className="mt-3 text-accent-gray">
          Dê o próximo passo e transforme seu futuro com tecnologia.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8 max-w-md w-full">

          {/* WHATSAPP */}
          <a
            href={linkWhatsapp(MENSAGEM)}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              bg-green-600 text-white
              px-4 py-3 rounded-full
              shadow-md
              transition-all duration-300
              hover:scale-105 active:scale-95
            "
          >
            <MessageCircle size={18} aria-hidden />
            <span className="text-sm font-medium">WhatsApp</span>
          </a>

          {/* INSTAGRAM */}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              bg-gradient-to-r from-pink-600 to-orange-600 text-white
              px-4 py-3 rounded-full
              shadow-md
              transition-all duration-300
              hover:scale-105 active:scale-95
            "
          >
            <Share2 size={18} aria-hidden />
            <span className="text-sm font-medium">Instagram</span>
          </a>

          {/* LIGAÇÃO */}
          <a
            href={`tel:${site.telefone}`}
            className="
              col-span-2
              flex items-center justify-center gap-2
              bg-blue-700 text-white
              px-4 py-3 rounded-full
              shadow-md
              transition-all duration-300
              hover:scale-105 active:scale-95
            "
          >
            <Phone size={18} aria-hidden />
            <span className="text-sm font-medium">Ligar agora</span>
          </a>

        </div>

        {/* FORMULÁRIO DROPDOWN */}
        <div className="mt-6 w-full">
          <FormDropdown />
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 w-full max-w-md">
        <h3 className="text-xl font-medium mb-6 text-center">
          Dúvidas Frequentes
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            const painelId = `faq-painel-${index}`;

            return (
              <div key={faq.pergunta} className="border border-gray-300 rounded-xl">
                <h4>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={painelId}
                    className="w-full flex justify-between items-center gap-4 p-4 text-left font-medium"
                  >
                    <span>{faq.pergunta}</span>
                    <span aria-hidden className="text-xl leading-none text-primary">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h4>

                {/* grid-rows 0fr -> 1fr anima a altura real, sem max-h chutado */}
                <div
                  id={painelId}
                  role="region"
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm text-accent-gray text-left">
                      {faq.resposta}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
