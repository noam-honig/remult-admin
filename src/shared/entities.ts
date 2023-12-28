import { Entity, Fields } from "remult"

@Entity("customers", {
  allowApiCrud: true,
})
export class Customer {
  @Fields.cuid()
  id = ""
  @Fields.string()
  name = ""
  @Fields.string()
  city = ""
}
@Entity("orders", {
  allowApiCrud: true,
})
export class Order {
  @Fields.cuid()
  id = ""
  @Fields.string()
  customer = ""
  @Fields.number()
  amount = 0
}
