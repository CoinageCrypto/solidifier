#!/usr/bin/env node
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const solidifier = require('solidifier');

// List all files in a directory in Node.js recursively in a synchronous fashion
const findSolFiles = (dir, relativePath = '', filelist = {}) => {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			findSolFiles(fullPath, path.join(relativePath, file), filelist);
		} else if (path.extname(file) === '.sol') {
			filelist[path.join(relativePath, file)] = {
				textContents: fs.readFileSync(fullPath, 'utf8'),
			};
		}
	});

	return filelist;
};

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
			normalize: true,
			nargs: 1,
		},
		f: {
			alias: 'insertFileNames',
			describe: 'Includes the name of the files as a comment in the flattened output',
			type: 'boolean',
			default: false,
		},
		i: {
			alias: 'inputDirectory',
			describe:
				'The directory where your contracts are located. Imports are resolved relative to this directory. Defaults to the directory the entry point contract is in.',
			type: 'string',
			normalize: true,
			nargs: 1,
		},
		o: {
			alias: 'outputDirectory',
			describe: 'The directory for contract output. This will default outputSuffix to "" so the folder structure is maintained.',
			type: 'string',
			normalize: true,
			nargs: 1,
		},
		s: {
			alias: 'outputSuffix',
			describe: 'The suffix to add to the output filename of the result. Defaults to `flattened`, e.g. <contract-name>-flattened.sol.',
			type: 'string',
			default: '-flattened',
			nargs: 1,
		},
		w: {
			alias: 'stripExcessWhitespace',
			describe: 'Removes any excess whitespace from the output.',
			type: 'boolean',
			default: true,
		}
	})

	// Version information
	.alias('v', 'version')
	.version(`Solidifier v${require('./package').version}`)
	.describe('v', 'show version information')

	// Copyright
	.epilog(`Copyright ${new Date().getFullYear()} Coinage`)
	
	// Parse!
	.argv;

// Let's prepare our options properly.
// Some just come straight across
const { outputDirectory, stripExcessWhitespace, insertFileNames } = argv;

// Others need a bit of massaging
let { outputSuffix } = argv;
if (outputSuffix === '-flattened' && outputDirectory) {
	outputSuffix = '';
} else if (inputDirectory && !outputDirectory) {
	outputDirectory = inputDirectory;
}

let contracts = argv.contract ? [path.resolve(argv.contract)] : undefined;
let inputDirectory = argv.inputDirectory ? path.resolve(argv.inputDirectory) : path.dirname(contract);

// Find all the contracts in the input directory
const files = findSolFiles(inputDirectory);

// If they haven't specified a contract then we want to do all of them.
if (!contracts && inputDirectory) {
	contracts = Object.keys(files);
}

for (let contract of contracts) {
	// Remove any common parts of the path from the contract path.
	contract = contract.replace(inputDirectory, '');
	if (contract[0] === '/') contract = contract.slice(1);

	const directory = path.dirname(contract);
	const file = path.basename(contract, '.sol');
	const outputFile = path.join(directory, `${file}${outputSuffix}.sol`);

	// Ok, time to process!
	solidifier.flatten({
		files,
		path: contract,
		insertFileNames,
		stripExcessWhitespace,
	}).then(result => {
		console.log(`Saving ${outputFile}`)
		const outputFullPath = path.join(outputDirectory, outputFile);
		// Ensure the directory exists
		mkdirp.sync(path.dirname(outputFullPath));

		// Now save it
		fs.writeFileSync(outputFullPath, result);

	}).catch(error => {
		
		throw error
	});
}