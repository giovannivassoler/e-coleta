import {  pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", (t)=>({
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  age: t.integer().notNull(),
  email: t.varchar({ length: 255 }).notNull().unique(),
}));
