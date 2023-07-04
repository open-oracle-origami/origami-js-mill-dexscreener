import { searchPairsMatchingQuery } from 'dexscreener-api'

import { BaseMill } from '@open-oracle-origami/origami-js-sdk'
import { poll } from 'poll'

export class DexScreenerSearchMill extends BaseMill {
  private readonly pollIntervalMs: number
  params: string | null

  constructor({
    id = 'dexscreenersearch',
    params = null,
    pollIntervalMs = 5000,
  }) {
    super()

    if (id) this.setId(id)
    this.pollIntervalMs = pollIntervalMs
    this.params = params
  }

  private query = async () => {
    return searchPairsMatchingQuery(`${this.params}`).then((data: any) => {
      const paper = {
        data,
        created: new Date(),
      }

      this.emitter.publish(`mill.${this.id ?? 'undefined'}`, paper)
    })
  }

  start = () => {
    super.start()

    if (!this.params) {
      throw new Error('params is required in constructor')
    }

    void poll(this.query, this.pollIntervalMs)
  }
}

export default DexScreenerSearchMill
