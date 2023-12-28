import { useEffect, useMemo, useState } from 'react'
import { ErrorInfo } from 'remult'

export function EditableRow({
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
