import { useEffect, useMemo, useState } from 'react'
import { ErrorInfo, EntityOrderBy, Repository } from 'remult'
import { FieldUIInfo } from '../../lib/entity-info'

export function Table({
  columns,
  repo,
}: {
  columns: FieldUIInfo[]
  repo: Repository<any>
}) {
  const [items, setItems] = useState<any[]>()
  const [orderBy, setOrderBy] = useState<EntityOrderBy<any>>({})
  const [newRow, setNewRow] = useState()
  useEffect(
    () =>
      repo
        .liveQuery({ orderBy, limit: 25 })
        .subscribe((info) => setItems(info.applyChanges)),
    [orderBy, columns]
  )

  function toggleOrderBy(key: string) {
    let dir = orderBy[key]
    if (dir === undefined) dir = 'asc'
    else if (dir === 'asc') dir = 'desc'
    else dir = undefined
    setOrderBy({ [key]: dir })
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((x) => (
              <th key={x.key} onClick={() => toggleOrderBy(x.key)}>
                {x.caption}
              </th>
            ))}
            <th>
              Actions{' '}
              {!newRow && (
                <button onClick={() => setNewRow(repo.create())}>New</button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {newRow && (
            <EditableRow
              row={{}}
              save={async (item) => {
                await repo.insert(item)
                setNewRow(undefined)
              }}
              columns={columns}
            ></EditableRow>
          )}
          {items?.map((row) => (
            <EditableRow
              key={repo.metadata.idMetadata.getId(row)}
              row={row}
              save={async (item) => {
                await repo.save(item)
              }}
              deleteAction={() => repo.delete(row)}
              columns={columns}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EditableRow({
  row,
  save,
  columns,
  deleteAction,
}: {
  row: any
  save: (data: any) => Promise<void>
  deleteAction?: () => Promise<void>
  columns: { key: string }[]
}) {
  const [value, setValue] = useState(row)
  const [error, setError] = useState<ErrorInfo>()
  useEffect(() => {
    setValue(value)
  }, [row])
  const changed = useMemo(
    () => Boolean(columns.find((x) => value[x.key] != row[x.key])),
    [value, row]
  )
  async function doSave() {
    try {
      setError(undefined)
      await save(value)
    } catch (err: any) {
      alert(err.message)
      setError(err)
    }
  }

  return (
    <tr>
      {columns.map((x) => (
        <td key={x.key}>
          <input
            value={value[x.key]}
            onChange={(e) => {
              setValue({ ...value, [x.key]: e.target.value })
              if (error?.modelState?.[x.key])
                setError({
                  ...error,
                  modelState: { ...error.modelState, [x.key]: undefined },
                })
            }}
          />
          {error?.modelState?.[x.key] && (
            <div style={{ fontSize: 'small', color: 'red' }}>
              {error?.modelState?.[x.key]}
            </div>
          )}
        </td>
      ))}
      <td>
        <button disabled={!changed} onClick={doSave}>
          save
        </button>
        {deleteAction && (
          <button
            onClick={async () => {
              try {
                await deleteAction()
              } catch (err: any) {
                alert(err.message)
              }
            }}
          >
            delete
          </button>
        )}
      </td>
    </tr>
  )
}
