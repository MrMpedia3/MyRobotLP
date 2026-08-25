"use client";

import { useEffect, type RefObject } from "react";

const FOCAVEIS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Prende o Tab dentro do container enquanto `ativo` for true e devolve o foco
 * para onde ele estava ao fechar. Sem isso, o teclado continua navegando pelo
 * conteúdo atrás do modal, que fica visualmente escondido mas ainda focável.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  ativo: boolean
) {
  useEffect(() => {
    if (!ativo) return;

    const container = ref.current;
    if (!container) return;

    const anterior = document.activeElement as HTMLElement | null;

    // Recalculado a cada Tab: o conteúdo do modal pode mudar enquanto aberto.
    const listar = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCAVEIS)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0
      );

    const inicial = listar()[0] ?? container;
    inicial.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const els = listar();
      if (els.length === 0) {
        e.preventDefault();
        return;
      }

      const primeiro = els[0];
      const ultimo = els[els.length - 1];
      const atual = document.activeElement;

      if (e.shiftKey && (atual === primeiro || !container.contains(atual))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && atual === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      anterior?.focus?.({ preventScroll: true });
    };
  }, [ativo, ref]);
}
