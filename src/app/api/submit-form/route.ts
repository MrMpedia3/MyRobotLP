import { prisma } from "@/lib/prisma";
import { MAX_NOME, validaEmail, validaNome, validaTelefone } from "@/lib/validacao";
import { NextRequest, NextResponse } from "next/server";

// Rate limit em memória: vale por instância. Em serverless isso segura o abuso
// casual, mas não é global — se o volume crescer, trocar por Redis/Upstash.
const JANELA_MS = 60_000;
const MAX_POR_JANELA = 5;
const acessos = new Map<string, { contagem: number; expiraEm: number }>();

function identificaCliente(request: NextRequest) {
  const encaminhado = request.headers.get("x-forwarded-for");
  return encaminhado?.split(",")[0]?.trim() || "desconhecido";
}

function excedeuLimite(chave: string) {
  const agora = Date.now();

  // Limpeza preguiçosa para o Map não crescer sem limite.
  if (acessos.size > 5000) {
    for (const [k, v] of acessos) if (v.expiraEm < agora) acessos.delete(k);
  }

  const registro = acessos.get(chave);

  if (!registro || registro.expiraEm < agora) {
    acessos.set(chave, { contagem: 1, expiraEm: agora + JANELA_MS });
    return false;
  }

  registro.contagem += 1;
  return registro.contagem > MAX_POR_JANELA;
}

type Lead = { nome: string; email: string; telefone: string };
type Resultado = { ok: true; dados: Lead } | { ok: false; erro: string };

function validaPayload(body: unknown): Resultado {
  if (typeof body !== "object" || body === null) {
    return { ok: false, erro: "Requisição inválida." };
  }

  const { nome, email, telefone, website } = body as Record<string, unknown>;

  // Honeypot: campo escondido no formulário. Humano nunca preenche, bot preenche.
  if (typeof website === "string" && website.trim() !== "") {
    return { ok: false, erro: "Requisição inválida." };
  }

  if (typeof nome !== "string" || typeof email !== "string" || typeof telefone !== "string") {
    return { ok: false, erro: "Nome, email e telefone são obrigatórios." };
  }

  if (!validaNome(nome)) {
    return { ok: false, erro: `Informe um nome válido (3 a ${MAX_NOME} letras).` };
  }
  if (!validaEmail(email)) {
    return { ok: false, erro: "Informe um email válido." };
  }
  if (!validaTelefone(telefone)) {
    return { ok: false, erro: "Informe um telefone válido com DDD." };
  }

  return {
    ok: true,
    dados: {
      nome: nome.trim().replace(/\s+/g, " "),
      email: email.trim().toLowerCase(),
      telefone: telefone.replace(/\D/g, ""),
    },
  };
}

export async function POST(request: NextRequest) {
  if (excedeuLimite(identificaCliente(request))) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde um minuto e tente novamente." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const validacao = validaPayload(body);
  if (!validacao.ok) {
    return NextResponse.json({ error: validacao.erro }, { status: 400 });
  }

  try {
    // Upsert: quem já se cadastrou e voltou apenas atualiza os dados,
    // em vez de receber um erro de "email já existe".
    await prisma.usuario.upsert({
      where: { email: validacao.dados.email },
      update: { nome: validacao.dados.nome, telefone: validacao.dados.telefone },
      create: validacao.dados,
    });

    // A resposta não devolve dado nenhum do banco — nem o próprio registro.
    return NextResponse.json(
      { message: "Obrigado! Entraremos em contato em breve." },
      { status: 201 }
    );
  } catch (error) {
    // O erro real fica no log do servidor; o cliente recebe mensagem genérica
    // para não expor estrutura do banco nem a connection string.
    console.error("Falha ao registrar lead:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar agora. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}
