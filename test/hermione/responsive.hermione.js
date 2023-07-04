const { assert } = require('chai');
const { fireEvent } = require('@testing-library/react');
const { navMenuSelector, burgerBtnSelector, bodySelector, baseUrl } = require('../constants');



describe('\n🟨 Should match screenshot at different resolutions', async function () {

  const bug_id = process.env.BUG_ID;
  const bugQuery = bug_id ? `?bug_id=${bug_id}` : '';

  it(`test at 1920px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(1920, 1080);

    await this.browser.assertView('plain', 'body');
  });

  it(`test at 1024px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(1024, 900);

    await this.browser.assertView('plain', 'body');
  });

  it(`test at 768px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(768, 1024);

    await this.browser.assertView('plain', 'body');
  });

  it(`test at 320px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(320, 768);

    await this.browser.assertView('plain', 'body', {compositeImage: true, screenshotDelay: 1000});
  });
});

describe('\n🟨 Should not be scroll X axis', async function () {

  const bug_id = process.env.BUG_ID;
  const bugQuery = bug_id ? `?bug_id=${bug_id}` : '';

  it(`test at 1920px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(1920, 1080);

    const body = await this.browser.$(bodySelector);
    const bodyWidth = await body.getSize('width')
    const bodyScrollXWidth = await this.browser.execute(() => document.body.scrollWidth);

    assert.equal(bodyWidth, bodyScrollXWidth);
  });

  it(`test at 1024px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(1024, 900);

    const body = await this.browser.$(bodySelector);
    const bodyWidth = await body.getSize('width')
    const bodyScrollXWidth = await this.browser.execute(() => document.body.scrollWidth);

    assert.equal(bodyWidth, bodyScrollXWidth);
  });

  it(`test at 768px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(768, 1024);

    const body = await this.browser.$(bodySelector);
    const bodyWidth = await body.getSize('width')
    const bodyScrollXWidth = await this.browser.execute(() => document.body.scrollWidth);

    assert.equal(bodyWidth, bodyScrollXWidth);
  });

  it(`test at 320px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(320, 768);

    const body = await this.browser.$(bodySelector);
    const bodyWidth = await body.getSize('width')
    const bodyScrollXWidth = await this.browser.execute(() => document.body.scrollWidth);

    assert.equal(bodyWidth, bodyScrollXWidth);
  });
});

describe('\n🟨 Should have burger menu on small res', async function () {

  const bug_id = process.env.BUG_ID;
  const bugQuery = bug_id ? `?bug_id=${bug_id}` : '';

  it(`Appears at <576px, not at >=576px`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(576, 1080);

    const burgerBtn = await this.browser.$(burgerBtnSelector);
    expect(await burgerBtn.isDisplayedInViewport()).toBe(false)

    await this.browser.setWindowSize(575, 1080);
    expect(await burgerBtn.isDisplayedInViewport()).toBe(true)
  });

  it(`Menu appears on burger click`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(575, 1080);

    const burgerBtn = await this.browser.$(burgerBtnSelector);
    const navMenu = await this.browser.$(navMenuSelector);
    expect(await navMenu.isDisplayedInViewport()).toBe(false)

    await burgerBtn.click();
    expect(await navMenu.isDisplayedInViewport()).toBe(true)
  });

  it(`Menu should close on link click`, async function () {
    await this.browser.url(`${`${baseUrl}${bugQuery}`}`);
    await this.browser.setWindowSize(575, 1080);

    const burgerBtn = await this.browser.$(burgerBtnSelector);
    const navLink = await this.browser.$(navMenuSelector);

    await burgerBtn.click();
    expect(await navLink.isDisplayedInViewport()).toBe(true)

    await navLink.click();

    expect(await navLink.isDisplayedInViewport()).toBe(false)
  });

  it(`Menu should have collapsed class after item click`, async function () {
    await this.browser.url(`${baseUrl}${bugQuery}`);
    await this.browser.setWindowSize(575, 1080);

    const burgerBtn = await this.browser.$(burgerBtnSelector);
    const navLink = await this.browser.$(navMenuSelector);

    await burgerBtn.click();
    expect(await navLink.isDisplayedInViewport()).toBe(true)

    await navLink.click();

    const navLinkClassList = await navLink.getAttribute('class');

    expect(navLinkClassList.includes('collapse')).toBe(true)
  });

});