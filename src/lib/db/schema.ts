import { pgTable, varchar, char, date, uuid } from "drizzle-orm/pg-core";

// Tabela tb_usuario
export const usersTable = pgTable("tb_usuario", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  nome_usu: varchar({ length: 65 }).notNull(),
  cpf_usu: char({ length: 11 }).notNull().unique(),
  email_usu: varchar({ length: 60 }).notNull().unique(),
  senha_usu: varchar({ length: 45 }).notNull(),
  tel_usu: varchar({ length: 18 }).notNull()
});

// Tabela tb_endereco
export const enderecoTable = pgTable("tb_endereco", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  endereco_usu: varchar({ length: 45 }).notNull(),
  num_end: varchar({ length: 45 }).notNull(),
  bairro_end: varchar({ length: 45 }).notNull(),
  cidade_end: varchar({ length: 45 }).notNull(),
  estado_end: varchar({ length: 45 }).notNull(),
  complemento_end: varchar({ length: 60 }),
  cep_end: char({ length: 8 }).notNull(),
  id_coleta: uuid().notNull().references(() => coletaTable.id)
});

// Tabela tb_empresa
export const empresaTable = pgTable("tb_empresa", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  nome: varchar({ length: 45 }).notNull(),
  email_emp: varchar({ length: 45 }).notNull().unique(),
  senha_emp: varchar({ length: 45 }).notNull(),
  cnpj: char({ length: 14 }).notNull().unique()
});

// Tabela tb_coleta
export const coletaTable = pgTable("tb_coleta", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  status_coleta: varchar({ length: 25 }).notNull(),
  destinacao_final: varchar({ length: 30 }).notNull(),
  data_coleta: date().notNull(),
  id_usuario: uuid().notNull().references(() => usersTable.id),
  id_empresa: uuid().references(() => empresaTable.id)
});

// Tabela tb_itens
export const itensTable = pgTable("tb_itens", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  itens: varchar({ length: 45 }).notNull(),
  descricao: varchar({ length: 300 }),
  id_coleta: uuid().notNull().references(() => coletaTable.id)
});
