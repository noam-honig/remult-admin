import { useEffect, useState } from 'react'
import { EntityOrderBy, Repository, FindOptions, EntityFilter } from 'remult'
import { EntityRelationToManyInfo, FieldUIInfo } from '../../lib/entity-info'
import { EditableRow } from './EditableRow'
import Filter from './Filter'
import { God } from '../God'

export function Table({
  columns,
  relations,
  repo,
  god,
  parentRelation,
}: {
  columns: FieldUIInfo[]
  relations: EntityRelationToManyInfo[]
  repo: Repository<any>
  god: God
  parentRelation?: Record<string, any>
}) {
  const [items, setItems] = useState<any[]>()
  const [totalRows, setTotalRows] = useState(0)

  const [newRow, setNewRow] = useState()
  const [options, setOptions] = useState<FindOptions<any>>({
    limit: 25,
    page: 1,
  })
  const [userFilter, setUserFilter] = useState<EntityFilter<any>>({})
  useEffect(() => {
    return repo
      .liveQuery({
        ...options,
        where: {
          $and: [userFilter, { ...parentRelation }],
        },
      })
      .subscribe((info) => {
        setItems(info.applyChanges)
      })
  }, [options, userFilter, columns, repo, parentRelation])
  useEffect(() => {
    repo.count({ $and: [userFilter, { ...parentRelation }] }).then(setTotalRows)
  }, [userFilter, parentRelation, repo])
  useEffect(() => {
    setItems(undefined)
  }, [repo, columns])

  function toggleOrderBy(key: string) {
    let dir = options.orderBy?.[key]
    if (dir === undefined) dir = 'asc'
    else if (dir === 'asc') dir = 'desc'
    else dir = undefined
    setOptions({ ...options, orderBy: { [key]: dir } })
  }

  return (
    <div>
      <span>
        {((options.page || 1) - 1) * options.limit! +
          1 +
          ' - ' +
          (((options.page || 1) - 1) * options.limit! +
            (items?.length || 0))}{' '}
        of {totalRows}
      </span>{' '}
      <button
        onClick={() =>
          setOptions({ ...options, page: (options.page || 2) - 1 })
        }
      >
        {'<'}{' '}
      </button>{' '}
      <button
        onClick={() =>
          setOptions({ ...options, page: (options.page || 1) + 1 })
        }
      >
        {'>'}{' '}
      </button>
      <Filter
        fields={columns}
        filter={userFilter}
        setFilter={(where) => setUserFilter(where)}
      />
      <table>
        <thead>
          <tr>
            <td />
            {columns.map((x) => (
              <th key={x.key} onClick={() => toggleOrderBy(x.key)}>
                {x.caption}{' '}
                {options.orderBy?.[x.key] === 'asc'
                  ? '▲'
                  : options.orderBy?.[x.key] === 'desc'
                  ? '▼'
                  : ''}
              </th>
            ))}
            <th>Actions </th>
          </tr>
        </thead>
        <tbody>
          {items?.map((row) => (
            <EditableRow
              key={repo.metadata.idMetadata.getId(row)}
              rowId={repo.metadata.idMetadata.getId(row)}
              row={row}
              save={async (item) => {
                await repo.save(item)
              }}
              deleteAction={() => repo.delete(row)}
              columns={columns}
              relations={relations}
              god={god}
            />
          ))}
          {newRow ? (
            <EditableRow
              row={newRow}
              rowId={undefined!}
              deleteAction={async () => setNewRow(undefined)}
              save={async (item) => {
                await repo.insert(item)
                setNewRow(undefined)
              }}
              columns={columns}
              god={god}
              relations={[]}
            ></EditableRow>
          ) : (
            <tr>
              <td></td>
              <td colSpan={columns.length + 1}>
                <button
                  onClick={() => setNewRow(repo.create({ ...parentRelation }))}
                >
                  Add row
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
