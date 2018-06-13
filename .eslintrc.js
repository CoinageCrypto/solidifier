module.exports = {
	extends: ['last', 'plugin:react/recommended'],
	env: {
		es6: true,
		jest: true,
		node: true,
		browser: true,
	},
	globals: {
		graphql: true,
	},
	rules: {
		'no-console': 'off',
		'prettier/prettier': 'off',
	},
};
