# store-parameters

CLI tool for import and export SSM parameters

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/store-parameters.svg)](https://npmjs.org/package/store-parameters)
[![Downloads/week](https://img.shields.io/npm/dw/store-parameters.svg)](https://npmjs.org/package/store-parameters)

<!-- toc -->
* [store-parameters](#store-parameters)
* [Binary Usage](#binary-usage)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Binary Usage

1. Download prebuilt binary from [Releases](https://github.com/kai-nguyen-aligent/store-parameters/releases)
2. Extract the binary and add to your PATH:

```bash
  # If `~/bin` does not exist, run
  mkdir -p ~/bin
  tar -xzf store-parameters-v0.0.5-eba96c0-linux-x64.tar.gz -C ~/bin
  chmod +x ~/bin/store-parameters/bin/store-parameters
  # Add new binary to your PATH
  echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
```

3. Test if the tool works correctly

```sh-session
  $ store-parameters (--version)
  store-parameters/0.0.6 linux-x64 node-v20.18.0
```

# Usage

<!-- usage -->
```sh-session
$ npm install -g store-parameters
$ store-parameters COMMAND
running command...
$ store-parameters (--version)
store-parameters/1.0.0 linux-x64 node-v20.19.0
$ store-parameters --help [COMMAND]
USAGE
  $ store-parameters COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`store-parameters export FILE`](#store-parameters-export-file)
* [`store-parameters help [COMMAND]`](#store-parameters-help-command)
* [`store-parameters import FILE`](#store-parameters-import-file)

## `store-parameters export FILE`

Export SSM path to csv file

```
USAGE
  $ store-parameters export FILE -p <value> [--json] [--debug] [--profile <value>] [--region <value>] [-d
    <value>]

ARGUMENTS
  FILE  Output csv file

FLAGS
  -d, --delimiter=<value>  Custom delimiter of csv file
  -p, --path=<value>       (required) SSM path to export
      --debug              Enable debug mode
      --profile=<value>    AWS profile name in ~/.aws/credentials
      --region=<value>     [default: ap-southeast-2] AWS region

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Export SSM path to csv file

EXAMPLES
  $ store-parameters export <path-to-csv-file> --path </ssm/path>
```

_See code: [src/commands/export.ts](https://github.com/kai-nguyen-aligent/store-parameters/blob/v1.0.0/src/commands/export.ts)_

## `store-parameters help [COMMAND]`

Display help for store-parameters.

```
USAGE
  $ store-parameters help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for store-parameters.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.11/src/commands/help.ts)_

## `store-parameters import FILE`

Import csv file to SSM

```
USAGE
  $ store-parameters import FILE [--json] [--debug] [--profile <value>] [--region <value>] [-d <value>]

ARGUMENTS
  FILE  Input csv file

FLAGS
  -d, --delimiter=<value>  Custom delimiter of csv file
      --debug              Enable debug mode
      --profile=<value>    AWS profile name in ~/.aws/credentials
      --region=<value>     [default: ap-southeast-2] AWS region

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Import csv file to SSM

EXAMPLES
  $ store-parameters import <path-to-csv-file>
```

_See code: [src/commands/import.ts](https://github.com/kai-nguyen-aligent/store-parameters/blob/v1.0.0/src/commands/import.ts)_
<!-- commandsstop -->
