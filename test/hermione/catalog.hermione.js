const { assert } = require('chai');
const puppeteer = require('puppeteer');
const { fireEvent } = require('@testing-library/react');
const { baseUrl, addToCartBtnSelector, cardBadgeSelector, cartAmountSelector, cartTableSelector } = require('../constants');

describe('⬜ If product is in the cart', async function () {
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

  it('Catalog and product page should have Badge', async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto(`${baseUrl}/catalog/${randomId}`, {"waitUntil": "domcontentloaded"});
    await page.waitForSelector(addToCartBtnSelector, { timeout: 2000 });
    const addBtn = await page.$(addToCartBtnSelector);

    await addBtn.click();

    await page.waitForSelector(cardBadgeSelector, { timeout: 2000 });
    const spanSuccess = await page.$(cardBadgeSelector);
    const spanSuccessText = await page.evaluate((element) => element.textContent, spanSuccess);

    expect(spanSuccess).not.toBeNull();
    expect(spanSuccessText).toBe('Item in cart');

    await page.goto(`${baseUrl}/catalog/`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(`[data-testid="product_${randomId}"]`, { timeout: 2000 });
    const productCard = await page.$(`[data-testid="product_${randomId}"]`);
    const badge = await productCard.$(cardBadgeSelector);
    const badgeText = await page.evaluate((element) => element.textContent, badge);

    expect(badge).not.toBeNull();
    expect(badgeText).toBe('Item in cart');
  });
});

describe('⬜ Amount in Cart', async function () {
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

    await page.goto(`${baseUrl}/catalog/${randomId}`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(addToCartBtnSelector, { timeout: 3000 });
    const addBtn = await page.$(addToCartBtnSelector);
    await addBtn.click();
    await page.waitForTimeout(1500);
    await page.goto(`${baseUrl}/cart`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(cartAmountSelector, { timeout: 3000 });
    const amountElement = await page.$(cartAmountSelector);
    expect(await page.evaluate((element) => element.textContent, amountElement)).toBe('1');

    await page.goto(`${baseUrl}/catalog/${randomId}`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(addToCartBtnSelector, { timeout: 3000 });
    const addBtn2 = await page.$(addToCartBtnSelector);
    await addBtn2.click();
    await page.waitForTimeout(1500);
    await addBtn2.click();
    await page.waitForTimeout(1500);

    await page.goto(`${baseUrl}/cart`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(cartAmountSelector, { timeout: 3000 });
    const amountElement2 = await page.$(cartAmountSelector);
    expect(await page.evaluate((element) => element.textContent, amountElement2)).toBe('3');
  });

  it('Should be stored between page reload', async function ({ browser }) { 
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto(`${baseUrl}/catalog/${randomId}`, {"waitUntil": "domcontentloaded"});
    await page.waitForSelector(addToCartBtnSelector, { timeout: 2000 });
    const addBtn = await page.$(addToCartBtnSelector);
    await addBtn.click();
    await page.waitForTimeout(2000);

    await page.goto(`${baseUrl}/cart`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(cartAmountSelector, { timeout: 2000 });
    const amountElement = await page.$(cartAmountSelector);
    expect(await page.evaluate((element) => element.textContent, amountElement)).toBe('1');

    await page.reload();
    await page.waitForTimeout(3000);

    await page.waitForSelector(cartTableSelector, { timeout: 2000 });
    const productsList = await page.$(cartTableSelector);
    expect(productsList).not.toBe(null);

    await page.waitForSelector(cartAmountSelector, { timeout: 2000 });
    const amountElement2 = await page.$(cartAmountSelector);
    expect(await page.evaluate((element) => element.textContent, amountElement2)).toBe('1');
  });

});