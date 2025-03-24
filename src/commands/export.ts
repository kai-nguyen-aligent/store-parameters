/* eslint-disable no-await-in-loop */
import {GetParametersByPathCommand, Parameter, SSMClient} from '@aws-sdk/client-ssm'
import {confirm} from '@inquirer/prompts'
import {Args, Flags} from '@oclif/core'

import {BaseCommand} from '../utils/base-command.js'
import {exportToCSV, getCredentials, getProfileFromCredentials} from '../utils/utilities.js'

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
    const {debug, path, profile, region} = flags

    const awsProfile = profile || (await getProfileFromCredentials(this, debug))

    const isConfirmed = await confirm({
      message: `Are you sure you want to export SSM parameters from ${awsProfile}?`,
    })

    if (!isConfirmed) {
      this.warn('Operation cancelled by user')
      return
    }

    const client = new SSMClient({
      credentials: await getCredentials(awsProfile),
      region,
    })

    const parameters: Parameter[] = []
    let nextToken: string | undefined

    do {
      const command = new GetParametersByPathCommand({MaxResults: 10, Path: path})

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

      await new Promise((resolve) => {
        setTimeout(resolve, 200)
      })
    } while (nextToken)

    if (parameters.length === 0) {
      console.log('No parameters found to export')
      return
    }

    await exportToCSV(parameters, args.file, flags.delimiter, this)
    this.log(`Exported ${parameters.length} parameters to ${args.file}!`)
  }
}
