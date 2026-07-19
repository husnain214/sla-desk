import { test, expect } from "@playwright/test";
import { uniqueEmail, TEST_PASSWORD } from "./helpers";

test("signup, login, and logout flow", async ({ page }) => {
  const email = uniqueEmail("customer");

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Test Customer");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
  await page
    .getByLabel("Confirm Password", { exact: true })
    .fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(page).toHaveURL("/login");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText("Test Customer")).toBeVisible();

  await page.getByText("Test Customer").click();
  await page.getByRole("menuitem", { name: "Log out" }).click();

  await expect(page).toHaveURL("/login");
});

test("unauthenticated user is redirected away from the dashboard", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});
