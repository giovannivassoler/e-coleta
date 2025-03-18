const dicas = [
  {
    numero: 1,
    titulo: "Não jogue em lixo comum",
    descricao:
      "Equipamentos eletrônicos contêm materiais tóxicos que podem contaminar o solo e a água. Sempre descarte em locais apropriados.",
  },
  {
    numero: 2,
    titulo: "Procure pontos de coleta",
    descricao:
      "Antes de solicitar uma coleta, os resíduos recicláveis precisam ser higienizados e separados.",
  },
  {
    numero: 3,
    titulo: "Doe ou venda",
    descricao:
      "Muitas cidades têm pontos de coleta específicos para lixo eletrônico. Verifique com a prefeitura ou empresas de reciclagem locais.",
  },
  {
    numero: 4,
    titulo: "Apague seus dados",
    descricao:
      "Antes de descartar qualquer dispositivo, certifique-se de apagar todos os dados pessoais para proteger sua privacidade.",
  },
];

export function SecaoDicas() {
  return (
    <div className="relative mt-16">
      <div className="relative">
        <h2 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
          Como descartar meus eletrônicos?
        </h2>
        <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:gap-12">
          {dicas.map((dicas) => (
            <div
              key={dicas.numero}
              className="flex items-start gap-4 rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-500 text-2xl font-bold text-white">
                {dicas.numero}
              </span>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {dicas.titulo}
                </h3>
                <p className="text-gray-200">{dicas.descricao}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute right-16 top-0 hidden lg:block"></div>
      </div>
    </div>
  );
}
