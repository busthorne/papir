import { test, expect } from "@playwright/test";

test("train car test", async ({ page }) => {
	await page.goto("/");
	// First wait for the h1 element to exist
	await page.waitForSelector("h1");
	// Then wait for the text to be fully typed out, ignoring case
	await expect(async () => {
		const text = await page.locator("h1").first().textContent();
		if (!text) throw new Error("Text content is empty");
		expect(text.toLowerCase()).toBe("int. train car — future");
	}).toPass({
		timeout: 5000,
		intervals: [100]
	});
});
