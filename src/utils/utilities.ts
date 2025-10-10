/* eslint-disable no-fallthrough */
import {read, validateCli} from '@1password/op-js'
import {Parameter} from '@aws-sdk/client-ssm'
import {fromIni} from '@aws-sdk/credential-providers'
import {input, select} from '@inquirer/prompts'
import stringQuoteOnlyIfNecessaryFormatter from '@json2csv/formatters/stringQuoteOnlyIfNecessary.js'
import {AsyncParser} from '@json2csv/node'
import {Command} from '@oclif/core'
import {ArkErrors, type} from 'arktype'
import csvtojson from 'csvtojson'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

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

const paramValidator = type([{Name: 'string', Type: '"SecureString" | "String"', Value: 'string'}])

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

export const parseCSV = async (
  filePath: string,
  customDelimiter: string | undefined,
  command: Command,
  debug = false,
) => {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const delimiter = determineDelimiter(filePath, customDelimiter)

  checkFileAccess(absolutePath, command)

  if (debug) {
    command.log(`Parsing file: ${absolutePath} using delimiter "${delimiter}"`)
  }

  const rawParams = await csvtojson({delimiter}).fromFile(absolutePath)
  const result = paramValidator(rawParams)

  if (result instanceof ArkErrors) {
    command.error(result.summary, {
      exit: 1,
      message: 'CSV validation failed',
      suggestions: [
        'Check that your CSV file has the required columns: Name, Type, Value',
        'Ensure Type column contains only "String" or "SecureString"',
        'We support custom delimiters, pass your delimiter via "--delimiter" flag',
        'Example format:\nName,Type,Value\n/app/config/database-name,String,my-database-name\n/app/config/api-key,SecureString,op://vault/item/my-api-key\n',
      ],
    })
  }

  return result
}

export const exportToCSV = async (
  parameters: Parameter[],
  destination: string,
  customDelimiter: string | undefined,
  command: Command,
  debug = false,
) => {
  const absolutePath = path.resolve(process.cwd(), destination)
  const dir = path.dirname(absolutePath)

  try {
    if (debug) {
      command.log(`Creating directory: ${dir}`)
    }

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

    if (debug) {
      command.log(`Exporting to file: ${absolutePath} with delimiter "${delimiter}"`)
    }

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

export async function getProfileFromCredentials(command: Command, debug = false) {
  const configPath = path.join(os.homedir(), '.aws', 'config')
  const configProfiles = collectProfiles(configPath, /^\[profile ([^\]]+)]/gm, command, debug)

  const credentialsPath = path.join(os.homedir(), '.aws', 'credentials')
  const credentialsProfiles = collectProfiles(credentialsPath, /^\[([^\]]+)]/gm, command, debug)

  const profiles = [...new Set([...configProfiles, ...credentialsProfiles])]
  if (profiles.length === 0) {
    command.error(`No AWS profiles found in ${configPath} or ${credentialsPath}`, {exit: 1})
  }

  return await select({
    choices: profiles.map((p) => ({name: p, value: p})),
    message: 'Please select an AWS profile:',
  })
}

function collectProfiles(path: string, reg: RegExp, command: Command, debug = false) {
  let profiles: string[] = []
  try {
    checkFileAccess(path, command, debug)
    const configContent = fs.readFileSync(path, 'utf8')
    let match
    while ((match = reg.exec(configContent)) !== null) {
      profiles.push(match[1])
    }
  } catch {
    command.log(`No ${path} found or not readable. Skipping...`)
  }

  return profiles
}

export function checkFileAccess(filePath: string, command: Command, debug = false): void {
  try {
    if (debug) {
      command.log(`Checking file access: ${filePath}`)
    }

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

export function checkOnePasswordCli(command: Command) {
  validateCli().catch((err) => {
    command.error(err.message, {
      message: 'Unable to access 1Password CLI',
      suggestions: ['Ensure that 1Password CLI is installed'],
      ref: 'https://developer.1password.com/docs/cli',
    })
  })
}

export function getOnePasswordSecret(ref: string, command: Command) {
  command.log(`Reading 1Password secret at ${ref}`)
  return read.parse(ref, {noNewline: true})
}
