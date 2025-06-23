import { test, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/getTestFixture"

test("/health", async () => {
  const { ky } = await getTestFixture()

  const result = await ky.get("health").json()

  console.log(result)
})
