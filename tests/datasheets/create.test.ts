import { test, expect } from "bun:test"
import { getTestFixture } from "tests/fixtures/getTestFixture"

test("/datasheets/create", async () => {
  const { client } = await getTestFixture()

  const datasheet = await client.datasheets.create({ chip_name: "TestChip" })

  expect(datasheet.chip_name).toBe("TestChip")
  expect(datasheet.pin_information).toBeNull()
  expect(datasheet.datasheet_pdf_urls).toBeNull()
})
