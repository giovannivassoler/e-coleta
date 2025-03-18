import { Recycle } from "lucide-react";

export function FooterColeta() {
  return (
    <footer className="bg-green-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Recycle className="h-5 w-5" />
                E-Coleta
              </h3>
              <p className="text-green-200 text-sm">
                Transformando o descarte de lixo eletrônico em uma experiência
                simples e sustentável para um futuro mais verde.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-green-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dicas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Agendar Coleta
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Quero ser um parceiro
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <address className="not-italic text-green-200 space-y-2 text-sm">
                <p>R. Conceição, 321 - Santo Antônio, São Caetano do Sul - SP, 09530-060</p>
                <p>contato@ecoleta.com.br</p>
                <p>(11) 99999-9999</p>
              </address>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-300 text-sm">
            <p>© 2025 E-Coleta. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
  );
}
