#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import zlib from 'node:zlib'
import { promisify } from 'node:util'

const gunzip = promisify(zlib.gunzip)
const ENCRYPTION_KEY = "Why would you want to cheat?... :o It's no fun. :') :'D"

async function decryptEs3FromBuffer(encryptedData, password) {
  const iv = encryptedData.subarray(0, 16)
  const cipherText = encryptedData.subarray(16)

  const key = crypto.pbkdf2Sync(password, iv, 100, 16, 'sha1')
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)

  const decryptedData = Buffer.concat([
    decipher.update(cipherText),
    decipher.final()
  ])

  if (decryptedData.subarray(0, 2).equals(Buffer.from([0x1F, 0x8B]))) {
    return gunzip(decryptedData)
  }

  return decryptedData
}

function printUsage() {
  console.error(
    'Usage: node scripts/decrypt-save.mjs <input.es3> [output.json]'
  )
}

async function main() {
  const inputPath = process.argv[2]
  const outputPathArg = process.argv[3]

  if (!inputPath || inputPath === '--help' || inputPath === '-h') {
    printUsage()
    process.exit(inputPath ? 0 : 1)
  }

  const encryptedData = await fs.readFile(inputPath)
  const decryptedData = await decryptEs3FromBuffer(
    encryptedData,
    ENCRYPTION_KEY
  )

  let formattedJson
  try {
    formattedJson = `${JSON.stringify(
      JSON.parse(decryptedData.toString('utf8')),
      null,
      2
    )}\n`
  } catch {
    formattedJson = decryptedData.toString('utf8')
  }

  const outputPath =
    outputPathArg ??
    path.join(
      path.dirname(inputPath),
      `${path.basename(inputPath, path.extname(inputPath))}.json`
    )

  await fs.writeFile(outputPath, formattedJson, 'utf8')
  console.log(`Decrypted save written to ${outputPath}`)
}

try {
  await main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
