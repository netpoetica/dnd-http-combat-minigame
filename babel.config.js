module.exports = {
	presets: [
		['@babel/preset-env', {
			targets: {
				// This is needed in order to use Three.js in this build system.
				esmodules: true,
				node: 'current'
			}
		}],
		'@babel/preset-typescript'
	],
	plugins: [
		// Enable class properties. See: https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
		// These are supported in node >= 12 but not in ES6 for the browser.
		'@babel/plugin-proposal-class-properties',
	]
};
