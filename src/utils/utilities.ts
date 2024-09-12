import {Parameter} from '@aws-sdk/client-ssm'
import {AsyncParser} from '@json2csv/node'
import csvtojson from 'csvtojson'
import inquirer from 'inquirer'
import {writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

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

export const getMFACode = async (serial: string) => {
  const {mfaCode} = await inquirer.prompt([{message: `Enter MFA code for ${serial}:`, name: 'mfaCode', type: 'input'}])
  return mfaCode
}

export const parseCSV = async (filePath: string) => {
  const absolutePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), filePath)
  const delimiter = filePath.endsWith('.tsv') ? '\t' : ','

  const params = (await csvtojson({delimiter}).fromFile(absolutePath)) as Pick<
    StoreParameter,
    'Name' | 'Type' | 'Value'
  >[]

  return params
}

export const exportToCSV = async (parameters: Parameter[], destination: string) => {
  const absolutePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), destination)
  const delimiter = destination.endsWith('.tsv') ? '\t' : ','

  const output = await new AsyncParser({delimiter}).parse(parameters).promise()

  console.log(`Writing SSM params to ${absolutePath}`)
  writeFileSync(absolutePath, output)
}
