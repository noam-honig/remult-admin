import { useEffect, useState } from 'react'
import { EntityOrderBy, Repository, FindOptions } from 'remult'
import { FieldUIInfo } from '../../lib/entity-info'
import { EditableRow } from './EditableRow'
import Filter from './Filter'

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
      <Filter
        fields={columns}
        filter={options.where}
        setFilter={(where) => setOptions({ ...options, where })}
      />
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
