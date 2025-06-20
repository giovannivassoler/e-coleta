import {
  pgTable,
  varchar,
  char,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  serial,
} from "drizzle-orm/pg-core";

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
  id_coleta: uuid()
    .references(() => coletaTable.id),
});

// Tabela tb_enderecoEmpresa
export const enderecoTableEmp = pgTable("tb_enderecoEmp", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  endereco_usu: varchar({ length: 45 }).notNull(),
  num_end: varchar({ length: 45 }).notNull(),
  bairro_end: varchar({ length: 45 }).notNull(),
  cidade_end: varchar({ length: 45 }).notNull(),
  estado_end: varchar({ length: 45 }).notNull(),
  complemento_end: varchar({ length: 60 }),
  cep_end: char({ length: 8 }).notNull(),
  id_empresa: text()
    .notNull()
    .references(() => organization.id),
});

// Tabela tb_coleta
export const coletaTable = pgTable("tb_coleta", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  status_coleta: varchar({ length: 25 }).notNull(),
  destinacao_final: varchar({ length: 255 }),// O que a empresa fez com o material coletado
  data_coleta: timestamp().notNull(), // Alterado de date() para timestamp()
  id_usuario: text()
    .notNull()
    .references(() => user.id),
  id_empresa: text().references(() => organization.id),
});

// Tabela tb_itens
export const itensTable = pgTable("tb_itens", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  itens: varchar({ length: 45 }).notNull(),
  quantidade: integer().notNull().default(1),
  observacao: varchar({ length: 300 }),
  descricao: varchar({ length: 300 }),
  id_coleta: uuid()
    .notNull()
    .references(() => coletaTable.id),
});

// autenticação

//tb usuario
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),

  // campos adicionados
  cpf_usu: char({ length: 11 }).unique(),
  tel_usu: varchar({ length: 18 }),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Empresas

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at"),
  metadata: text("metadata"),
  cnpj: char({ length: 14 }).unique(),
  tel_emp: varchar({ length: 18 }),
});

export const coletasRecusadas = pgTable("coletas_recusadas", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(()=>organization.id),
  coletaId: uuid("coleta_id").notNull().references(()=>coletaTable.id),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const alteracoesDataHora = pgTable('alteracoes_data_hora', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  coleta_id: uuid('coleta_id')
    .notNull()
    .references(() => coletaTable.id, { onDelete: 'cascade' }),
  data_hora_original: timestamp('data_hora_original').notNull(),
  data_hora_proposta: timestamp('data_hora_proposta').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('Pendente'),
  solicitado_por: varchar('solicitado_por', { length: 20 }).notNull(),
  empresa_id: text('empresa_id')
    .notNull()
    .references(() => organization.id),
  cliente_notificado: boolean('cliente_notificado').default(false),
  motivo_alteracao: varchar('motivo_alteracao', { length: 300 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});