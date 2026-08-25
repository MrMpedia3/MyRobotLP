import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-8">
      <div className="mx-auto max-w-6xl flex flex-col gap-3 text-center md:text-left md:flex-row md:items-center md:justify-between">
        <address className="space-y-1 not-italic">
          <p className="text-sm text-white/90">
            Tel / WhatsApp:{" "}
            <a href={`tel:${site.telefone}`} className="underline underline-offset-2">
              {site.telefoneExibicao}
            </a>
          </p>
          <p className="text-sm text-white/90">
            {site.endereco.rua} — {site.endereco.cidade}/{site.endereco.estado}
          </p>
        </address>

        <div className="space-y-1">
          <p className="text-sm text-white/80">
            Desenvolvido por Prova 61 - Educação e Desenvolvimento
          </p>
          <p className="text-sm text-white/80">Créditos a Mr. Mpedia</p>
        </div>
      </div>
    </footer>
  );
}
