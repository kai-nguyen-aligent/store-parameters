# store-parameters

CLI tool for import and export SSM parameters

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/store-parameters.svg)](https://npmjs.org/package/store-parameters)
[![Downloads/week](https://img.shields.io/npm/dw/store-parameters.svg)](https://npmjs.org/package/store-parameters)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g store-parameters
$ store-parameters COMMAND
running command...
$ store-parameters (--version)
store-parameters/0.0.1 linux-x64 node-v20.16.0
$ store-parameters --help [COMMAND]
USAGE
  $ store-parameters COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`store-parameters import FILE`](#store-parameters-import-file)
- [`store-parameters export FILE`](#store-parameters-export-file)

## `store-parameters import FILE`

Import a CSV based file to Store Parameters

```
USAGE
  $ store-parameters import FILE --profile <value> --region <value>

ARGUMENTS
  FILE  (required) Relative path to the input csv file

GLOBAL FLAGS
  --profile=<value>  [default: playground] AWS profile name as in `~/.aws/credentials`
  --region=<value>   [default: ap-southeast-2] Target AWS region

DESCRIPTION
  Import a CSV based file to Store Parameters

EXAMPLES
  $ store-parameters import ./ssm/parameters.csv
```

## `store-parameters export FILE`

Export Store Parameters to a CSV based file

```
USAGE
  $ store-parameters export FILE -p <value> --profile <value> --region <value>

ARGUMENTS
  FILE  (required) Relative path to the output csv file

FLAGS
  -p, --path=<value>  (required) Store Parameter path to export

GLOBAL FLAGS
  --profile=<value>  [default: playground] AWS profile name as in `~/.aws/credentials`
  --region=<value>   [default: ap-southeast-2] Target AWS region

DESCRIPTION
  Export Store Parameters to a CSV based file

EXAMPLES
  $ store-parameters export ./ssm/parameters.csv -p /ssm/path
```
