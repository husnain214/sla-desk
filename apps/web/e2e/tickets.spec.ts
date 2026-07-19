import { test, expect } from "@playwright/test";
import { uniqueEmail, TEST_PASSWORD } from "./helpers";

async function signupAndLogin(
  page: import("@playwright/test").Page,
  email: string,
) {
  await page.goto("/signup");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
  await page.getByLabel("Confirm Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();

  await page.waitForURL("/login");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/");
}

test("customer can create a ticket and see it in the list", async ({
  page,
}) => {
  await signupAndLogin(page, uniqueEmail("customer"));

  await page.getByRole("button", { name: "New ticket" }).click();
  await page.getByLabel("Title").fill("Printer not working");
  await page.getByLabel("Description").fill("It just beeps repeatedly.");
  await page.getByLabel("Category").fill("Hardware");
  await page.getByRole("button", { name: "Create ticket" }).click();

  await expect(page.getByText("Printer not working")).toBeVisible();
});

test("clicking a ticket opens its detail page", async ({ page }) => {
  await signupAndLogin(page, uniqueEmail("customer"));

  await page.getByRole("button", { name: "New ticket" }).click();
  await page.getByLabel("Title").fill("Cannot access invoice");
  await page.getByRole("button", { name: "Create ticket" }).click();

  await page.getByText("Cannot access invoice").click();
  await expect(
    page.getByRole("heading", { name: "Cannot access invoice" }),
  ).toBeVisible();
});
