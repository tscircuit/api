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
