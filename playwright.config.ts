import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		["list"],
		["html", { outputFolder: "test-results" }],
		["junit", { outputFile: "test-results/junit.xml" }],
		["json", { outputFile: "test-results/results.json" }],
	],
	use: {
		baseURL: process.env.CI ? "http://127.0.0.1:5173" : "http://127.0.0.1:5174",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
	webServer: process.env.CI ? {
		command: "npm run build && npm run preview -- --port 5173 --host",
		url: "http://127.0.0.1:5173",
		reuseExistingServer: false,
		stdout: "pipe",
		stderr: "pipe",
		timeout: 60000,
		ignoreHTTPSErrors: true
	} : undefined,
	expect: {
		timeout: 10000
	},
	globalTimeout: 600000
});
