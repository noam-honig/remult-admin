import { useEffect, useState } from 'react'
import { FieldUIInfo } from '../../lib/entity-info'
import { God } from '../God'
import { SelectDialog } from './SelectDialog'

export function RelationField({
  value,
  onChange,
  info,
  god,
}: {
  value: any
  onChange: (value: any) => void
  info: FieldUIInfo
  god: God
}) {
  const [displayValue, setDisplayValue] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  useEffect(() => {
    god.displayValueFor(info, value).then((value) => {
      setDisplayValue(value)
    })
  }, [value])
  return (
    <div>
      <button onClick={() => setDialogOpen(true)}>🔎</button>
      {displayValue}
      {dialogOpen && (
        <SelectDialog
          relation={info.relationToOne!}
          onSelect={onChange}
          god={god}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  )
}
