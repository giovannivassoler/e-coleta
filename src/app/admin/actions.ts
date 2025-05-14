"use server"

// Função para buscar todos os clientes (simulada)
export async function buscarClientes() {
  // Simulação de dados - em um ambiente real, isso viria do banco de dados
  return [
    {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
      tel_usu: "(11) 98765-4321",
      created_at: new Date("2023-01-15"),
      endereco: { cidade_end: "São Paulo", estado_end: "SP" },
      totalColetas: 5,
    },
    {
      id: "2",
      name: "Maria Oliveira",
      email: "maria@example.com",
      tel_usu: "(21) 98765-4321",
      created_at: new Date("2023-02-20"),
      endereco: { cidade_end: "Rio de Janeiro", estado_end: "RJ" },
      totalColetas: 3,
    },
    {
      id: "3",
      name: "Carlos Santos",
      email: "carlos@example.com",
      tel_usu: "(31) 98765-4321",
      created_at: new Date("2023-03-10"),
      endereco: { cidade_end: "Belo Horizonte", estado_end: "MG" },
      totalColetas: 2,
    },
    {
      id: "4",
      name: "Ana Pereira",
      email: "ana@example.com",
      tel_usu: "(41) 98765-4321",
      created_at: new Date("2023-04-05"),
      endereco: { cidade_end: "Curitiba", estado_end: "PR" },
      totalColetas: 1,
    },
    {
      id: "5",
      name: "Paulo Souza",
      email: "paulo@example.com",
      tel_usu: "(51) 98765-4321",
      created_at: new Date("2023-05-12"),
      endereco: { cidade_end: "Porto Alegre", estado_end: "RS" },
      totalColetas: 0,
    },
  ]
}

// Função para buscar todas as empresas (simulada)
export async function buscarEmpresas() {
  // Simulação de dados - em um ambiente real, isso viria do banco de dados
  return [
    {
      id: "1",
      name: "EcoTech Reciclagem",
      email: "contato@ecotech.com",
      tel_empresa: "(11) 3333-4444",
      created_at: new Date("2022-10-05"),
      endereco: { cidade_end: "São Paulo", estado_end: "SP" },
      totalColetas: 15,
      status: "Ativo",
    },
    {
      id: "2",
      name: "Recicla Mais",
      email: "contato@reciclamais.com",
      tel_empresa: "(21) 3333-4444",
      created_at: new Date("2022-11-15"),
      endereco: { cidade_end: "Rio de Janeiro", estado_end: "RJ" },
      totalColetas: 8,
      status: "Ativo",
    },
    {
      id: "3",
      name: "Verde Coleta",
      email: "contato@verdecoleta.com",
      tel_empresa: "(31) 3333-4444",
      created_at: new Date("2022-12-20"),
      endereco: { cidade_end: "Belo Horizonte", estado_end: "MG" },
      totalColetas: 0,
      status: "Pendente",
    },
    {
      id: "4",
      name: "Eco Soluções",
      email: "contato@ecosolucoes.com",
      tel_empresa: "(41) 3333-4444",
      created_at: new Date("2023-01-10"),
      endereco: { cidade_end: "Curitiba", estado_end: "PR" },
      totalColetas: 5,
      status: "Ativo",
    },
    {
      id: "5",
      name: "Recicla Sul",
      email: "contato@reciclasul.com",
      tel_empresa: "(51) 3333-4444",
      created_at: new Date("2023-02-15"),
      endereco: { cidade_end: "Porto Alegre", estado_end: "RS" },
      totalColetas: 3,
      status: "Suspenso",
    },
  ]
}
