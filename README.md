# remult-admin

A basic admin console to view [remult](https://remult.dev) entities.

## Usage

Express example:

```ts
import express from 'express'
import { remultExpress } from 'remult/remult-express'
import remultAdmin from 'remult-admin'

const app = express()

const entities = [
  /* entity types */
]
const api = remultExpress({
    entities,
  })
app.use(api)

app.get("/admin", api.withRemult, (req, res) =>
  res.send(remultAdmin({
    entities
  }));
);

app.listen(3000)
```
