import { test, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/getTestFixture"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

test("datasheets.findCreateWait", async () => {
  const { client, ky } = await getTestFixture()

  const waitPromise = client.datasheets.findCreateWait({
    chip_name: "WaitChip",
  })

  await delay(100)
  await ky.get("_fake/run_async_tasks").json()

  const result = await waitPromise
  expect(result.chip_name).toBe("WaitChip")
  expect(result.pin_information).not.toBeNull()
})
