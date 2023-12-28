import { useEffect, useMemo, useState } from 'react'
import { ErrorInfo, EntityOrderBy, Repository, FindOptions } from 'remult'
import { FieldUIInfo } from '../../lib/entity-info'

export function Table({
  columns,
  repo,
}: {
  columns: FieldUIInfo[]
  repo: Repository<any>
}) {
  const [items, setItems] = useState<any[]>()

  const [newRow, setNewRow] = useState()
  const [options, setOptions] = useState<FindOptions<any>>({
    limit: 25,
    page: 1,
  })
  useEffect(
    () =>
      repo.liveQuery(options).subscribe((info) => setItems(info.applyChanges)),
    [options]
  )

  function toggleOrderBy(key: string) {
    let dir = options.orderBy?.[key]
    if (dir === undefined) dir = 'asc'
    else if (dir === 'asc') dir = 'desc'
    else dir = undefined
    setOptions({ ...options, orderBy: { [key]: dir } })
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
      <button
        onClick={() =>
          setOptions({ ...options, page: (options.page || 1) - 1 })
        }
      >
        {'<<'}{' '}
      </button>{' '}
      <span>{options.page}</span>{' '}
      <button
        onClick={() =>
          setOptions({ ...options, page: (options.page || 1) + 1 })
        }
      >
        {'>>'}{' '}
      </button>
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
    setValue(row)
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
//[ ] - allow filter

//[ ] - respect allow api update,delete etc...
//[ ] - respect respect allow api update on column level
//[ ] - respect include in api false
//[ ] - respect checkbox etc...
//[ ] - support dialog for selection of things
