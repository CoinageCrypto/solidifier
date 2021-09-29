#!/usr/bin/env node

console.error(
	'\n' +
		'---------------------------------------\n' +
		'You have mistakenly installed the `solidifier` package, which is a library \n' +
		'intended to be used from javascript code in node directly. If you want the command line interface, run:\n' +
		'\n' +
		'$ npm uninstall solidifier\n' +
		'$ npm install solidifier-cli\n' +
		'\n' +
		"Then the `solidifier` command will work for you when it's in your path.\n" +
		'---------------------------------------\n'
);
