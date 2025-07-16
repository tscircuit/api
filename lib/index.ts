import ky, { type KyInstance } from "ky"
import type { Datasheet } from "@tscircuit/fake-snippets/schema"

export interface TscircuitApiClientParameters {
  baseUrl?: string
  apiKey?: string
}

export class TscircuitApiClient {
  private baseUrl: string
  private apiKey?: string
  private ky: KyInstance
  private compileKy: KyInstance

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

    this.compileKy = ky.create({
      prefixUrl: "https://compile.tscircuit.com/api",
      retry: 0,
    })
  }

  public datasheets = {
    create: async ({
      chip_name,
    }: {
      chip_name: string
    }): Promise<Datasheet> => {
      const res = await this.ky
        .post("datasheets/create", { json: { chip_name } })
        .json<{ datasheet: Datasheet }>()
      return res.datasheet
    },
    get: async ({
      datasheet_id,
      chip_name,
    }: {
      datasheet_id?: string
      chip_name?: string
    }): Promise<Datasheet> => {
      const searchParams: Record<string, string> = {}
      if (datasheet_id) searchParams.datasheet_id = datasheet_id
      if (chip_name) searchParams.chip_name = chip_name
      const res = await this.ky
        .get("datasheets/get", { searchParams })
        .json<{ datasheet: Datasheet }>()
      return res.datasheet
    },
    findCreateWait: async ({
      chip_name,
    }: {
      chip_name: string
    }): Promise<Datasheet> => {
      try {
        const existing = await this.datasheets.get({ chip_name })
        if (existing.pin_information) return existing
      } catch (err: any) {
        if (!(err instanceof Error) || (err as any)?.response?.status !== 404) {
          throw err
        }
      }

      await this.datasheets.create({ chip_name })

      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 1000))
        try {
          const ds = await this.datasheets.get({ chip_name })
          if (ds.pin_information) return ds
        } catch (err: any) {
          if ((err as any)?.response?.status !== 404) throw err
        }
      }

      throw new Error("Timed out waiting for datasheet to be processed")
    },
  }

  public compile = {
    compileCode: async ({
      fs_map,
      code,
    }: {
      fs_map?: Record<string, string>
      code?: string
    }): Promise<{ circuit_json: any; logs: any[] }> => {
      if (fs_map) {
        return this.compileKy
          .post("compile", { json: { fs_map } })
          .json<{ circuit_json: any; logs: any[] }>()
      }

      if (code) {
        return this.compileKy
          .get("compile", { searchParams: { code } })
          .json<{ circuit_json: any; logs: any[] }>()
      }

      throw new Error("Either fs_map or code must be provided")
    },
  }
}

export type { Datasheet }
