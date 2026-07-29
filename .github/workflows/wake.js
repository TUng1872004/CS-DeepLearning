const { chromium } = require("playwright");

const URL = process.env.URL;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60_000 });

  // sleeping apps show a "wake up" button instead of loading the app
  const wakeButton = page.getByRole("button", { name: /get this app back up/i });
  if (await wakeButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
    console.log("App is asleep, clicking wake button...");
    await wakeButton.click();
    await page.waitForTimeout(15_000);
  }

  console.log("Title:", await page.title());
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
