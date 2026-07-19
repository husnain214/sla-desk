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
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL("/tickets");
}

test("customer cannot view another customer's ticket via direct URL", async ({
  browser,
}) => {
  const contextA = await browser.newContext();
  const pageA = await contextA.newPage();
  await signupAndLogin(pageA, uniqueEmail("customer-a"));

  await pageA.getByRole("button", { name: "New ticket" }).click();
  await pageA.getByLabel("Title").fill("Customer A's private ticket");
  await pageA.getByRole("button", { name: "Create ticket" }).click();
  await pageA.getByText("Customer A's private ticket").click();

  const ticketUrl = pageA.url();

  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  await signupAndLogin(pageB, uniqueEmail("customer-b"));

  await pageB.goto(ticketUrl);

  // the error boundary/message from earlier should surface, not the ticket content
  await expect(
    pageB.getByText("Customer A's private ticket"),
  ).not.toBeVisible();

  await contextA.close();
  await contextB.close();
});
