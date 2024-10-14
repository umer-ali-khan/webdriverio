import { browser, expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import SecurePage from '../pageobjects/secure.page.js'


describe('My Lighthouse application PWA test', () => {
    let softAssert;

    before(async () => {
       
        // await browser.enablePerformanceAudits();
       
    })

    it('Check PWA Compliance', async () => {
        await LoginPage.open()
       
        const result = await browser.checkPWA()
        expect(result.passed).toBe(true)
       
    })
})

