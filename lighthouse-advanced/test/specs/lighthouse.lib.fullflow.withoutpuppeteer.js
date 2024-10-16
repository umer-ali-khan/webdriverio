import { browser, expect } from "@wdio/globals";

import { startFlow, desktopConfig } from "lighthouse/core/index.js";
import { writeFileSync } from "fs";

import LoginPage from "../pageobjects/login.page.js";
import SecurePage from "../pageobjects/secure.page.js";

describe("Lighthouse flows", () => {
  it("should login with valid credentials", async () => {
    const puppeteer = await browser.getPuppeteer();
    let pages = await puppeteer.pages();
    console.log(pages.length);
    const page = pages[0];
    const flow = await startFlow(page, { config: desktopConfig });
    await LoginPage.open();
    await flow.snapshot();
    await flow.startTimespan();
    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveText(
      expect.stringContaining("You logged into a secure area!")
    );
    await flow.endTimespan();
    await flow.snapshot();
    writeFileSync(
      "../html_reports/full-flow-without-puppeteer-report.html",
      await flow.generateReport()
    );
    open("../html_reports/full-flow-without-puppeteer-report.html", {
      wait: false,
    });
  });
});
