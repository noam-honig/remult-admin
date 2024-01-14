import { useEffect, useMemo, useState } from 'react'
import { ErrorInfo } from 'remult'
import { EditableField } from './EditableField'
import { EntityRelationToManyInfo, FieldUIInfo } from '../../lib/entity-info'
import { God } from '../God'
import { Table } from './table'

export function EditableRow({
  row,
  save,
  columns,
  relations,
  deleteAction,
  god,
  rowId,
}: {
  row: any
  save: (data: any) => Promise<void>
  deleteAction?: () => Promise<void>
  columns: FieldUIInfo[]
  relations: EntityRelationToManyInfo[]
  god: God
  rowId: any
}) {
  const [value, setValue] = useState(row)
  const [error, setError] = useState<ErrorInfo>()
  const [relation, setRelation] = useState<EntityRelationToManyInfo | false>(
    false
  )
  const relationTable = useMemo(
    () =>
      typeof relation === 'object' &&
      god.tables.find((x) => x.key === relation.entityKey),
    [relation]
  )
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
    <>
      <tr>
        <td>
          {relations?.length > 0 && (
            <button
              onClick={() => setRelation(relation ? false : relations[0])}
            >
              {relation ? '👇' : '👉'}
            </button>
          )}
        </td>
        {columns.map((x) => (
          <td key={x.key} style={{ whiteSpace: 'nowrap' }}>
            <EditableField
              info={x}
              value={value[x.valFieldKey]}
              onChange={(fieldValue) => {
                setValue({ ...value, [x.valFieldKey]: fieldValue })
                if (error?.modelState?.[x.valFieldKey])
                  setError({
                    ...error,
                    modelState: {
                      ...error.modelState,
                      [x.valFieldKey]: undefined,
                    },
                  })
              }}
              god={god}
            />

            {error?.modelState?.[x.key] && (
              <div style={{ fontSize: 'small', color: 'red' }}>
                {error?.modelState?.[x.valFieldKey]}
              </div>
            )}
          </td>
        ))}
        <td style={{ whiteSpace: 'nowrap' }}>
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
      {relation && (
        <tr>
          <td></td>
          <td colSpan={columns.length + 1}>
            {relations.map((r) => (
              <a
                href=""
                onClick={(e) => {
                  setRelation(r)
                  e.preventDefault()
                }}
                style={{
                  marginRight: '10px',
                  fontWeight: r === relation ? 'bold' : 'normal',
                }}
              >
                {god.tables.find((x) => x.key === r.entityKey)!.caption}
              </a>
            ))}
            {relationTable && typeof relation === 'object' && (
              <Table
                columns={relationTable.fields}
                god={god}
                relations={relationTable.relations}
                repo={relationTable.repo}
                parentRelation={{
                  [relation!.fieldOnOtherEntity]: rowId,
                }}
              />
            )}
          </td>
        </tr>
      )}
    </>
  )
}
