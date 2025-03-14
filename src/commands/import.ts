/* eslint-disable no-await-in-loop */
import {PutParameterCommand, SSMClient} from '@aws-sdk/client-ssm'
import {confirm} from '@inquirer/prompts'
import {Args} from '@oclif/core'
import chalk from 'chalk'

import {BaseCommand} from '../utils/base-command.js'
import {getCredentials, getProfileFromCredentials, parseCSV} from '../utils/utilities.js'

export default class Import extends BaseCommand<typeof Import> {
  static override args = {
    file: Args.string({description: 'Input csv file', required: true}),
  }

  static description = 'Import csv file to SSM'

  static examples = ['<%= config.bin %> <%= command.id %> <path-to-csv-file>']

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Import)
    const {debug, profile, region} = flags

    const awsProfile = profile || (await getProfileFromCredentials(this, debug))

    const isConfirmed = await confirm({message: `Are you sure you want to import SSM parameters to ${awsProfile}?`})

    if (!isConfirmed) {
      this.warn('Operation cancelled by user')
      return
    }
    const params = await parseCSV(args.file, flags.delimiter, this, debug)

    const client = new SSMClient({
      credentials: await getCredentials(awsProfile),
      region,
    })

    for (const param of params) {
      const command = new PutParameterCommand({
        Name: param.Name,
        Overwrite: true,
        Type: param.Type,
        Value: param.Value,
      })

      await client.send(command)
      this.log(`Imported ${param.Name} as ${param.Type}...`)

      await new Promise((resolve) => {
        setTimeout(resolve, 200)
      })
    }

    this.log(chalk.greenBright(`All ${params.length} parameters are imported to ${awsProfile} Parameter Store!`))
  }
}
