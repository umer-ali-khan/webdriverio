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
    await flow.snapshot();
    await flow.startTimespan();
    await page.waitForSelector("#username", { visible: true });
    await page.type("#username", "tomsmith");
    await page.type("#password", "SuperSecretPassword!");
    await page.click('button[type="submit"]');
    await page.waitForSelector("a[href*='logout']", { visible: true });
    await flow.endTimespan();
    await flow.snapshot();
    await flow.navigate(async () => {
      await page.click("a[href*='logout']");
    });

    writeFileSync("full-flow-report.html", await flow.generateReport());
    await page.close();
  });
});
