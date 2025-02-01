import { test, expect } from "@playwright/test";

test("train car test", async ({ page }) => {
	await page.goto("/");
	await page.waitForTimeout(2000);
	await expect(page.locator("h1").first()).toHaveText("INT. TRAIN CAR — FUTURE", {
		ignoreCase: true,
	});
});
