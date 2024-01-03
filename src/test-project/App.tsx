import { useEffect, useState } from 'react'
import { Entity, Fields, Repository, repo } from 'remult'
import { EntityUIInfo } from '../lib/entity-info'
import { RemultGrid } from 'remult-uikit'
import {
  BrowserRouter,
  Routes as Router,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'

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
      fetch('/api/dev-admin')
        .then((x) => x.json())
        .then((x) => setIt(x))
    } else {
      setIt(entities)
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <div style={{ display: 'flex', padding: '10px' }}>
          {tables?.map((t) => (
            <Link key={t.key} style={{ marginRight: '10px' }} to={t.key}>
              {t.key}
            </Link>
          ))}
        </div>
        <Router>
          {tables?.map((t) => (
            <Route
              key={t.key}
              path={t.key}
              element={<RemultGrid showId repo={t.repo} />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to={`${tables && tables[0].key}`} replace />}
          />
        </Router>
      </BrowserRouter>
    </>
  )
}

export default App
//[ ] - route per entity - V
//[ ] - select entity
//[ ] - use your library - V
//[ ] - column filtering
//[ ] - serialize find options to uri
//[ ] - support checkbox :) - V
//[ ] - respect api update / delete /insert rules - V
//[ ] - respect include in api - V
//[ ] - respect allow update for column - V
