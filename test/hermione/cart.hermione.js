const { assert } = require('chai');
const puppeteer = require('puppeteer');
const { baseUrl, addToCartBtnSelector, cartTableSelector, cartClearBtnSelector } = require('../constants');

describe('⬜ Cart should', async function () {
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

  it('Clear after clear button click', async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto(`${baseUrl}/catalog/${randomId}`, {"waitUntil": "domcontentloaded"});
    await page.waitForSelector(addToCartBtnSelector, { timeout: 2000 });
    const addBtn = await page.$(addToCartBtnSelector);

    await addBtn.click();
    await page.waitForTimeout(1000);

    await page.goto(`${baseUrl}/cart`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(cartTableSelector, { timeout: 2000 });
    const productsList = await page.$(cartTableSelector);
    expect(productsList).not.toBe(null);

    const clearBtn = await page.$(cartClearBtnSelector);
    await clearBtn.click();
    await page.waitForTimeout(1000);

    const newProductsList = await page.$(cartTableSelector);
    expect(newProductsList).toBe(null);
  });
});