import { test, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/getTestFixture"

test("/something/get", async () => {
  const { client } = getTestFixture()

  const createdThing = await client.something.create({})

  const gottenThing = await client.something.get({ something_id: createdThing.something_id })

  // expect(gottenThing)...
})
