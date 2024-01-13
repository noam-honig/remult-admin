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
  customerInfo = ''
  @Fields.number()
  amount = 0
}
