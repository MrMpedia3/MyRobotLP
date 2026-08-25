import Link from "next/link";

export const metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 bg-secondary px-6 text-center text-white">
      <p className="text-6xl font-bold">404</p>
      <h1 className="text-2xl font-semibold">Essa página não existe</h1>
      <p className="max-w-sm text-white/90">
        O link pode estar errado ou a página foi movida.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-white px-6 py-3 font-medium text-primary shadow-lg transition hover:scale-105 active:scale-95"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
