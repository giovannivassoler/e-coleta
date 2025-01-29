import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#2B4B7E]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-white text-2xl font-bold">
            E-COLETA
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-gray-200">
              Home
            </Link>
            <Link href="/agendar" className="text-white hover:text-gray-200">
              Agendar Coleta
            </Link>
            <Link href="/dicas" className="text-white hover:text-gray-200">
              Dicas
            </Link>
            <Link href="/sobre" className="text-white hover:text-gray-200">
              Sobre nós
            </Link>
            <Link href="/contato" className="text-white hover:text-gray-200">
              Contato
            </Link>
            <Link href="/login" className="text-white hover:text-gray-200">
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Seu eletrônico tem futuro.
              <br />
              Descarte certo e ajude o planeta.
            </h1>
            <Link
              href="/agendar"
              className="inline-block bg-white text-[#2B4B7E] px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Descartar agora
            </Link>
          </div>
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src="/vercel.svg"
              alt="Electronic waste recycling illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}
