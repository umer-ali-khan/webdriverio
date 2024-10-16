import { browser, expect } from "@wdio/globals";
import LoginPage from "../pageobjects/login.page.js";
import SecurePage from "../pageobjects/secure.page.js";
import assert from "assert";

class SoftAssert {
  constructor() {
    this.errors = [];
  }

  softAssert(condition, message) {
    try {
      assert.ok(condition, message);
    } catch (error) {
      this.errors.push(error.message);
    }
  }

  assertAll() {
    if (this.errors.length > 0) {
      const allErrors = this.errors.join("\n");
      throw new Error(`Soft assertions failed:\n${allErrors}`);
    }
  }
}

const speedIndex = 2500;
const performanceScore = 0.8;

const recommendedSpeedIndex = 1500; // SpeedIndex is below 1.5ms
const recommendedPerfScore = 0.99; // Lighthouse Performance score is at 99% or higher

const formFactor = {
  networkThrottling: "online",
  cpuThrottling: 1,
  cacheEnabled: false,
  formFactor: "desktop",
};

describe("My Lighthouse application test", () => {
  let softAssert;

  before(async () => {
    await browser.enablePerformanceAudits(formFactor);
    softAssert = new SoftAssert();
  });

  it("should login with valid credentials", async () => {
    await LoginPage.open();
    let metrics = await browser.getMetrics();
    const loginPageSpeedIndex = metrics.speedIndex;
    assert.ok(loginPageSpeedIndex < speedIndex);

    let score = await browser.getPerformanceScore(); // get Lighthouse Performance score
    const loginPagePerfScore = score;
    assert.ok(loginPagePerfScore >= performanceScore);

    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    metrics = await browser.getMetrics();
    const homePageSpeedIndex = metrics.speedIndex;

    score = await browser.getPerformanceScore();
    const homePagePerfScore = score;

    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveText(
      expect.stringContaining("You logged into a secure area!")
    );

    softAssert.softAssert(
      loginPageSpeedIndex < recommendedSpeedIndex,
      "Login page Speed index is too high"
    );
    softAssert.softAssert(
      loginPagePerfScore >= recommendedPerfScore,
      "Login page Performance score is too low"
    );

    softAssert.softAssert(
      homePageSpeedIndex < recommendedSpeedIndex,
      "Home page Speed index is too high"
    );
    softAssert.softAssert(
      homePagePerfScore >= recommendedPerfScore,
      "Home page Performance score is too low"
    );
    softAssert.assertAll();
  });
});
