import {Command, Flags, Interfaces} from '@oclif/core'
import {PrettyPrintableError} from '@oclif/core/interfaces'
import chalk from 'chalk'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export type ErrorOptions = {code?: string; exit?: number | false} & PrettyPrintableError

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    profile: Flags.string({description: 'AWS profile name in ~/.aws/credentials'}),
    region: Flags.string({default: 'ap-southeast-2', description: 'AWS region'}),
    delimiter: Flags.string({char: 'd', description: 'Custom delimiter of csv file', required: false}),
  }

  // add the --json flag
  static enableJsonFlag = true

  protected args!: Args<T>
  protected flags!: Flags<T>

  public async init(): Promise<void> {
    await super.init()
    const {args, flags} = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>
  }

  protected async catch(err: {exitCode?: number} & Error): Promise<unknown> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<unknown> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  override error(input: string, options: ErrorOptions = {}) {
    process.stderr.write(chalk.red(`🚫 ${input}\n`))
    // Create a "silent" error by passing an empty string to super.error
    // This preserves oclif's exit behavior without double printing
    return super.error('', {...options, exit: options.exit || 2})
  }

  failed(message: string) {
    this.log(chalk.red(`💥 ${message}`))
  }

  skipped(message: string): void {
    this.log(chalk.yellow(`⏭️  ${message}`))
  }

  info(message: string): void {
    this.log(chalk.blue(`💡 ${message}`))
  }

  success(message: string): void {
    this.log(chalk.green(`✅ ${message}`))
  }

  progress(message: string): void {
    this.log(chalk.cyan(`⏳ ${message}`))
  }
}
