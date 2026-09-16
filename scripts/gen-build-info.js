const { execSync } = require("child_process")
const { writeFileSync } = require("fs")

const hash = execSync("git rev-parse --short HEAD").toString().trim()
const date = new Date().toISOString().split("T")[0]

writeFileSync(
  "src/features/portfolio/data/build-info.ts",
  `// AUTO-GENERATED — do not edit manually
export const BUILD_INFO = {
  hash: "${hash}",
  date: "${date}",
}
`
)
