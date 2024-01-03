import { remultExpress } from 'remult/remult-express'
import { Customer, Order } from '../shared/entities'

export const entities = [Customer, Order]
export const api = remultExpress({
  entities,
})
