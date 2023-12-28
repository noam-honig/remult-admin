import { ClassType, EntityMetadata, Remult } from "remult"

export function buildEntityInfo(entities: ClassType<any>[]) {
  return entities
    .map((e) => new Remult().repo(e).metadata)
    .map((metadata) => ({
      key: metadata.key,
      caption: metadata.caption,
      fields: metadata.fields
        .toArray()
        .map((x) => ({ key: x.key, caption: x.caption })),
    }))
}
