import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const patients = sqliteTable("patients", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  dateOfBirth: text("date_of_birth"),
  phone: text("phone"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});