import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("think, reveal, rate, and resume after a reload", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "What is hiding in the beam?" }),
  ).toBeVisible();
  await expect(page.getByTestId("answer")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath("question.png"),
    fullPage: true,
  });

  await page.getByTestId("reveal").click();
  await expect(page.getByTestId("answer")).toContainText(
    "60% circularly polarized",
  );
  await page.getByText("Source & exercise reference").click();
  await expect(page.getByTestId("answer")).toContainText("exercise 6.1");
  await page.screenshot({
    path: testInfo.outputPath("answer.png"),
    fullPage: true,
  });
  await page.getByTestId("rate-known").click();
  await expect(
    page.getByRole("heading", { name: "Where does the light go?" }),
  ).toBeVisible();
  await expect(page.getByTestId("known-count")).toHaveText("1");

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Where does the light go?" }),
  ).toBeVisible();
  await expect(page.getByTestId("known-count")).toHaveText("1");
  await expect(page.getByTestId("answer")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("finish a deck and revisit only the card marked for review", async ({
  page,
}) => {
  await page.goto("/");
  for (let index = 0; index < 5; index++) {
    await page.getByTestId("reveal").click();
    await page.getByTestId(index === 0 ? "rate-again" : "rate-known").click();
  }
  await expect(page.getByTestId("session-complete")).toBeVisible();
  await expect(page.getByTestId("known-count")).toHaveText("4");
  await page
    .getByRole("button", { name: "Review 1 card", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "What is hiding in the beam?" }),
  ).toBeVisible();
  await page.getByTestId("reveal").click();
  await page.getByTestId("rate-known").click();
  await expect(page.getByTestId("session-complete")).toBeVisible();
  await expect(page.getByTestId("known-count")).toHaveText("5");
  await expect(
    page.getByRole("button", { name: "Review cards", exact: true }),
  ).toBeDisabled();
});

test("notes survive reload and resetting ratings", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Jot down a thought/ }).click();
  await page
    .getByRole("textbox", { name: "Your thoughts for this card" })
    .fill("Use a quarter-wave plate before the analyzer.");
  await page.reload();
  await page.getByRole("button", { name: /Your saved thoughts/ }).click();
  await expect(page.getByRole("textbox")).toHaveValue(
    "Use a quarter-wave plate before the analyzer.",
  );
  await page.getByTestId("reveal").click();
  await page.getByTestId("rate-known").click();
  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.getByRole("button", { name: "Keep progress" }).click();
  await expect(page.getByTestId("known-count")).toHaveText("1");
  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.getByRole("button", { name: "Clear ratings" }).click();
  await expect(page.getByTestId("known-count")).toHaveText("0");
  await page.getByRole("button", { name: /Your saved thoughts/ }).click();
  await expect(page.getByRole("textbox")).toHaveValue(
    "Use a quarter-wave plate before the analyzer.",
  );
});

test("corrupt saved data recovers without breaking the cards", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("lumen.optics.v1", "{broken json"),
  );
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText(
    "Saved progress could not be read",
  );
  await page.getByTestId("reveal").click();
  await expect(page.getByTestId("answer")).toBeVisible();
});

test("unavailable storage is reported and studying remains usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage unavailable", "QuotaExceededError");
    };
  });
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("cannot save progress");
  await page.getByTestId("reveal").click();
  await page.getByTestId("rate-known").click();
  await expect(page.getByTestId("known-count")).toHaveText("1");
});

test("every card is reachable and fits narrow screens on both sides", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  const topics = [
    "Polarization",
    "Diffraction",
    "Interferometry",
    "Coherence",
    "Fourier optics",
  ];
  for (const topic of topics) {
    await page
      .getByRole("navigation", { name: "Choose a card" })
      .getByRole("button", { name: new RegExp(topic) })
      .click();
    await expect(page.getByTestId("reveal")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByTestId("reveal").click();
    await expect(page.getByTestId("answer")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const ratingBox = await page.getByTestId("rate-known").boundingBox();
    expect(ratingBox?.height).toBeGreaterThanOrEqual(44);
    await page.getByRole("button", { name: "Back to question" }).click();
    await expect(page.getByTestId("answer")).toHaveCount(0);
  }
});

test("keyboard can reveal an answer and focus follows the new content", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("reveal").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("answer").getByRole("heading")).toBeFocused();
  await page.getByRole("button", { name: "Back to question" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "What is hiding in the beam?" }),
  ).toBeFocused();
});

test("question and answer have no automated WCAG A or AA violations", async ({
  page,
}) => {
  await page.goto("/");
  const question = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(question.violations).toEqual([]);
  await page.getByTestId("reveal").click();
  const answer = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(answer.violations).toEqual([]);
});
