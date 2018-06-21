#!/usr/bin/env node

const argv = require('yargs')
	// Examples
	.example('')

	// Help text
	.alias('h', 'help')
	.help('help')
	.usage('Usage: $0 [options]')
	.showHelpOnFail(true, 'Specify --help for available options')

	// Input
	.options({
		c: {
			alias: 'contract',
			describe: 'The entry point contract to flatten.',
			type: 'string',
			nargs: 1,
			requiresArg: true,
			demand: 'Entry point contract option is required.',
		},
		i: {
			alias: 'inputDir',
			describe:
				'The directory where your contracts are located. Imports are resolved relative to this directory. Defaults to the directory the entry point contract is in.',
			type: 'string',
			nargs: 1,
			requiresArg: true,
		},
		o: {
			alias: 'output',
			describe:
				'The output filename of the result. Defaults to <contract-name>-flattened.sol alongside the entry point contract.',
			type: 'string',
			nargs: 1,
			requiresArg: true,
		},
	})

	// Version information
	.alias('v', 'version')
	.version(`Solidifier v${require('./package').version}`)
	.describe('v', 'show version information')

	// Copyright
	.epilog(`Copyright ${new Date().getFullYear()} Coinage`).argv;
