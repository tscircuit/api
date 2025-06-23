import { afterAll } from "bun:test"
import ky, { type KyInstance } from "ky"
import { startServer } from "./startServer"
import { seed as seedDB } from "@tscircuit/fake-snippets"
import getPort from "get-port"
import { TscircuitApiClient } from "lib"

interface TestFixture {
  ky: KyInstance
  serverUrl: string
  client: TscircuitApiClient
}

export const getTestFixture = async (): Promise<TestFixture> => {
  process.env.BUN_TEST = "true"
  // Find a free port for the test server
  const port = await getPort()
  const testInstanceId = Math.random().toString(36).substring(2, 15)
  const testDbName = `testdb${testInstanceId}`

  // Start the fake-snippets server and get its db
  const { server, db } = await startServer({
    port,
    testDbName,
  })

  // Seed the fake-snippets database
  seedDB(db)

  const serverUrl = `http://localhost:${port}/api`

  // Create a Ky client instance that points directly to the fake-snippets server
  const kyInstance = ky.create({
    prefixUrl: serverUrl,
    retry: 0,
  })

  const client = new TscircuitApiClient({
    baseUrl: serverUrl,
    apiKey: "dummy",
  })

  // Cleanup logic
  afterAll(() => {
    server.stop()
  })

  return {
    ky: kyInstance,
    serverUrl,
    client,
  }
}
