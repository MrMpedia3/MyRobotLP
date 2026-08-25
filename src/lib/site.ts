function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  url: resolveSiteUrl(),
  nome: "MyRobot Araraquara",
  descricao:
    "Escola de robótica educacional em Araraquara/SP. Cursos de robótica, programação, empreendedorismo e educação financeira para crianças e adolescentes a partir dos 5 anos.",
  telefone: "+551633316703",
  telefoneExibicao: "(16) 3331-6703",
  whatsapp: "551633316703",
  instagram: "https://www.instagram.com/myrobot_araraquara/",
  endereco: {
    rua: "Av. Padre Francisco Salles Colturato, 470 - Loja 4",
    cidade: "Araraquara",
    estado: "SP",
    pais: "BR",
  },
} as const;

export const linkWhatsapp = (mensagem: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
