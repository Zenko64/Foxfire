module.exports = {
	apps: [
		{
			name: "Foxfire",
			script: "./dist/index.js",
			autorestart: true,
			env: { NODE_ENV: "production" },
			instances: 1,
			exec_mode: "fork",
			interpreter: "bun",
			cwd: "./apps/backend",
		},
	],
};
