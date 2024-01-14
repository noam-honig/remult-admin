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
  const entities: EntityUIInfo[] = []
  for (const metadata of options.entities.map((e) => remult.repo(e).metadata)) {
    let fields: FieldUIInfo[] = []
    let relations: EntityRelationToManyInfo[] = []
    for (const x of metadata.fields.toArray()) {
      if (!x.includedInApi(undefined)) continue
      let relation: FieldRelationToOneInfo | undefined
      let valFieldKey = x.key
      const info = getRelationInfo(x.options)
      if (info) {
        const relRepo = repo(info.toType())
        const idField = relRepo.metadata.idMetadata.field.key
        if (info.type === 'reference' || info.type === 'toOne') {
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
        } else if (info.type === 'toMany') {
          relations.push({
            entityKey: relRepo.metadata.key,
            //@ts-ignore
            fieldOnOtherEntity: x.options['field'],
          })
          continue
        }
      }
      fields.push({
        key: x.key,
        valFieldKey,
        caption: x.caption,
        relationToOne: relation,
        type: x.valueConverter.fieldTypeInDb == 'json' ? 'json' : 'string',
      })
    }
    entities.push({
      key: metadata.key,
      caption: metadata.caption,
      fields,
      relations,
    })
  }
  return entities
}

/**FROM */
import fs from 'fs'
import {
  AdminOptions,
  EntityRelationToManyInfo,
  EntityUIInfo,
  FieldRelationToOneInfo,
  FieldUIInfo,
} from './entity-info'
function getHtml() {
  return fs.readFileSync('tmp/index.html', 'utf8')
}
/**TO */
