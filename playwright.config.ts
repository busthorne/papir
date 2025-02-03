import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	timeout: 120000,
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
		baseURL: "http://127.0.0.1:18080",
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
	webServer: {
		command: "npm run dev -- --port 18080 --host",
		url: "http://127.0.0.1:18080",
		reuseExistingServer: false,
		stdout: "ignore",
		stderr: "pipe",
	},
	expect: {
		timeout: 30000,
	},
});
