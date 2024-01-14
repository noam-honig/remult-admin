import { Entity, Fields, Repository, repo } from 'remult'
import {
  EntityUIInfo,
  FieldRelationToOneInfo,
  FieldUIInfo,
} from '../lib/entity-info'

export class God {
  async getItemsForSelect(
    relation: FieldRelationToOneInfo,
    search: string | undefined
  ) {
    const repo = this.tables.find((t) => t.key == relation.entityKey)!.repo
    return (
      await repo.find({
        limit: 25,
        orderBy: {
          [relation.captionField]: 'asc',
        },
        where: {
          [relation.captionField]: search
            ? {
                $contains: search,
              }
            : undefined,
        },
      })
    ).map((x) => ({
      id: x[relation.idField],
      caption: x[relation.captionField],
    }))
  }
  async displayValueFor(field: FieldUIInfo, value: any) {
    const relations = field.relationToOne!

    const repo = this.tables.find((t) => t.key == relations.entityKey)!.repo
    const item = await repo.findId(value)
    if (!item) return 'not found - ' + value
    return item[relations.captionField]
  }
  tables: (EntityUIInfo & { repo: Repository<any> })[]
  constructor(myEntities: EntityUIInfo[]) {
    this.tables = myEntities.map((info) => {
      class C {}
      for (const f of info.fields) {
        Fields.string()(C.prototype, f.key)
      }
      Entity(info.key, { allowApiCrud: true, caption: info.caption })(C)
      return {
        ...info,
        repo: repo(C),
      }
    })
  }
}
