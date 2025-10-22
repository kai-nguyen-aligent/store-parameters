/* eslint-disable no-fallthrough */
import {read, validateCli} from '@1password/op-js'
import {Parameter} from '@aws-sdk/client-ssm'
import {fromIni} from '@aws-sdk/credential-providers'
import {input, select} from '@inquirer/prompts'
import stringQuoteOnlyIfNecessaryFormatter from '@json2csv/formatters/stringQuoteOnlyIfNecessary.js'
import {AsyncParser} from '@json2csv/node'
import {type} from 'arktype'
import chalk from 'chalk'
import csvtojson from 'csvtojson'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import Export from '../commands/export.js'
import Import from '../commands/import.js'

export interface StoreParameterResponse {
  Parameters: StoreParameter[]
}

export interface StoreParameter {
  ARN: string
  DataType: string
  LastModifiedDate: string
  Name: string
  Type: 'SecureString' | 'String'
  Value: string
  Version: number
}

const paramsSchema = type({Name: 'string', Type: '"SecureString" | "String"', Value: 'string'}).array().atLeastLength(1)

export const getCredentials = async (profile: string): Promise<ReturnType<typeof fromIni>> =>
  fromIni({
    mfaCodeProvider: async (serial: string) => input({message: `Enter MFA code for ${serial}:`}),
    profile,
  })

const determineDelimiter = (filePath: string, delimiter: string | undefined) => {
  if (delimiter) {
    return delimiter
  }

  if (filePath.endsWith('.tsv')) {
    return '\t'
  }

  return ','
}

export const parseCSV = async (filePath: string, customDelimiter: string | undefined, command: Import) => {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const delimiter = determineDelimiter(filePath, customDelimiter)

  checkFileAccess(absolutePath, command)

  const rawParams = await csvtojson({delimiter}).fromFile(absolutePath)

  return paramsSchema(rawParams)
}

export const exportToCSV = async (
  parameters: Parameter[],
  destination: string,
  customDelimiter: string | undefined,
  command: Export,
) => {
  const absolutePath = path.resolve(process.cwd(), destination)
  const dir = path.dirname(absolutePath)

  try {
    fs.mkdirSync(dir, {recursive: true})

    const delimiter = determineDelimiter(destination, customDelimiter)
    const output = await new AsyncParser({
      delimiter,
      formatters: {
        string: stringQuoteOnlyIfNecessaryFormatter({escapedQuote: '', quote: ''}),
      },
    })
      .parse(parameters)
      .promise()

    fs.writeFileSync(absolutePath, output)
  } catch (error) {
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException
      switch (nodeError.code) {
        case 'EACCES': {
          command.error(`Permission denied. Cannot write to ${absolutePath}`, {exit: 1})
        }

        case 'ENOSPC': {
          command.error(`No space left on device. Cannot write to ${absolutePath}`, {exit: 1})
        }

        default: {
          command.error(`Failed to export to file ${destination}: ${error.message}`, {exit: 1})
        }
      }
    } else {
      command.error(`Unknown error occurred while writing to ${absolutePath}`, {exit: 1})
    }
  }
}

export async function getProfileFromCredentials(command: Import | Export) {
  const configPath = path.join(os.homedir(), '.aws', 'config')
  const configProfiles = collectProfiles(configPath, /^\[profile ([^\]]+)]/gm, command)

  const credentialsPath = path.join(os.homedir(), '.aws', 'credentials')
  const credentialsProfiles = collectProfiles(credentialsPath, /^\[([^\]]+)]/gm, command)

  const profiles = [...new Set([...configProfiles, ...credentialsProfiles])]
  if (profiles.length === 0) {
    command.error(`No AWS profiles found in ${configPath} or ${credentialsPath}`, {exit: 1})
  }

  return await select({
    choices: profiles.map((p) => ({name: p, value: p})),
    message: 'Please select an AWS profile:',
  })
}

function collectProfiles(path: string, reg: RegExp, command: Import | Export) {
  let profiles: string[] = []
  try {
    checkFileAccess(path, command)
    const configContent = fs.readFileSync(path, 'utf8')
    let match
    while ((match = reg.exec(configContent)) !== null) {
      profiles.push(match[1])
    }
  } catch {
    command.skipped(`No ${path} found or not readable. Skipping...`)
  }

  return profiles
}

export function checkFileAccess(filePath: string, command: Import | Export): void {
  try {
    fs.accessSync(filePath, fs.constants.R_OK)
  } catch (error) {
    if (error instanceof Error) {
      const nodeError = error as NodeJS.ErrnoException
      switch (nodeError.code) {
        case 'ENOENT': {
          throw new Error(`File not found: ${filePath}`)
        }

        case 'EACCES': {
          throw new Error(`Permission denied. Cannot read file: ${filePath}`)
        }

        case 'EPERM': {
          throw new Error(`Operation not permitted on file: ${filePath}`)
        }

        default: {
          throw new Error(`Unexpected error accessing file ${filePath}: ${error.message}`)
        }
      }
    } else {
      throw new Error(`Unknown error occurred`)
    }
  }
}

export function checkOnePasswordCli(command: Import) {
  validateCli().catch((err) => {
    command.error(err.message, {
      message: 'Unable to access 1Password CLI',
      suggestions: ['Ensure that 1Password CLI is installed'],
      ref: 'https://developer.1password.com/docs/cli',
    })
  })
}

export function getOnePasswordSecret(ref: string, command: Import) {
  command.info(`Reading 1Password secret at ${chalk.yellow(ref)}`)
  return read.parse(ref, {noNewline: true})
}
