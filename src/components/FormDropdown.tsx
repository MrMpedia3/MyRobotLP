"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  formataTelefone,
  validaEmail,
  validaNome,
  validaTelefone,
} from "@/lib/validacao";

type Campo = "nome" | "email" | "telefone";

const campos: {
  nome: Campo;
  rotulo: string;
  tipo: string;
  placeholder: string;
  autoComplete: string;
  valida: (valor: string) => boolean;
  erro: string;
}[] = [
  {
    nome: "nome",
    rotulo: "Nome",
    tipo: "text",
    placeholder: "Seu nome",
    autoComplete: "name",
    valida: validaNome,
    erro: "Digite ao menos 3 letras, sem números.",
  },
  {
    nome: "email",
    rotulo: "Email",
    tipo: "email",
    placeholder: "seu@email.com",
    autoComplete: "email",
    valida: validaEmail,
    erro: "Digite um email válido.",
  },
  {
    nome: "telefone",
    rotulo: "Telefone",
    tipo: "tel",
    placeholder: "(16) 91234-5678",
    autoComplete: "tel",
    valida: validaTelefone,
    erro: "Digite um telefone com DDD.",
  },
];

const VALORES_INICIAIS = { nome: "", email: "", telefone: "" };

export default function FormDropdown() {
  const idBase = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(VALORES_INICIAIS);
  const [honeypot, setHoneypot] = useState("");
  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    telefone: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  const isFormValid = campos.every((campo) => campo.valida(formData[campo.nome]));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "telefone" ? formataTelefone(value) : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website: honeypot }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível enviar. Tente novamente.");
      }

      setSubmitMessage({
        tipo: "sucesso",
        texto: data.message ?? "Obrigado! Entraremos em contato em breve.",
      });
      setFormData(VALORES_INICIAIS);
      setTouched({ nome: false, email: false, telefone: false });

      setTimeout(() => {
        setSubmitMessage(null);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      setSubmitMessage({
        tipo: "erro",
        texto:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${idBase}-painel`}
        className="
          w-full
          flex items-center justify-center gap-2
          bg-purple-700 text-white
          px-4 py-3 rounded-full
          shadow-md
          transition-all duration-300
          hover:scale-105 active:scale-95
          font-medium
        "
      >
        <span>Formulário de Contato</span>
        <ChevronDown
          size={18}
          aria-hidden
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* grid-rows 0fr -> 1fr: anima a altura real do conteúdo, sem cortar o
          botão de envio quando aparece mensagem de erro. */}
      <div
        id={`${idBase}-painel`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-300 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Honeypot: invisível e fora da ordem de tabulação. Se vier
                  preenchido, foi bot — o servidor descarta. */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute h-0 w-0 overflow-hidden opacity-0"
              />

              {campos.map((campo) => {
                const valor = formData[campo.nome];
                const foiTocado = touched[campo.nome];
                const valido = campo.valida(valor);
                const mostraErro = foiTocado && !valido;
                const idCampo = `${idBase}-${campo.nome}`;

                return (
                  <div key={campo.nome}>
                    <label
                      htmlFor={idCampo}
                      className="block text-sm font-medium text-gray-700 mb-2 text-left"
                    >
                      {campo.rotulo}
                    </label>
                    <input
                      type={campo.tipo}
                      id={idCampo}
                      name={campo.nome}
                      value={valor}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete={campo.autoComplete}
                      aria-invalid={mostraErro}
                      aria-describedby={mostraErro ? `${idCampo}-erro` : undefined}
                      className={`
                        w-full px-4 py-2 border-2 rounded-lg
                        text-gray-900 placeholder-gray-500
                        focus:outline-none transition-all duration-200
                        ${
                          foiTocado
                            ? valido
                              ? "border-green-600 focus:ring-2 focus:ring-green-500"
                              : "border-red-600 focus:ring-2 focus:ring-red-500"
                            : "border-gray-400 focus:ring-2 focus:ring-accent-blue"
                        }
                      `}
                      placeholder={campo.placeholder}
                    />
                    {mostraErro && (
                      <p
                        id={`${idCampo}-erro`}
                        className="mt-1 text-xs text-red-700 text-left"
                      >
                        {campo.erro}
                      </p>
                    )}
                  </div>
                );
              })}

              <div role="status" aria-live="polite">
                {submitMessage && (
                  <div
                    className={`text-sm text-center py-2 rounded-lg ${
                      submitMessage.tipo === "sucesso"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {submitMessage.texto}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`
                  w-full px-4 py-2 rounded-lg font-medium
                  transition-all duration-300
                  ${
                    isFormValid && !isSubmitting
                      ? "bg-green-700 text-white hover:scale-105 active:scale-95 hover:bg-green-800"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting ? "Enviando..." : "Enviar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
