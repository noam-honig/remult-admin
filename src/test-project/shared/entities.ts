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
  @Fields.string()
  customer = ''
  @Relations.toOne(() => Customer, 'customer')
  customerEntity = ''
  @Fields.number()
  amount = 0
  @Fields.json()
  items = [{ id: 1, quantity: 5 }]
}
