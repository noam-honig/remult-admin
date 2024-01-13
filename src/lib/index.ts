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
        let relation: FieldUIInfo['relation']
        const info = getRelationInfo(x.options)
        if (info && info.type === 'reference') {
          const relRepo = repo(info.toType())
          const idField = relRepo.metadata.idMetadata.field.key
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
          caption: x.caption,
          relation,
        }
      }),
    }))
}

/**FROM */
import fs from 'fs'
import { AdminOptions, FieldUIInfo } from './entity-info'
function getHtml() {
  return fs.readFileSync('tmp/index.html', 'utf8')
}
/**TO */
