import express from "express"
import { api } from "./api"
import { Customer, Order } from "../shared/entities"
import getEntityBrowserHtml from "../entity-browser"
//import getEntityBrowserHtml from "../../dist/entity-browser/index"

const app = express()
app.use(api)
app.get("/admin", (req, res) => {
  res.send(getEntityBrowserHtml([Customer, Order]))
})
app.get("*", (req, res) => res.send(`api Server - path: "${req.path}"`))
app.listen(3002, () => console.log("Server started"))
