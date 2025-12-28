import { db } from "./index"
import { todo } from "./schema"
import { eq, desc, sql } from "drizzle-orm"

export function getTodos() {
    return db.select()
        .from(todo)
        .orderBy(desc(todo.id))
        .all()
}

export function createTodo(task: string, description: string){
    const result = db.insert(todo)
        .values({
            task,
            description,
            completed: 0
        })
        .returning( { id: todo.id})
        .get()
    return { id: result.id }
}

export function changeTask(id: number, task: string){
    return db.update(todo)
        .set({ task })
        .where(eq(todo.id, id))
        .run()
}

export function changeDescription(id: number, description: string){
    return db.update(todo)
        .set({ description })
        .where (eq(todo.id, id))
        .run()
}

export function toggleComplete(id: number){
    return db.update(todo)
        .set({ completed: sql`1 - completed` })
        .where (eq(todo.id, id))
        .run()
}

export function deleteTodo(id: number){
    return db.delete(todo)
        .where(eq(todo.id, id))
        .run()
}

export function getTodoById(id: number) {
    return db.select()
        .from(todo)
        .where(eq(todo.id, id))
        .get()
}

export function getCompleteTodos(){
    return db.select()
        .from(todo)
        .where(eq(todo.completed, 1))
        .orderBy(desc(todo.id))
        .all()
}

export function getIncompleteTodos(){
    return db.select()
        .from(todo)
        .where(eq(todo.completed, 0))
        .orderBy(desc(todo.id))
        .all()
}

export function deleteCompleteTodos(){
    return db.delete(todo)
        .where(eq(todo.completed, 1))
        .run()
}