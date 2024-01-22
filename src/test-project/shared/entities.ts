import { Entity, Fields, Relations, Validators } from 'remult'

@Entity('customers', {
  allowApiCrud: true,
})
export class Customer {
  @Fields.cuid()
  id = ''
  @Fields.string({
    validate: Validators.required,
  })
  name = ''
  @Fields.string()
  city = ''
  @Relations.toMany(() => Order, 'customer')
  orders?: Order[]
}
@Entity('orders', {
  allowApiCrud: true,
})
export class Order {
  @Fields.cuid()
  id = ''

  @Relations.toOne(() => Customer)
  customer = ''
  @Fields.number()
  amount = 0
  @Fields.json()
  items = [{ id: 1, quantity: 5 }]
}
