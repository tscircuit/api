import { test, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/getTestFixture"

test("/something/create", async () => {
  const { client } = getTestFixture()

  const createdThing = await client.something.create({})

  // expect(createdThing)...
})
