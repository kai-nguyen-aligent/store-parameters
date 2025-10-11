/* eslint-disable no-await-in-loop */
import {PutParameterCommand, SSMClient} from '@aws-sdk/client-ssm'
import {confirm} from '@inquirer/prompts'
import {Args} from '@oclif/core'
import {ArkErrors} from 'arktype'
import chalk from 'chalk'
import {BaseCommand} from '../utils/base-command.js'
import {
  checkOnePasswordCli,
  getCredentials,
  getOnePasswordSecret,
  getProfileFromCredentials,
  parseCSV,
} from '../utils/utilities.js'

export default class Import extends BaseCommand<typeof Import> {
  static override args = {
    file: Args.string({description: 'Input csv file', required: true}),
  }

  static description = 'Import csv file to SSM'

  static examples = ['<%= config.bin %> <%= command.id %> <path-to-csv-file>']

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Import)
    const {profile, region} = flags

    const awsProfile = profile || (await getProfileFromCredentials(this))

    const isConfirmed = await confirm({message: `Are you sure you want to import SSM parameters to ${awsProfile}?`})

    if (!isConfirmed) {
      this.failed('Operation cancelled by user')
      return
    }

    const params = await parseCSV(args.file, flags.delimiter, this)

    if (params instanceof ArkErrors) {
      this.log(chalk.red(`${params.summary}\n`))
      this.error('CSV validation failed', {
        suggestions: [
          chalk.yellow('Check that your CSV file has the required columns: "Name", "Type", "Value"'),
          chalk.yellow('Ensure "Type" column contains only "String" or "SecureString"'),
          chalk.yellow('We support custom delimiters, pass your delimiter via "--delimiter" flag'),
          chalk.yellow(
            `Example format:\n  ${chalk.cyan(
              'Name,Type,Value\n  /app/config/database-name,String,my-database-name\n  /app/config/api-key,SecureString,op://vault/item/my-api-key\n',
            )}`,
          ),
        ],
      })
      return
    }

    const needOnePasswordCli = params.some((p) => p.Value.toLowerCase().startsWith('op://'))

    if (needOnePasswordCli) {
      checkOnePasswordCli(this)
    }

    const client = new SSMClient({
      credentials: await getCredentials(awsProfile),
      region,
    })

    this.progress('Start importing parameters...\n')
    for (const param of params) {
      const {Name, Type} = param
      const Value = param.Value.toLowerCase().startsWith('op://')
        ? getOnePasswordSecret(param.Value, this)
        : param.Value

      const command = new PutParameterCommand({Name, Type, Value, Overwrite: true})

      await client.send(command)
      this.info(`Imported ${Name} as ${Type}...`)

      await new Promise((resolve) => {
        setTimeout(resolve, 200)
      })
    }
    this.log('\n')
    this.success(`All ${params.length} parameters imported to ${awsProfile} Parameter Store!`)
  }
}
