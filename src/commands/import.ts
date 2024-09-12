import {PutParameterCommand, SSMClient} from '@aws-sdk/client-ssm'
import {confirm} from '@inquirer/prompts'
import {Args} from '@oclif/core'

import {getCredentials, parseCSV} from '../utils/utilities.js'
import {BaseCommand} from './base-command.js'

export default class Import extends BaseCommand<typeof Import> {
  static override args = {
    file: Args.string({description: 'Input csv file', required: true}),
  }

  static description = 'Import csv file to SSM'

  static examples = ['<%= config.bin %> <%= command.id %> <path-to-csv-file>']

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Import)

    const client = new SSMClient({
      credentials: await getCredentials(flags.profile),
      region: flags.region,
    })

    const isConfirmed = await confirm({message: `Are you sure you want to import SSM parameters to ${flags.profile}?`})

    if (!isConfirmed) {
      return
    }

    const params = await parseCSV(args.file)

    for (const param of params) {
      const command = new PutParameterCommand({
        Name: param.Name,
        Overwrite: true,
        Type: param.Type,
        Value: param.Value,
      })

      console.log(`Importing ${param.Name} as ${param.Type}...`)

      // eslint-disable-next-line no-await-in-loop
      await client.send(command)
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 200)
      })
    }

    console.log(`Finished importing SSM parameters to ${flags.profile}!`)
  }
}
