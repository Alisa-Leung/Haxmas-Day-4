import { getTodos, createTodo, update, toggleComplete, deleteTodo, getTodoById, getCompleteTodos, getIncompleteTodos, deleteCompleteTodos } from './db/queries'
import { Hono } from 'hono'

const app = new Hono()

//check if webpage is up
app.get("/", (c) => c.text(`
  🗒️ To-Do API is up and running!
  
  Available Endpoints:
  --------------------------------------------------
  [GET]     /api/todo                     - List all to-dos
  [GET]     /api/todo/complete            - List completed to-dos
  [GET]     /api/todo/incomplete          - List incomplete to-dos
  [GET]     /api/todo/:id                 - Get a to-do by ID
  [POST]    /api/todo                     - Create a new to-do
  [PATCH]   /api/todo/:id                 - Update a to-do's task or description
  [PATCH]   /api/todo/:id/toggleComplete  - Toggle a to-do's completion status
  [DELETE]  /api/todo/:id                 - Delete a to-do by ID
  [DELETE]  /api/todo/complete            - Delete all completed to-dos
  
  Usage Example:
  --------------------------------------------------
  curl -X POST https://fastdeploy.deployor.dev/u/ident!A9f3Xq/To-Do%20List%20Maker/api/todo \\
       -H "Content-Type: application/json" \\
       -d '{"task": "Join Hack Club", "description": "Make cool stuff with code!"}'
  `))

//GET
//getTodos
app.get("/api/todo", (c) => c.json(getTodos()))
//getCompleteTodos
app.get("/api/todo/complete", (c) => c.json(getCompleteTodos()))
//getIncompleteTodos
app.get("/api/todo/incomplete", (c) => c.json(getIncompleteTodos()))
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

const port = Number(process.env.PORT) || 3000

export default {
  port,
  fetch: app.fetch,
}