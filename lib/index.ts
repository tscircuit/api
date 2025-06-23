export interface TscircuitApiClientParameters {
  baseUrl?: string
  apiKey?: string
}

export class TscircuitApiClient {
  private baseUrl: string
  private apiKey?: string

  constructor({ baseUrl, apiKey }: TscircuitApiClientParameters) {
    this.baseUrl = baseUrl ?? "https://api.tscircuit.com"
    this.apiKey = apiKey ?? process.env.TSCIRCUIT_API_KEY

    if (!this.apiKey) {
      throw new Error(
        "TSCIRCUIT_API_KEY is not set. Please set it in the environment variables or pass it to the constructor to TscircuitApiClient.",
      )
    }
  }
}
