import { ClassType, Remult, remult, repo } from 'remult'
import { getRelationInfo } from 'remult/internals'

export default function remultAdminHtml(options: AdminOptions) {
  let optionsFromServer = { ...options }
  //@ts-ignore
  delete optionsFromServer.entities
  return getHtml().replace(
    '<!--PLACE_HERE-->',
    `<script >const entities = ${JSON.stringify(buildEntityInfo(options))}
    const optionsFromServer = ${JSON.stringify(optionsFromServer)}
    </script>`
  )
}

export function buildEntityInfo(options: AdminOptions) {
  return options.entities
    .map((e) => remult.repo(e).metadata)
    .map((metadata) => ({
      key: metadata.key,
      caption: metadata.caption,
      fields: metadata.fields.toArray().map((x) => {
        let relation: FieldRelationInfo | undefined
        let valFieldKey = x.key
        const info = getRelationInfo(x.options)
        if (info && (info.type === 'reference' || info.type === 'toOne')) {
          const relRepo = repo(info.toType())
          const idField = relRepo.metadata.idMetadata.field.key
          if (info.type == 'toOne') {
            //@ts-ignore
            valFieldKey = x.options['field']
          }
          relation = {
            entityKey: relRepo.metadata.key,
            idField,
            captionField: relRepo.metadata.fields
              .toArray()
              .find((x) => x.key != idField && x.valueType == String)?.key!,
          }
        }
        return {
          key: x.key,
          valFieldKey,
          caption: x.caption,
          relation,
        } satisfies FieldUIInfo
      }),
    }))
}

/**FROM */
import fs from 'fs'
import { AdminOptions, FieldRelationInfo, FieldUIInfo } from './entity-info'
function getHtml() {
  return fs.readFileSync('tmp/index.html', 'utf8')
}
/**TO */
