import { remultExpress } from 'remult/remult-express'
import { Agent_Admin_Info, Customer, Order } from '../shared/entities'
import { repo } from 'remult'

export const entities = [Customer, Order, Agent_Admin_Info]
export const api = remultExpress({
  entities,
})
