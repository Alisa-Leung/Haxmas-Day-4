import { getTodos, createTodo, changeTask, changeDescription, toggleComplete, deleteTodo, getTodoById, getCompleteTodos, getIncompleteTodos, deleteCompleteTodos } from './db/queries'
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/todo', (c) => c.json(getTodos()))

app.post('/api/todo', async (c) => {
  const body = await c.req.json().catch(() => null)
  const task = (body?.task ?? "").toString().trim()
  if (!task) return c.json({ error: "A task name is required." }, 400)
  const description = (body?.description ?? "").toString().trim()

  return c.json(createTodo(task, description), 201)
})
app.patch("/api/todo/:id/toggleComplete", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "Bad ID." }, 400)

  const result = toggleComplete(id)
  if (result.changes === 0) return c.json({ error: "Not found." }, 404)

  return c.json({ ok: true})
})
app.delete("/api/todo/:id", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "Bad ID." }, 400)
  
  const result = deleteTodo(id)
  if (result.changes === 0) return c.json({ error: "Not found." }, 404)
  
  return c.json({ ok: true })
})
export default app
