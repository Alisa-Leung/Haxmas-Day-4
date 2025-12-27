import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const todo = sqliteTable("todo", {
    id: integer("id").primaryKey({ autoIncrement: true}),
    task: text("task").notNull(),
    description: text("description"),
    completed: integer("completed").notNull().default(0)
})