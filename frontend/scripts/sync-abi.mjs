import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const artifactPath =
  process.env.FLUID_ARTIFACT_PATH ??
  path.resolve(process.cwd(), '..', 'out', 'FluidSepoliaV1.sol', 'FluidSepoliaV1.json')
const outputPath = path.resolve(
  process.cwd(),
  'src',
  'lib',
  'abi',
  'fluidSepolia.ts',
)

const raw = await readFile(artifactPath, 'utf8')
const artifact = JSON.parse(raw)

if (!Array.isArray(artifact.abi)) {
  throw new Error(`No ABI array found in ${artifactPath}`)
}

const header = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: out/FluidSepoliaV1.sol/FluidSepoliaV1.json
// Regenerate with: pnpm sync-abi

`

const body = `export const fluidSepoliaAbi = ${JSON.stringify(artifact.abi, null, 2)} as const\n`

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, header + body, 'utf8')

process.stdout.write(
  `Synced ${artifact.abi.length} ABI entries to ${path.relative(process.cwd(), outputPath)}\n`,
)
