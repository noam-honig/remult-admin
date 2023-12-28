import { useEffect, useMemo, useState } from "react"
import {
  Entity,
  EntityOrderBy,
  ErrorInfo,
  Fields,
  Repository,
  repo,
} from "remult"
import { Table } from "./components/table"
import { EntityUIInfo } from "./entity-browser/entity-info"

declare const entities: EntityUIInfo[]

function App() {
  const [tables, setTables] =
    useState<(EntityUIInfo & { repo: Repository<any> })[]>()
  useEffect(() => {
    function setIt(myEntities: EntityUIInfo[]) {
      setTables(
        myEntities.map((info) => {
          class C {}
          for (const f of info.fields) {
            Fields.string()(C.prototype, f.key)
          }
          Entity(info.caption, { allowApiCrud: true })(C)
          return {
            ...info,
            repo: repo(C),
          }
        })
      )
    }

    if (import.meta.env.DEV) {
      setIt([
        {
          key: "customers",
          caption: "Customers",
          fields: [
            {
              key: "id",
              caption: "Id",
            },
            {
              key: "name",
              caption: "Name",
            },
            {
              key: "city",
              caption: "City",
            },
          ],
        },
      ])
    } else {
      setIt(entities)
    }
  }, [])

  return (
    <>
      {tables?.map((table) => (
        <div key={table.key}>
          <h3>{table.caption}</h3>
          <Table columns={table.fields} repo={table.repo} />
        </div>
      ))}
    </>
  )
}

export default App
