import { remultExpress } from 'remult/remult-express'
import { Customer, Order } from '../shared/entities'
import { repo } from 'remult'

export const entities = [Customer, Order]
export const api = remultExpress({
  entities,
})
