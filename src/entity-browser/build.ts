import fs from "fs"

const html = fs.readFileSync("dist/index.html", "utf8")
const javascript = fs.readFileSync("dist/index.js", "utf8")

fs.mkdirSync("dist/entity-browser", { recursive: true })
fs.writeFileSync(
  "dist/entity-browser/index.js",

  javascript.replace(/\/\*\*FROM \*\/.*?\/\*\*TO \*\//gs, "") +
    `function getHtml(){
  return ${JSON.stringify(html)}
}`,
  "utf8"
)

//return Buffer.from(\`${Buffer.from(html).toString("base64")}\`
