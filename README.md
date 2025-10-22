# store-parameters

CLI tool for import and export SSM parameters

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/store-parameters.svg)](https://npmjs.org/package/store-parameters)
[![Downloads/week](https://img.shields.io/npm/dw/store-parameters.svg)](https://npmjs.org/package/store-parameters)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20Me-orange)](https://coff.ee/kai.nguyen)

<!-- toc -->
* [store-parameters](#store-parameters)
* [Features](#features)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

- [store-parameters](#store-parameters)
- [Features](#features)
- [Usage](#usage)
- [Commands](#commands)
  - [`store-parameters export FILE`](#store-parameters-export-file)
  - [`store-parameters help [COMMAND]`](#store-parameters-help-command)
  - [`store-parameters import FILE`](#store-parameters-import-file)

# Features

- **🔄 Import & Export** - Seamlessly import and export AWS SSM parameters to/from CSV files
- **👤 AWS Profile Support** - Select from multiple AWS profiles with interactive prompts and MFA support
- **🔐 1Password Integration** - Reference secrets directly from 1Password vaults using `op://` URI format
- **🔒 Secure Strings** - Full support for both `String` and `SecureString` parameter types
- **📊 Custom Delimiters** - Support for CSV, TSV, and custom delimiter formats
- **✅ CSV Validation** - Built-in validation to ensure data integrity before import

# Usage

<!-- usage -->
```sh-session
$ npm install -g store-parameters
$ store-parameters COMMAND
running command...
$ store-parameters (--version)
store-parameters/1.1.2 linux-x64 node-v20.19.5
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
  $ store-parameters export FILE -p <value> [--json] [--profile <value>] [--region <value>] [-d <value>]

ARGUMENTS
  FILE  Output csv file

FLAGS
  -d, --delimiter=<value>  Custom delimiter of csv file
  -p, --path=<value>       (required) SSM path to export
      --profile=<value>    AWS profile name in ~/.aws/credentials
      --region=<value>     [default: ap-southeast-2] AWS region

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Export SSM path to csv file

EXAMPLES
  $ store-parameters export <path-to-csv-file> --path </ssm/path>
```

_See code: [src/commands/export.ts](https://github.com/kai-nguyen-aligent/store-parameters/blob/v1.1.2/src/commands/export.ts)_

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
  $ store-parameters import FILE [--json] [--profile <value>] [--region <value>] [-d <value>]

ARGUMENTS
  FILE  Input csv file

FLAGS
  -d, --delimiter=<value>  Custom delimiter of csv file
      --profile=<value>    AWS profile name in ~/.aws/credentials
      --region=<value>     [default: ap-southeast-2] AWS region

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Import csv file to SSM

EXAMPLES
  $ store-parameters import <path-to-csv-file>
```

_See code: [src/commands/import.ts](https://github.com/kai-nguyen-aligent/store-parameters/blob/v1.1.2/src/commands/import.ts)_
<!-- commandsstop -->
