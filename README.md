# store-parameters

CLI tool for import and export SSM parameters

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/store-parameters.svg)](https://npmjs.org/package/store-parameters)
[![Downloads/week](https://img.shields.io/npm/dw/store-parameters.svg)](https://npmjs.org/package/store-parameters)

<!-- toc -->
* [store-parameters](#store-parameters)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g store-parameters
$ store-parameters COMMAND
running command...
$ store-parameters (--version)
store-parameters/0.0.2 linux-x64 node-v20.17.0
$ store-parameters --help [COMMAND]
USAGE
  $ store-parameters COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`store-parameters help [COMMAND]`](#store-parameters-help-command)
* [`store-parameters plugins`](#store-parameters-plugins)
* [`store-parameters plugins add PLUGIN`](#store-parameters-plugins-add-plugin)
* [`store-parameters plugins:inspect PLUGIN...`](#store-parameters-pluginsinspect-plugin)
* [`store-parameters plugins install PLUGIN`](#store-parameters-plugins-install-plugin)
* [`store-parameters plugins link PATH`](#store-parameters-plugins-link-path)
* [`store-parameters plugins remove [PLUGIN]`](#store-parameters-plugins-remove-plugin)
* [`store-parameters plugins reset`](#store-parameters-plugins-reset)
* [`store-parameters plugins uninstall [PLUGIN]`](#store-parameters-plugins-uninstall-plugin)
* [`store-parameters plugins unlink [PLUGIN]`](#store-parameters-plugins-unlink-plugin)
* [`store-parameters plugins update`](#store-parameters-plugins-update)

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

## `store-parameters plugins`

List installed plugins.

```
USAGE
  $ store-parameters plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ store-parameters plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.7/src/commands/plugins/index.ts)_

## `store-parameters plugins add PLUGIN`

Installs a plugin into store-parameters.

```
USAGE
  $ store-parameters plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into store-parameters.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the STORE_PARAMETERS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the STORE_PARAMETERS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ store-parameters plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ store-parameters plugins add myplugin

  Install a plugin from a github url.

    $ store-parameters plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ store-parameters plugins add someuser/someplugin
```

## `store-parameters plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ store-parameters plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ store-parameters plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.7/src/commands/plugins/inspect.ts)_

## `store-parameters plugins install PLUGIN`

Installs a plugin into store-parameters.

```
USAGE
  $ store-parameters plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into store-parameters.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the STORE_PARAMETERS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the STORE_PARAMETERS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ store-parameters plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ store-parameters plugins install myplugin

  Install a plugin from a github url.

    $ store-parameters plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ store-parameters plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.7/src/commands/plugins/install.ts)_

## `store-parameters plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ store-parameters plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ store-parameters plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.7/src/commands/plugins/link.ts)_

## `store-parameters plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ store-parameters plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ store-parameters plugins unlink
  $ store-parameters plugins remove

EXAMPLES
  $ store-parameters plugins remove myplugin
```

## `store-parameters plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ store-parameters plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.7/src/commands/plugins/reset.ts)_

## `store-parameters plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ store-parameters plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ store-parameters plugins unlink
  $ store-parameters plugins remove

EXAMPLES
  $ store-parameters plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.7/src/commands/plugins/uninstall.ts)_

## `store-parameters plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ store-parameters plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ store-parameters plugins unlink
  $ store-parameters plugins remove

EXAMPLES
  $ store-parameters plugins unlink myplugin
```

## `store-parameters plugins update`

Update installed plugins.

```
USAGE
  $ store-parameters plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.7/src/commands/plugins/update.ts)_
<!-- commandsstop -->

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
