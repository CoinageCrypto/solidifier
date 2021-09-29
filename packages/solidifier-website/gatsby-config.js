const path = require('path');

module.exports = {
	plugins: [
		`gatsby-plugin-emotion`,
		`gatsby-plugin-react-helmet`,

		// Google Analytics
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: `UA-117848722-2`,
			},
		},

		// Adds additional headers to enable HTTP2 support with Netlify
		`gatsby-plugin-netlify`,
	],
};
