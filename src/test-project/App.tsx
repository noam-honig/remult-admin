import { useEffect, useMemo, useState } from 'react'
import {
  Entity,
  EntityOrderBy,
  ErrorInfo,
  Fields,
  Repository,
  repo,
} from 'remult'
import { Table } from './components/table'
import { DisplayOptions, EntityUIInfo } from '../lib/entity-info'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'

declare const entities: EntityUIInfo[]
declare let optionsFromServer: DisplayOptions

function App() {
  const [tables, setTables] =
    useState<(EntityUIInfo & { repo: Repository<any> })[]>()
  const [options, setOptions] = useState<DisplayOptions>({})

  useEffect(() => {
    function setIt(myEntities: EntityUIInfo[]) {
      setTables(
        myEntities.map((info) => {
          class C {}
          for (const f of info.fields) {
            Fields.string()(C.prototype, f.key)
          }
          Entity(info.key, { allowApiCrud: true, caption: info.caption })(C)
          return {
            ...info,
            repo: repo(C),
          }
        })
      )
    }

    if (import.meta.env.DEV) {
      fetch('/api/dev-admin')
        .then((x) => x.json())
        .then((x) => setIt(x))
    } else {
      setIt(entities)
      setOptions(optionsFromServer)
    }
  }, [])

  return (
    <>
      <BrowserRouter basename={options?.baseUrl}>
        <div style={{ display: 'flex', padding: '10px' }}>
          {tables?.map((t) => (
            <Link key={t.key} style={{ marginRight: '10px' }} to={t.key}>
              {t.key}
            </Link>
          ))}
        </div>
        <Routes>
          {tables?.map((table) => (
            <Route
              key={table.key}
              path={table.key}
              element={<Table columns={table.fields} repo={table.repo} />}
            />
          ))}

          <Route
            path="/"
            element={
              <Navigate
                to={tables && tables.length > 0 ? tables[0].key : '/'}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
//[ ] - route per entity
//[ ] - select entity
//[ ] - use your library
//[ ] - column filtering
//[ ] - serialize find options to uri
//[ ] - support checkbox :)
//[ ] - respect api update / delete /insert ruiles
//[ ] - respect include in apu
//[ ] - respect allow update for column
