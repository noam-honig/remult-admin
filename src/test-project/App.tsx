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
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  NavLink,
} from 'react-router-dom'
import { God } from './God'

declare const entities: EntityUIInfo[]
declare let optionsFromServer: DisplayOptions

function App() {
  const [god, setGod] = useState<God>()
  const [options, setOptions] = useState<DisplayOptions>({})

  useEffect(() => {
    if (import.meta.env.DEV) {
      fetch('/api/dev-admin')
        .then((x) => x.json())
        .then((x) => setGod(new God(x)))
    } else {
      setGod(new God(entities))
      setOptions(optionsFromServer)
    }
  }, [])
  if (!god) return <div>Loading...</div>

  return (
    <>
      <BrowserRouter basename={options?.baseUrl}>
        <div style={{ display: 'flex', padding: '10px' }}>
          {god?.tables.map((t) => (
            <NavLink
              key={t.key}
              to={t.key}
              style={({ isActive }) => {
                return {
                  fontWeight: isActive ? 'bold' : '',
                  marginRight: '10px',
                }
              }}
            >
              {t.key}
            </NavLink>
          ))}
        </div>
        <Routes>
          {god?.tables.map((table) => (
            <Route
              key={table.key}
              path={table.key}
              element={
                <Table
                  god={god}
                  columns={table.fields}
                  repo={table.repo}
                  relations={table.relations}
                />
              }
            />
          ))}

          <Route
            path="/"
            element={
              <Navigate
                to={
                  god?.tables && god?.tables.length > 0
                    ? god?.tables[0].key
                    : '/'
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
//[v] - show sort order

//[ ] - serialize find options to uri
//[ ] - support checkbox :)
//[ ] - respect allow update for column
//[ ] - respect api update / delete /insert ruiles
//[ ] - add json editor
