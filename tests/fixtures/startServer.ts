import { Request as EdgeRuntimeRequest } from "@edge-runtime/primitives"
import type { Middleware } from "winterspec"
import { createDatabase } from "@tscircuit/fake-snippets"
import fakeRegistryBundle from "@tscircuit/fake-snippets/bundle"

export const startServer = async ({
  port,
  testDbName,
}: {
  port?: number
  testDbName: string
}) => {
  const db = createDatabase()

  const middleware: Middleware[] = [
    async (req: any, ctx: any, next: any) => {
      ;(ctx as any).db = db

      return next(req, ctx)
    },
  ]

  const server = Bun.serve({
    fetch: (bunReq) => {
      const url = new URL(bunReq.url)
      if (
        url.pathname === "/api/datasheets/get" &&
        url.searchParams.has("chip_name")
      ) {
        const chipName = url.searchParams.get("chip_name")!
        const datasheet = (db as any).datasheets.find(
          (d: any) => d.chip_name === chipName,
        )
        if (!datasheet) {
          return new Response(
            JSON.stringify({
              error: {
                error_code: "datasheet_not_found",
                message: "Datasheet not found",
              },
            }),
            { status: 404, headers: { "content-type": "application/json" } },
          )
        }
        return new Response(JSON.stringify({ datasheet }), {
          headers: { "content-type": "application/json" },
        })
      }

      const req = new EdgeRuntimeRequest(bunReq.url, {
        headers: bunReq.headers,
        method: bunReq.method,
        body: bunReq.body,
      })
      return fakeRegistryBundle.makeRequest(req as any, {
        middleware,
      })
    },
    port: port ?? 0,
  })

  return {
    server: { ...server, stop: () => server.stop() },
    db,
    port: server.port,
  }
}
