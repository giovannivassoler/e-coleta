import { FooterColeta } from "../componentes/footer";
import Navbar from "../componentes/navbar";
import { SecaoDicas } from "./componentes/secao-dicas";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#2B4B76]">
      <Navbar />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Dicas e orientações - Modificar ainda
          </h1>
        </div>
        <SecaoDicas />
      </div>
      <FooterColeta />
    </main>
  );
}
