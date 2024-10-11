/* eslint-disable no-fallthrough */
import {Parameter} from '@aws-sdk/client-ssm'
import {fromIni} from '@aws-sdk/credential-providers'
import {input, select} from '@inquirer/prompts'
import {AsyncParser} from '@json2csv/node'
import {Command} from '@oclif/core'
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

export const getCredentials = async (profile: string): Promise<ReturnType<typeof fromIni>> =>
  fromIni({
    mfaCodeProvider: async (serial: string) => input({message: `Enter MFA code for ${serial}:`}),
    profile,
  })

export const parseCSV = async (filePath: string, command: Command, debug = false) => {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const delimiter = filePath.endsWith('.tsv') ? '\t' : ','

  checkFileAccess(absolutePath, command)

  if (debug) {
    command.log(`Parsing file: ${absolutePath}`)
  }

  const params = (await csvtojson({delimiter}).fromFile(absolutePath)) as Pick<
    StoreParameter,
    'Name' | 'Type' | 'Value'
  >[]

  return params
}

export const exportToCSV = async (parameters: Parameter[], destination: string, command: Command, debug = false) => {
  const absolutePath = path.resolve(process.cwd(), destination)
  const dir = path.dirname(absolutePath)

  try {
    if (debug) {
      command.log(`Creating directory: ${dir}`)
    }

    fs.mkdirSync(dir, {recursive: true})

    const delimiter = destination.endsWith('.tsv') ? '\t' : ','
    const output = await new AsyncParser({delimiter}).parse(parameters).promise()

    if (debug) {
      command.log(`Exporting to file: ${absolutePath}`)
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
  const credentialsPath = path.join(os.homedir(), '.aws', 'credentials')

  try {
    checkFileAccess(credentialsPath, command, debug)

    const fileContent = fs.readFileSync(credentialsPath, 'utf8')
    // The regex matches lines that start with a square bracket, capturing the profile name inside.
    const profileRegex = /^\[([^\]]+)]/gm
    const profiles: string[] = []
    let match

    while ((match = profileRegex.exec(fileContent)) !== null) {
      profiles.push(match[1])
    }

    if (profiles.length === 0) {
      throw new Error(`No profiles found in ${credentialsPath}`)
    }

    return await select({
      choices: profiles.map((p) => ({name: p, value: p})),
      message: 'Please select an AWS profile:',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    command.error(errorMessage, {exit: 1})
  }
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
          command.error(`File not found: ${filePath}`, {exit: 1})
        }

        case 'EACCES': {
          command.error(`Permission denied. Cannot read file: ${filePath}`, {exit: 1})
        }

        case 'EPERM': {
          command.error(`Operation not permitted on file: ${filePath}`, {exit: 1})
        }

        default: {
          command.error(`Unexpected error accessing file ${filePath}: ${error.message}`, {exit: 1})
        }
      }
    } else {
      command.error(`Unknown error occurred`, {exit: 1})
    }
  }
}
