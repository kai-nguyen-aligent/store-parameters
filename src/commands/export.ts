import {GetParametersByPathCommand, Parameter, SSMClient} from '@aws-sdk/client-ssm'
import {fromIni} from '@aws-sdk/credential-providers'
import {Args, Flags} from '@oclif/core'
import inquirer from 'inquirer'

import {exportToCSV, getMFACode} from '../utils/utilities.js'
import {BaseCommand} from './base-command.js'

export default class Export extends BaseCommand<typeof Export> {
  static override args = {
    file: Args.string({description: 'Output csv file', required: true}),
  }

  static override description = 'Export SSM path to csv file'

  static override examples = ['<%= config.bin %> <%= command.id %> <path-to-csv-file> --path </ssm/path>']

  static flags = {
    path: Flags.string({char: 'p', description: 'SSM path to export', required: true}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Export)

    const client = new SSMClient({
      credentials: fromIni({
        mfaCodeProvider: getMFACode,
        profile: flags.profile,
      }),
      region: flags.region,
    })

    const {proceed} = await inquirer.prompt({
      default: false,
      message: `Are you sure you want to export SSM parameters from ${flags.profile}?`,
      name: 'proceed',
      type: 'confirm',
    })

    if (!proceed) {
      return
    }

    const parameters: Parameter[] = []
    let nextToken: string | undefined

    do {
      const command = new GetParametersByPathCommand({MaxResults: 100, Path: flags.path})

      // eslint-disable-next-line no-await-in-loop
      const {NextToken, Parameters} = await client.send(command)

      if (Parameters) {
        const filteredParameters = Parameters.map((param) => ({
          Name: param.Name,
          Type: param.Type,
          Value: param.Value,
        }))
        parameters.push(...filteredParameters)
      }

      nextToken = NextToken
    } while (nextToken)

    if (parameters.length === 0) {
      console.log('No parameters found to export')
      return
    }

    await exportToCSV(parameters, args.file)
  }
}
