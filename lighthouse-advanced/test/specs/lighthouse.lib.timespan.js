import { browser, expect } from "@wdio/globals";

import { startFlow, desktopConfig } from "lighthouse/core/index.js";
import { writeFileSync } from "fs";

describe("Lighthouse flows", () => {
  it("should login with valid credentials", async () => {
    const puppeteer = await browser.getPuppeteer();
    let pages = await puppeteer.pages();
    console.log(pages.length);
    const page = pages[0];
    const flow = await startFlow(page, { config: desktopConfig });
    await flow.navigate("https://the-internet.herokuapp.com/login");
    await flow.startTimespan();
    await page.waitForSelector("#username", { visible: true });
    await page.type("#username", "tomsmith");
    await page.type("#password", "SuperSecretPassword!");
    await page.click('button[type="submit"]');
    await page.waitForSelector("a[href*='logout']", { visible: true });
    await flow.endTimespan();
    await page.close();
    writeFileSync(
      "../html_reports/timespan-report.html",
      await flow.generateReport()
    );
  });
});
