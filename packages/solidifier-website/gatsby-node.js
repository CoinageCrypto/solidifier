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
	// Behaviour when mangle is on is that
	// const ast = parser.parse(contents, { tolerant: true, loc: true });
	// runs successfully, but the ast variable has one single object in it
	// so it hasn't parsed fully.
	const { plugins } = config._config;

	for (const plugin of plugins) {
		if (plugin instanceof webpack.optimize.UglifyJsPlugin) {
			plugin.options.mangle = false;
		}
	}

	// Add our polyfills before anything else in specific bundles.
	const { app, commons } = config._config.entry;

	if (app) {
		config._config.entry.app = [require.resolve('./polyfills'), app];
	}

	if (commons) {
		commons.unshift(require.resolve('./polyfills'));
	}

	return config;
};

// We like to keep our styles alongside our pages. These are not actual pages,
// so when they get created by Gatsby, go ahead and remove them immediately.
exports.onCreatePage = ({ page, boundActionCreators }) => {
	const { deletePage } = boundActionCreators;

	if (/\.styles\/$/.test(page.path)) {
		deletePage(page);
	}
};
