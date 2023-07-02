// @ts-nocheck
import { it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { basename } from '../constants';

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe('\n🔵 Pages exists', function () {
  it('"/" should open Main page', () => {
    const application = (
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId } = render(application);
    expect(getByTestId('home_header').textContent).toEqual('Welcome to Example store!');
  });

  it('"/catalog" should open Catalog page', () => {
    const application = (
      <MemoryRouter initialEntries={['/catalog']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId } = render(application);

    expect(getByTestId('catalog_header').textContent).toEqual('Catalog');
  });

  it('"/delivery" should open Delivery page', () => {
    const application = (
      <MemoryRouter initialEntries={['/delivery']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId } = render(application);

    expect(getByTestId('delivery_header').textContent).toEqual('Delivery');
  });

  it('"/contacts" should open Contacts page', () => {
    const application = (
      <MemoryRouter initialEntries={['/contacts']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId } = render(application);

    expect(getByTestId('contacts_header').textContent).toEqual('Contacts');
  });

  it('"/cart" should open Cart page', () => {
    const application = (
      <MemoryRouter initialEntries={['/cart']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByTestId } = render(application);

    expect(getByTestId('cart_header').textContent).toEqual('Shopping cart');
  });
});
