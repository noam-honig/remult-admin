import { ClassType, Remult, remult } from 'remult'

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
      fields: metadata.fields
        .toArray()
        .map((x) => ({ key: x.key, caption: x.caption })),
    }))
}

/**FROM */
import fs from 'fs'
import { AdminOptions } from './entity-info'
function getHtml() {
  return fs.readFileSync('tmp/index.html', 'utf8')
}
/**TO */
