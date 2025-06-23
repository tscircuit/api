import ky, { type KyInstance } from "ky"
import type { Datasheet } from "@tscircuit/fake-snippets/dist/schema"

export interface TscircuitApiClientParameters {
  baseUrl?: string
  apiKey?: string
}

export class TscircuitApiClient {
  private baseUrl: string
  private apiKey?: string
  private ky: KyInstance

  constructor({ baseUrl, apiKey }: TscircuitApiClientParameters) {
    this.baseUrl = baseUrl ?? "https://api.tscircuit.com"
    this.apiKey = apiKey ?? process.env.TSCIRCUIT_API_KEY

    if (!this.apiKey) {
      throw new Error(
        "TSCIRCUIT_API_KEY is not set. Please set it in the environment variables or pass it to the constructor to TscircuitApiClient.",
      )
    }

    this.ky = ky.create({
      prefixUrl: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      retry: 0,
    })
  }

  public datasheets = {
    create: async ({ chip_name }: { chip_name: string }): Promise<Datasheet> => {
      const res = await this.ky
        .post("datasheets/create", { json: { chip_name } })
        .json<{ datasheet: Datasheet }>()
      return res.datasheet
    },
    get: async ({ datasheet_id }: { datasheet_id: string }): Promise<Datasheet> => {
      const res = await this.ky
        .get("datasheets/get", { searchParams: { datasheet_id } })
        .json<{ datasheet: Datasheet }>()
      return res.datasheet
    },
  }
}

export type { Datasheet }
