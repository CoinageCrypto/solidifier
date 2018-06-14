const webpack = require('webpack');

exports.modifyWebpackConfig = ({ config }) => {
	// This is because we get
	// -------------------
	// ERROR  Failed to compile with 3 errors                                 20:28:24
	//
	// This dependency was not found:
	//
	// * fs in ./~/solidity-parser-antlr/dist/tokens.js, ./~/solidity-parser-antlr/dist/antlr4/CharStreams.js and 1 other
	//
	// To install it, you can run: npm install --save fs
	// -------------------
	//
	// The solution came from here:
	// https://github.com/gatsbyjs/gatsby/issues/2107
	config.merge({
		node: { fs: 'empty' },
	});

	// Disable uglify's mangle feature because the build doesn't work when mangled.
	const { plugins } = config._config;

	for (const plugin of plugins) {
		if (plugin instanceof webpack.optimize.UglifyJsPlugin) {
			plugin.options.mangle = false;
		}
	}

	// Add our polyfills before anything else in specific bundles.
	const { app, cms, commons } = config._config.entry;

	if (app) {
		config._config.entry.app = [require.resolve('./polyfills'), app];
	}

	if (cms) {
		cms.unshift(require.resolve('./polyfills'));
	}

	if (commons) {
		commons.unshift(require.resolve('./polyfills'));
	}

	return config;
};
