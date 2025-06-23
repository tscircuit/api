import { test, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/getTestFixture"

test("/datasheets/get", async () => {
  const { client } = await getTestFixture()

  const created = await client.datasheets.create({ chip_name: "Chip" })

  const gotten = await client.datasheets.get({
    datasheet_id: created.datasheet_id,
  })

  expect(gotten.datasheet_id).toBe(created.datasheet_id)
})

test("/datasheets/get by chip_name", async () => {
  const { client } = await getTestFixture()

  await client.datasheets.create({ chip_name: "ChipName" })

  const gotten = await client.datasheets.get({ chip_name: "ChipName" })

  expect(gotten.chip_name).toBe("ChipName")
})
