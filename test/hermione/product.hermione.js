const { assert } = require('chai');
const { fireEvent } = require('@testing-library/react');
const puppeteer = require('puppeteer');
const path = require('path');
const { baseUrl, addToCartBtnSelector } = require('../constants');

describe('⬛ Add to cart button should match design', async function () {
  const randomId = Math.floor(Math.random() * 27);

  const bug_id = process.env.BUG_ID;
  const bugQuery = bug_id ? `?bug_id=${bug_id}` : '';

  it('Have correct class', async ({ browser }) => {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto(`${baseUrl}/catalog/${randomId}${bugQuery}`, {"waitUntil": "domcontentloaded"});

    await page.waitForSelector(addToCartBtnSelector, { timeout: 2000 });
    const addBtn = await page.$(addToCartBtnSelector);
    const addBtnClassList = await page.evaluate((element) => Array.from(element.classList), addBtn);

    expect(addBtnClassList.includes('btn-lg')).toBe(true);
  });

  it(`Should match screenshot`, async function () {
    await this.browser.url(`${baseUrl}/catalog/${randomId}${bugQuery}`);

    await this.browser.assertView('plain', addToCartBtnSelector);
  });
});
