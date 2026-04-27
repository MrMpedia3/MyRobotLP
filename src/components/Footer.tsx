export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-8">
      <div className="mx-auto max-w-6xl flex flex-col gap-3 text-center md:text-left md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-white/80">Tel / Whats: (16) 3331-6703</p>
          <p className="text-sm text-white/80">Endereço: Av. Padre Francisco Salles Colturato Nº470 Loja 4 - Araraquara/SP</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-white/70">Desenvolvido por Prova 61 - Educação e Desenvolvimento</p>
          <p className="text-sm text-white/70">Créditos a Mr. Mpedia</p>    
        </div>
      </div>
    </footer>
  );
}
