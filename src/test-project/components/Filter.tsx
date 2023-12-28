import { useEffect, useState } from 'react'
import { FieldUIInfo } from '../../lib/entity-info'
import {
  ComparisonValueFilter,
  ContainsStringValueFilter,
  EntityFilter,
} from 'remult'

const defaultFilter: {
  key: string
  operator: (
    | keyof ContainsStringValueFilter
    | keyof ComparisonValueFilter<any>
    | ''
  ) &
    string
  value: any
} = { key: '', operator: '$contains', value: '' }

const operators: [typeof defaultFilter.operator, string][] = [
  ['', 'equal'],
  ['$contains', 'contains'],
  ['$ne', 'nor equal'],
]

export default function Filter({
  fields,
  filter,
  setFilter,
}: {
  fields: FieldUIInfo[]
  filter?: EntityFilter<any>
  setFilter: (filter: EntityFilter<any>) => void
}) {
  const [show, setShow] = useState(false)
  const [filterValues, setFilterValues] = useState<(typeof defaultFilter)[]>([])
  useEffect(() => {
    translateFilterToFilterValues()
  }, [filter])

  function addFilter() {
    setFilterValues([
      ...filterValues,
      {
        ...defaultFilter,
        key:
          fields.find(
            (x) => x.key != 'id' && !filterValues.find((y) => y.key == x.key)
          )?.key || '',
      },
    ])
  }

  if (!show) {
    return (
      <button
        onClick={() => {
          setShow(!show)
          if (filterValues.length == 0) {
            addFilter()
          }
        }}
      >
        Filter
      </button>
    )
  }

  return (
    <div style={{ display: 'inline-block', border: 'solid 1px', padding: 8 }}>
      <strong>filter:</strong>
      <div>
        {filterValues?.map((field, i) => {
          function set(key: keyof typeof field, value: any) {
            setFilterValues(
              filterValues.map((x, j) => (i === j ? { ...x, [key]: value } : x))
            )
          }

          return (
            <div key={field.key}>
              <select onChange={(e) => set('key', e.target.value)}>
                {fields
                  .filter(
                    (x) =>
                      x.key == field.key ||
                      !filterValues.find((y) => y.key == x.key)
                  )
                  .map((x) => (
                    <option
                      key={x.key}
                      value={x.key}
                      selected={x.key === field.key}
                    >
                      {x.caption}
                    </option>
                  ))}
              </select>
              <select onChange={(e) => set('operator', e.target.value)}>
                {operators.map(([key, caption]) => (
                  <option
                    key={key}
                    value={caption}
                    selected={key === field.operator}
                  >
                    {caption}
                  </option>
                ))}
              </select>
              <input
                value={field.value}
                onChange={(e) => set('value', e.target.value)}
              />
              <button
                onClick={() =>
                  setFilterValues(filterValues.filter((x) => x != field))
                }
              >
                x
              </button>
            </div>
          )
        })}
        <button onClick={addFilter}>Add</button>
        <div>
          <button onClick={() => applyFilterValues()}>apply</button>
          <button
            onClick={() => {
              translateFilterToFilterValues()
              setShow(false)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )

  function applyFilterValues() {
    let filter: any = {}
    for (const f of filterValues) {
      if (f.operator === '') {
        filter[f.key] = f.value
      } else {
        filter[f.key] = { [f.operator]: f.value }
      }
    }
    setFilter(filter)
    setShow(false)
  }

  function translateFilterToFilterValues() {
    let values: (typeof defaultFilter)[] = []
    for (const key in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, key)) {
        const element = filter[key]
        if (typeof element === 'object') {
          for (const operator in element) {
            if (Object.prototype.hasOwnProperty.call(element, operator)) {
              const val = element[operator]
              values.push({ key, operator, value: val })
            }
          }
        } else {
          if (element != undefined)
            values.push({ key, operator: '', value: element })
        }
      }
    }
    setFilterValues(values)
  }
}
