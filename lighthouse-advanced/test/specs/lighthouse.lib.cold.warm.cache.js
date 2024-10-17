import { browser, expect } from "@wdio/globals";

import { startFlow, desktopConfig } from "lighthouse/core/index.js";
import { writeFileSync } from "fs";

describe("Lighthouse flows", () => {
  it("should login with valid credentials", async () => {
    const puppeteer = await browser.getPuppeteer();
    let pages = await puppeteer.pages();
    console.log(pages.length);
    const page = pages[0];
    const flow = await startFlow(page, {
      config: desktopConfig,
      name: "Cold and warm navigations",
    });
    await flow.navigate("https://the-internet.herokuapp.com/login", {
      name: "Cold Navigation",
    });

    await flow.navigate("https://the-internet.herokuapp.com/login", {
      name: "Warm navigation",
      configContext: {
        settingsOverrides: { disableStorageReset: true },
      },
    });
    writeFileSync(
      "../html_reports/navigate-cold-warm-cache-report.html",
      await flow.generateReport()
    );
    await page.close();
  });
});
