#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ENCRYPTION_KEY =
  "Why would you want to cheat?... :o It's no fun. :') :'D"

function printUsage() {
  console.error(
    'Usage: node scripts/encrypt-save.mjs <input.json> [output.es3]'
  )
}

async function main() {
  const inputPath = process.argv[2]
  const outputPathArg = process.argv[3]

  if (!inputPath || inputPath === '--help' || inputPath === '-h') {
    printUsage()
    process.exit(inputPath ? 0 : 1)
  }

  const data = await fs.readFile(inputPath, 'utf8')
  const iv = crypto.randomBytes(16)
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, iv, 100, 16, 'sha1')
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  const encryptedData = Buffer.concat([
    cipher.update(Buffer.from(data, 'utf8')),
    cipher.final()
  ])

  const outputPath =
    outputPathArg ??
    path.join(
      path.dirname(inputPath),
      `${path.basename(inputPath, path.extname(inputPath))}.es3`
    )

  await fs.writeFile(outputPath, Buffer.concat([iv, encryptedData]))
  console.log(`Encrypted save written to ${outputPath}`)
}

try {
  await main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
