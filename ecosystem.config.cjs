module.exports = {
	apps: [
		{
			name: "Foxfire",
			script: "./apps/backend/dist/index.js",
			autorestart: true,
			env: { NODE_ENV: "production" },
			insances: 1,
			exec_mode: "fork",
			interpreter: "~/.bun/bin/bun",
		},
	],
};
