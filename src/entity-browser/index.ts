import { ClassType, Remult } from "remult"

export default function getEntityBrowserHtml(entities: ClassType<any>[]) {
  return getHtml().replace(
    "<!--PLACE_HERE-->",
    `<script >const entities=${JSON.stringify(
      buildEntityInfo(entities)
    )}</script>`
  )
}

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

/**FROM */
import fs from "fs"
function getHtml() {
  return fs.readFileSync("dist/index.html", "utf8")
}
/**TO */
