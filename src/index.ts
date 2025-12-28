import { getTodos, createTodo, update, toggleComplete, deleteTodo, getTodoById, getCompleteTodos, getIncompleteTodos, deleteCompleteTodos } from './db/queries'
import { Hono } from 'hono'

const app = new Hono()

//GET
//getTodos
app.get("/api/todo", (c) => c.json(getTodos()))
//getCompleteTodos
app.get("/api/todo/complete", (c) => c.json(getCompleteTodos()))
//getIncompleteTodos
app.get("/api/todo/incomplete", (c) => c.json(getIncompleteTodos))
//getTodoById
app.get("/api/todo/:id", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "Bad ID." }, 400)

  const todo = getTodoById(id)
  if (!todo) return c.json({ error: "Not found." }, 404)

  return c.json(todo)
})

//POST
//createTodo
app.post("/api/todo", async (c) => {
  const body = await c.req.json().catch(() => null)
  const task = (body?.task ?? "").toString().trim()
  if (!task) return c.json({ error: "A task name is required." }, 400)
  const description = (body?.description ?? "").toString().trim()

  return c.json(createTodo(task, description), 201)
})

//PATCH
//toggleComplete
app.patch("/api/todo/:id/toggleComplete", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "Bad ID." }, 400)

  const result = toggleComplete(id)
  if (result.changes === 0) return c.json({ error: "Not found." }, 404)

  return c.json({ ok: true})
})
//update
app.patch("/api/todo/:id", async (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "Bad ID." }, 400)

  const body = await c.req.json().catch(() => null)
  const task = (body?.task ?? "").toString().trim()
  const description = (body?.description ?? "").toString().trim()
  if (!task && !description) return c.json({ error: "A task or description is required." }, 400)

  const result = update(id, task, description)
  if (result.changes === 0) return c.json({ error: "Not found." }, 404)
  
  return c.json({ ok: true })
})

//DELETE
//deleteTodo
app.delete("/api/todo/:id", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "Bad ID." }, 400)
  
  const result = deleteTodo(id)
  if (result.changes === 0) return c.json({ error: "Not found." }, 404)
  
  return c.json({ ok: true })
})
//deleteCompleteTodos
app.delete("/api/todo/complete", (c) => {
  const result = deleteCompleteTodos()
  return c.json({ deleted: result.changes })
})

export default app