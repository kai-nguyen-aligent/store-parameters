import {Parameter} from '@aws-sdk/client-ssm'
import {fromIni} from '@aws-sdk/credential-providers'
import {input} from '@inquirer/prompts'
import {AsyncParser} from '@json2csv/node'
import csvtojson from 'csvtojson'
import {writeFileSync} from 'node:fs'
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

export const parseCSV = async (filePath: string) => {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const delimiter = filePath.endsWith('.tsv') ? '\t' : ','

  console.log(`Reading SSM params from ${absolutePath}`)

  const params = (await csvtojson({delimiter}).fromFile(absolutePath)) as Pick<
    StoreParameter,
    'Name' | 'Type' | 'Value'
  >[]

  return params
}

export const exportToCSV = async (parameters: Parameter[], destination: string) => {
  const absolutePath = path.resolve(process.cwd(), destination)
  const delimiter = destination.endsWith('.tsv') ? '\t' : ','

  const output = await new AsyncParser({delimiter}).parse(parameters).promise()

  console.log(`Writing SSM params to ${absolutePath}`)
  writeFileSync(absolutePath, output)
}
