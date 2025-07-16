# @tscircuit/api

[Get an API Key](https://docs.tscircuit.com/command-line/tsci-auth-print-token)

Library for accessing the tscircuit API.

## Usage

```ts
import { TscircuitApiClient } from "@tscircuit/api"

const client = new TscircuitApiClient({ apiKey: "your-api-key" })
```

### Create a datasheet

```ts
const datasheet = await client.datasheets.create({ chip_name: "RP2040" })
```

### Get a datasheet

You can retrieve a datasheet by `datasheet_id` or by `chip_name`.

```ts
// by id
const dsById = await client.datasheets.get({ datasheet_id: datasheet.datasheet_id })

// by chip name
const dsByName = await client.datasheets.get({ chip_name: "RP2040" })
```

### Find, create and wait for processing

`findCreateWait` is a convenience method that attempts to fetch a datasheet by
`chip_name`. If it does not exist the datasheet is created. The method then
polls `datasheets/get` until the datasheet's `pin_information` field is
populated.

```ts
const processed = await client.datasheets.findCreateWait({ chip_name: "RP2040" })
```

The promise resolves once processing is complete or throws after a timeout.

### Example datasheet output

A response from `datasheets/get` contains all of the datasheet fields. Below is
an abbreviated example for the RP2040:

```json
{
  "datasheet": {
    "datasheet_id": "2a51fc64-5154-4513-ad7c-29429bdc973e",
    "chip_name": "RP2040",
    "datasheet_pdf_urls": [
      "https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf"
    ],
    "pin_information": [
      {
        "name": ["IOVDD"],
        "pin_number": "1",
        "description": "Power supply for digital GPIOs, nominal voltage 1.8V to 3.3V.",
        "capabilities": ["Power Supply (Digital IO)"]
      },
      {
        "name": ["GPIO0"],
        "pin_number": "2",
        "description": "General-purpose digital input and output.",
        "capabilities": ["GPIO", "SPI0_RX", "UART0_TX", "..."]
      },
      ...
    ]
  }
}
```

### Compile code

Compile tscircuit JSX/TSX code into Circuit JSON using `client.compile.compileCode`.

```ts
const result = await client.compile.compileCode({
  fs_map: {
    "user-code.tsx": `export default () => (
      <resistor name="R1" resistance="1k" />
    )`,
  },
})

console.log(result.circuit_json)
```
