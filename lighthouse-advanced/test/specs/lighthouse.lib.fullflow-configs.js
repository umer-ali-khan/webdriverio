import { browser, expect } from "@wdio/globals";

import lighthouse from "lighthouse";
import config from "./custom-configs";

const CHROME_DEBUG_PORT = 9222;

async function runLighthouse(url) {
  const result = await lighthouse(url, {
    port: CHROME_DEBUG_PORT,
    disableStorageReset: true,
    config: config,
  });
  return result.lhr;
}

describe("Lighthouse flows", () => {
  it("should login with valid credentials", async () => {
    it("lighthouse", async () => {
      const puppeteer = await browser.getPuppeteer();
      let pages = await puppeteer.pages();

      const page = pages[0];
      await page.goto("https://the-internet.herokuapp.com/login");
      const lhr = await runLighthouse(page.url());

      expect(lhr).toHaveLighthouseScoreGreaterThanOrEqual("seo", 0.8);
      expect(lhr).toHaveLighthouseScoreGreaterThanOrEqual("speed-index", 0.9);

      await page.close();
    });
  });
});
