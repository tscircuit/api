import { test, expect } from "bun:test"
import { TscircuitApiClient } from "lib"

test("compile.compileCode", async () => {
  const client = new TscircuitApiClient({ apiKey: "dummy" })

  const result = await client.compile.compileCode({
    fs_map: {
      "index.tsx": `export default () => (
        <resistor name="R1" resistance="1k" />
      )`,
    },
  })

  expect(Array.isArray(result.circuit_json)).toBe(true)
  expect(Array.isArray(result.logs)).toBe(true)
})
