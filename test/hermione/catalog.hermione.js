const { assert } = require('chai');
const puppeteer = require('puppeteer');
const { fireEvent } = require('@testing-library/react');
const { baseUrl, addToCartBtnSelector, cardBadgeSelector, cartAmountSelector, cartTableSelector } = require('../constants');

describe('⬜ If product is in the cart', async function () {

  const bug_id = process.env.BUG_ID;
  const bugQuery = bug_id ? `?bug_id=${bug_id}` : '';

  afterEach(async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.waitForTimeout(1000);
    await page.goto(`${baseUrl}`, {"waitUntil": "domcontentloaded"});
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  const randomId = Math.floor(Math.random() * 27);

});

describe('⬜ Amount in Cart', async function () {

  const bug_id = process.env.BUG_ID;
  const bugQuery = bug_id ? `?bug_id=${bug_id}` : '';

  afterEach(async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.waitForTimeout(1200);
    await page.goto(`${baseUrl}`, {"waitUntil": "domcontentloaded"});
    await page.waitForTimeout(1200);

    await page.evaluate(() => {
      localStorage.clear();
    });
  });
  const randomId = Math.floor(Math.random() * 27);

  it('Should increasing if add more product to cart', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto(`${baseUrl}/catalog/${randomId}${bugQuery}`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(addToCartBtnSelector, { timeout: 3000 });
    const addBtn = await page.$(addToCartBtnSelector);
    await addBtn.click();
    await page.waitForTimeout(1500);
    await page.goto(`${baseUrl}/cart${bugQuery}`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(cartAmountSelector, { timeout: 3000 });
    const amountElement = await page.$(cartAmountSelector);
    expect(await page.evaluate((element) => element.textContent, amountElement)).toBe('1');

    await page.goto(`${baseUrl}/catalog/${randomId}${bugQuery}`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(addToCartBtnSelector, { timeout: 3000 });
    const addBtn2 = await page.$(addToCartBtnSelector);
    await addBtn2.click();
    await page.waitForTimeout(1500);
    await addBtn2.click();
    await page.waitForTimeout(1500);

    await page.goto(`${baseUrl}/cart${bugQuery}`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(cartAmountSelector, { timeout: 3000 });
    const amountElement2 = await page.$(cartAmountSelector);
    expect(await page.evaluate((element) => element.textContent, amountElement2)).toBe('3');
  });

});