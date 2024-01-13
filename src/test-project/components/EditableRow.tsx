import { useEffect, useMemo, useState } from 'react'
import { ErrorInfo } from 'remult'
import { EditableField } from './EditableField'
import { FieldUIInfo } from '../../lib/entity-info'
import { God } from '../God'

export function EditableRow({
  row,
  save,
  columns,
  deleteAction,
  god,
}: {
  row: any
  save: (data: any) => Promise<void>
  deleteAction?: () => Promise<void>
  columns: FieldUIInfo[]
  god: God
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
