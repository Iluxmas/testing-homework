// @ts-nocheck
import { it, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { basename } from '../constants';

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe('\n🟡 Name in header is a link to main page', function () {
  it('It is exist and is Link ', () => {
    const application = (
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { container, getByTestId } = render(application);

    const linkElement = screen.getByRole('link', { name: /Example store/i });

    expect(linkElement).not.toBeNull();
  });

  it('It links to main page', () => {
    const basename = '/hw/store';
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { container, getByTestId } = render(application);

    const linkElement = screen.getByRole('link', { name: /Example store/i });
    const href = linkElement.getAttribute('href');

    expect(href).toBe('/');
  });
});

describe('\n🟡 Header nav contains links to site pages', function () {
  const linksData = [
    ['/catalog', 'Catalog'],
    ['/delivery', 'Delivery'],
    ['/contacts', 'Contacts'],
    ['/cart', 'Cart'],
  ];

  it('There are 4 links and they match Data', () => {
    const application = (
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId } = render(application);

    const navbar = getByTestId('navbar_linksContainer');
    const links = [...navbar.children];
    const menu = screen.getByTestId('menu_container');

    expect(links.length).toBe(4);
    expect(
      links.every(
        (el, idx) => el.getAttribute('href') === linksData[idx][0] && el.textContent.startsWith(linksData[idx][1])
      )
    ).toBe(true);
  });
});
