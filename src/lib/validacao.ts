// Regras de validação compartilhadas entre o formulário (cliente) e a API (servidor).
// O cliente usa para feedback em tempo real; o servidor usa como fonte da verdade.

export const MAX_NOME = 120;
export const MAX_EMAIL = 254;
export const MAX_TELEFONE = 11;

export function validaNome(nome: string) {
  const limpo = nome.trim();
  return limpo.length >= 3 && limpo.length <= MAX_NOME && !/\d/.test(limpo);
}

export function validaEmail(email: string) {
  const limpo = email.trim();
  return limpo.length <= MAX_EMAIL && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpo);
}

export function validaTelefone(telefone: string) {
  if (/[a-zA-Z]/.test(telefone)) return false;
  const digitos = telefone.replace(/\D/g, "");
  return digitos.length >= 10 && digitos.length <= MAX_TELEFONE;
}

/** (16) 3331-6703 para fixo, (16) 91234-5678 para celular. */
export function formataTelefone(telefone: string) {
  const digitos = telefone.replace(/\D/g, "").slice(0, MAX_TELEFONE);

  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}
